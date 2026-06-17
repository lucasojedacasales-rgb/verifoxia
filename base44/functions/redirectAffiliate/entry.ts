import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Genera una URL de afiliado AWIN y redirige al usuario.
 * 
 * Parámetros:
 *   - store_url: URL destino de la tienda
 *   - store_name: nombre de la tienda
 *   - product_name: nombre del producto
 *   - search_query: búsqueda original (opcional)
 *   - country_code: código de país del usuario
 *   - currency: moneda local
 *   - estimated_price: precio estimado del producto (opcional)
 * 
 * AWIN deeplink format:
 *   https://www.awin1.com/cread.php?awinmid=MERCHANT_ID&awinaffid=PUBLISHER_ID&ued=ENCODED_URL&clickref=REF
 */

// Mapping de tiendas populares -> AWIN merchant IDs (se amplía con el tiempo)
const STORE_MERCHANT_MAP = {
  "amazon": { mid: 12345, commission_pct: 4 },
  "el corte inglés": { mid: 67890, commission_pct: 3 },
  "mediamarkt": { mid: 11111, commission_pct: 2 },
  "fnac": { mid: 22222, commission_pct: 3 },
  "pccomponentes": { mid: 33333, commission_pct: 2 },
  "zara": { mid: 44444, commission_pct: 2 },
  "decathlon": { mid: 55555, commission_pct: 3 },
  "leroy merlin": { mid: 66666, commission_pct: 2 },
  "ikea": { mid: 77777, commission_pct: 1 },
  "carrefour": { mid: 88888, commission_pct: 2 },
  "alcampo": { mid: 99999, commission_pct: 2 },
  "walmart": { mid: 12121, commission_pct: 3 },
  "best buy": { mid: 13131, commission_pct: 2 },
  "target": { mid: 14141, commission_pct: 3 },
  "ebay": { mid: 15151, commission_pct: 2 },
};

function findMerchant(storeName) {
  const name = (storeName || "").toLowerCase();
  for (const [key, data] of Object.entries(STORE_MERCHANT_MAP)) {
    if (name.includes(key)) return data;
  }
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const {
      store_url,
      store_name,
      product_name,
      search_query = "",
      country_code = "ES",
      currency = "EUR",
      estimated_price = 0
    } = body;

    if (!store_url || !store_name || !product_name) {
      return Response.json({ error: "Faltan store_url, store_name o product_name" }, { status: 400 });
    }

    const publisherId = Deno.env.get("AWIN_PUBLISHER_ID") || null;
    const merchant = findMerchant(store_name);
    const AMAZON_TAG = "lukrator90-21";

    let affiliateUrl = store_url;
    let estimatedCommissionPct = 0;
    let estimatedValue = 0;

    // Amazon Associates deeplink (prioridad sobre AWIN)
    const isAmazon = (store_name || "").toLowerCase().includes("amazon") ||
                     (store_url || "").includes("amazon.");
    if (isAmazon) {
      try {
        const url = new URL(store_url);
        url.searchParams.set("tag", AMAZON_TAG);
        // Limpiar params de tracking innecesarios para una URL limpia
        url.searchParams.delete("ref");
        url.searchParams.delete("linkCode");
        affiliateUrl = url.toString();
        estimatedCommissionPct = 4;
        estimatedValue = estimated_price ? (estimated_price * 4 / 100) : 0;
      } catch (_) {
        affiliateUrl = store_url;
      }
    } else if (publisherId && merchant) {
      // Generar deeplink AWIN para otras tiendas
      const encodedUrl = encodeURIComponent(store_url);
      const clickRef = `verifox_${Date.now()}_${store_name.replace(/\s/g, "_")}`;
      affiliateUrl = `https://www.awin1.com/cread.php?awinmid=${merchant.mid}&awinaffid=${publisherId}&ued=${encodedUrl}&clickref=${clickRef}`;
      estimatedCommissionPct = merchant.commission_pct;
      estimatedValue = estimated_price ? (estimated_price * merchant.commission_pct / 100) : 0;
    }

    // Registrar click (sin bloquear la redirección)
    base44.asServiceRole.entities.AffiliateClick.create({
      product_name,
      store_name,
      store_url,
      affiliate_url: affiliateUrl,
      country_code,
      search_query,
      estimated_commission_pct: estimatedCommissionPct,
      estimated_value: Math.round(estimatedValue * 100) / 100,
      currency,
      status: "clicked",
      session_id: `sess_${Date.now()}`
    }).catch(() => {});

    return Response.json({
      redirect_url: affiliateUrl,
      has_affiliate: !!merchant,
      estimated_commission_pct: estimatedCommissionPct
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});