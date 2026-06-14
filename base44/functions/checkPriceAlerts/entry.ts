import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Helper to fetch product price via LLM
async function fetchCurrentPrice(base44, searchQuery, countryName, currency) {
  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Eres un experto en precios de productos online. 
El usuario busca: "${searchQuery}"
País: ${countryName}
Moneda: ${currency}

Devuelve el precio más bajo aproximado que encontrarías hoy en las tiendas online más populares de ${countryName} para este producto.
Responde SOLO con un JSON: { "price": numero, "store": "nombre_tienda", "url": "url_busqueda" }`,
    response_json_schema: {
      type: "object",
      properties: {
        price: { type: "number" },
        store: { type: "string" },
        url: { type: "string" }
      }
    }
  });
  return result;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function can be called by admins manually or by scheduler
    // For webhook/scheduler use, we use service role directly
    const activeAlerts = await base44.asServiceRole.entities.PriceAlert.filter({ status: "active" });

    if (!activeAlerts.length) {
      return Response.json({ message: "No active alerts to check", checked: 0 });
    }

    let triggered = 0;
    let checked = 0;

    for (const alert of activeAlerts) {
      checked++;
      const priceData = await fetchCurrentPrice(
        base44,
        alert.search_query,
        alert.country_name || "España",
        alert.currency || "EUR"
      );

      const newPrice = priceData?.price;
      if (!newPrice) continue;

      // Update last_checked
      await base44.asServiceRole.entities.PriceAlert.update(alert.id, {
        last_checked: new Date().toISOString(),
        current_price: newPrice,
        best_store: priceData.store || alert.best_store,
        best_store_url: priceData.url || alert.best_store_url
      });

      // Check if price dropped below target
      if (newPrice <= alert.target_price) {
        triggered++;

        // Send email notification
        const storeLink = priceData.url || alert.best_store_url || "#";
        const storeName = priceData.store || alert.best_store || "la tienda";
        const savings = alert.current_price - newPrice;
        const savingsPct = ((savings / alert.current_price) * 100).toFixed(0);

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: alert.email,
          subject: `🎉 ¡Bajó el precio! ${alert.product_name} - ${newPrice} ${alert.currency}`,
          body: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
    
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🔔 Alerta de precio</h1>
      <p style="color: #bfdbfe; margin: 8px 0 0;">PriceWise te avisó a tiempo</p>
    </div>

    <div style="padding: 30px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">${alert.product_name}</h2>
      
      <div style="background: #0f172a; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px;">Precio actual</p>
        <p style="color: #34d399; font-size: 42px; font-weight: bold; margin: 0;">${newPrice.toLocaleString()} ${alert.currency}</p>
        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">
          Antes: <s>${alert.current_price?.toLocaleString()} ${alert.currency}</s> 
          &nbsp;|&nbsp; 
          <span style="color: #34d399;">Ahorro: ${savings.toFixed(0)} ${alert.currency} (${savingsPct}%)</span>
        </p>
      </div>

      <div style="background: #1e3a5f; border-radius: 10px; padding: 15px; margin: 15px 0;">
        <p style="margin: 0; color: #93c5fd; font-size: 14px;">
          <strong>Mejor precio en:</strong> ${storeName}
        </p>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${storeLink}" 
           style="background: #3b82f6; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
          🛒 Comprar ahora
        </a>
      </div>

      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #334155; padding-top: 20px;">
        Tu precio objetivo era: ${alert.target_price} ${alert.currency}<br/>
        Búsqueda original: "${alert.search_query}"<br/><br/>
        Este aviso fue generado automáticamente por <strong>PriceWise</strong>.
      </p>
    </div>
  </div>
</body>
</html>`,
          from_name: "PriceWise Alertas"
        });

        // Mark alert as triggered
        await base44.asServiceRole.entities.PriceAlert.update(alert.id, {
          status: "triggered"
        });
      }
    }

    return Response.json({
      message: `Revisadas ${checked} alertas, ${triggered} notificaciones enviadas`,
      checked,
      triggered
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});