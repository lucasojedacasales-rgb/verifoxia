import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Fetches current best price + AI score for a product via SerpAPI + LLM
async function fetchCurrentDeal(base44, searchQuery, countryCode, currency) {
  // First get real prices from SerpAPI
  let serpPrices = [];
  try {
    const serpRes = await base44.asServiceRole.functions.invoke("searchProducts", {
      query: searchQuery,
      country_code: countryCode || "es"
    });
    const shoppingResults = serpRes?.data?.shopping_results || [];
    serpPrices = shoppingResults
      .filter((s) => s.price && s.url && s.url !== "#")
      .map((s) => ({
        store_name: s.store_name,
        price: s.price,
        currency: s.currency || currency || "EUR",
        url: s.url
      }));
  } catch (_) {
    // Fallback: LLM will estimate prices
  }

  const serpContext = serpPrices.length > 0
    ? `Precios reales encontrados:\n${serpPrices.map(p => `- ${p.store_name}: ${p.price} ${p.currency}`).join("\n")}`
    : "No hay precios reales disponibles.";

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Eres un experto en análisis de productos de compras online.
Producto: "${searchQuery}"
Moneda: ${currency || "EUR"}

${serpContext}

Devuelve SOLO un JSON con:
- "best_price": el precio más bajo actual (usa los precios reales si existen)
- "best_store": nombre de la tienda con mejor precio
- "best_store_url": URL de la mejor oferta
- "ai_score": puntuación de 0 a 100 de qué tan buena compra es AHORA (considera precio, disponibilidad, tendencias)
- "verdict": "comprar", "esperar" o "no_comprar"
- "reason": una frase corta explicando el cambio o estado actual`,
    response_json_schema: {
      type: "object",
      properties: {
        best_price: { type: "number" },
        best_store: { type: "string" },
        best_store_url: { type: "string" },
        ai_score: { type: "number" },
        verdict: { type: "string" },
        reason: { type: "string" }
      },
      required: ["best_price", "best_store", "ai_score", "verdict", "reason"]
    }
  });

  return result;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth: scheduler secret or admin user
    const schedulerSecret = Deno.env.get("SCHEDULER_SECRET");
    const incomingSecret = req.headers.get("x-scheduler-secret");
    const isScheduler = schedulerSecret && incomingSecret === schedulerSecret;

    if (!isScheduler) {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") {
        return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
      }
    }

    // Get all favorites
    const favorites = await base44.asServiceRole.entities.Favorite.filter({});
    if (!favorites.length) {
      return Response.json({ message: "No favorites to check", checked: 0 });
    }

    // Fetch all users to map emails
    const userIds = [...new Set(favorites.map(f => f.created_by_id).filter(Boolean))];
    const users = userIds.length > 0
      ? await base44.asServiceRole.entities.User.filter({ id: { $in: userIds } })
      : [];
    const userEmailMap = {};
    users.forEach(u => { userEmailMap[u.id] = u.email; });

    // Group by search_query to avoid duplicate searches
    const queryMap = {};
    for (const fav of favorites) {
      const key = `${fav.search_query}__${fav.country_code || "es"}`;
      if (!queryMap[key]) queryMap[key] = [];
      queryMap[key].push(fav);
    }

    let notified = 0;
    let checked = 0;
    const now = new Date().toISOString();

    for (const [key, favs] of Object.entries(queryMap)) {
      checked++;
      const query = favs[0].search_query;
      const countryCode = favs[0].country_code || "es";
      const currency = favs[0].currency || "EUR";

      const deal = await fetchCurrentDeal(base44, query, countryCode, currency);
      if (!deal) continue;

      const newPrice = deal.best_price;
      const newScore = deal.ai_score;

      for (const fav of favs) {
        const oldPrice = fav.best_price;
        const oldScore = fav.ai_score;

        // Calculate improvements
        const priceDropped = oldPrice != null && newPrice != null && newPrice < oldPrice;
        const scoreImproved = oldScore != null && newScore != null && newScore > oldScore;
        const priceDiff = priceDropped ? oldPrice - newPrice : 0;
        const priceDiffPct = priceDropped && oldPrice > 0 ? ((priceDiff / oldPrice) * 100).toFixed(0) : "0";

        const hasImprovement = priceDropped || scoreImproved;
        if (!hasImprovement) continue;

        const email = userEmailMap[fav.created_by_id];
        if (!email) continue;

        notified++;

        // Build email body
        const improvements = [];
        if (priceDropped) {
          improvements.push(`
            <div style="background:#0f172a;border-radius:12px;padding:16px;margin:12px 0;">
              <p style="color:#34d399;font-size:32px;font-weight:bold;margin:0;">${newPrice.toLocaleString()} ${currency}</p>
              <p style="color:#94a3b8;margin:4px 0 0;font-size:13px;">
                Antes: <s>${oldPrice.toLocaleString()} ${currency}</s>
                &nbsp;|&nbsp;
                <span style="color:#34d399;">Ahorro: ${priceDiff.toFixed(0)} ${currency} (${priceDiffPct}%)</span>
              </p>
            </div>`);
        }
        if (scoreImproved) {
          improvements.push(`
            <div style="background:#0f172a;border-radius:12px;padding:16px;margin:12px 0;">
              <p style="color:#fbbf24;font-size:18px;margin:0;">⭐ Puntuación Verifox: <strong>${newScore}/100</strong> (antes ${oldScore}/100)</p>
              <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">El producto ahora es mejor compra según nuestro análisis</p>
            </div>`);
        }

        const storeName = deal.best_store || fav.best_store || "la tienda";
        const storeUrl = deal.best_store_url || fav.best_store_url || "#";

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: `${priceDropped ? '💰' : '⭐'} ¡Mejora en "${fav.product_name}"! — ${priceDropped ? newPrice + ' ' + currency : 'Puntuación ' + newScore + '/100'}`,
          body: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:20px;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#1e293b;border-radius:16px;overflow:hidden;">
    
    <div style="background:linear-gradient(135deg,#3b82f6,#7c3aed);padding:30px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:26px;">🦊 VERIFOX</h1>
      <p style="color:#bfdbfe;margin:8px 0 0;">Tu producto favorito mejoró</p>
    </div>

    <div style="padding:30px;">
      <h2 style="color:#f1f5f9;margin-top:0;">${fav.product_name}</h2>
      ${improvements.join("")}

      <div style="background:#1e3a5f;border-radius:10px;padding:15px;margin:15px 0;">
        <p style="margin:0;color:#93c5fd;font-size:14px;">
          <strong>Veredicto actual:</strong> ${deal.verdict === "comprar" ? "✅ Compra recomendada" : deal.verdict === "esperar" ? "⏳ Mejor esperar" : "❌ No recomendado"}<br/>
          <span style="color:#94a3b8;">${deal.reason}</span>
        </p>
      </div>

      <div style="text-align:center;margin:25px 0;">
        <a href="${storeUrl}" 
           style="background:#3b82f6;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
          🛒 Ver oferta en ${storeName}
        </a>
      </div>

      <p style="color:#64748b;font-size:12px;text-align:center;margin-top:30px;border-top:1px solid #334155;padding-top:20px;">
        Producto guardado en tus favoritos de VERIFOX<br/>
        Este aviso se genera automáticamente cuando detectamos mejoras.
      </p>
    </div>
  </div>
</body>
</html>`,
          from_name: "VERIFOX Alertas"
        });

        // Update favorite with new data
        await base44.asServiceRole.entities.Favorite.update(fav.id, {
          best_price: newPrice,
          best_store: deal.best_store || fav.best_store,
          best_store_url: deal.best_store_url || fav.best_store_url,
          ai_score: newScore,
          verdict: deal.verdict || fav.verdict
        });
      }
    }

    return Response.json({
      message: `Revisados ${checked} productos, ${notified} notificaciones enviadas`,
      checked,
      notified
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});