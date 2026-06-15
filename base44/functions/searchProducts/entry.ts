import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, country_code, language } = await req.json();

    if (!query) {
      return Response.json({ error: 'query es requerido' }, { status: 400 });
    }

    const apiKey = Deno.env.get("SERPAPI_KEY");

    // Map country codes to Google gl/hl params
    const countryMap = {
      ES: { gl: "es", hl: "es", currency: "EUR" },
      MX: { gl: "mx", hl: "es", currency: "MXN" },
      AR: { gl: "ar", hl: "es", currency: "ARS" },
      CO: { gl: "co", hl: "es", currency: "COP" },
      CL: { gl: "cl", hl: "es", currency: "CLP" },
      PE: { gl: "pe", hl: "es", currency: "PEN" },
      US: { gl: "us", hl: "en", currency: "USD" },
      GB: { gl: "gb", hl: "en", currency: "GBP" },
      DE: { gl: "de", hl: "de", currency: "EUR" },
      FR: { gl: "fr", hl: "fr", currency: "EUR" },
      IT: { gl: "it", hl: "it", currency: "EUR" },
      BR: { gl: "br", hl: "pt", currency: "BRL" },
    };

    const locale = countryMap[country_code] || countryMap["US"];

    // Search Google Shopping
    const shoppingUrl = new URL("https://serpapi.com/search");
    shoppingUrl.searchParams.set("engine", "google_shopping");
    shoppingUrl.searchParams.set("q", query);
    shoppingUrl.searchParams.set("gl", locale.gl);
    shoppingUrl.searchParams.set("hl", locale.hl);
    shoppingUrl.searchParams.set("num", "10");
    shoppingUrl.searchParams.set("api_key", apiKey);

    const shoppingRes = await fetch(shoppingUrl.toString());
    const shoppingData = await shoppingRes.json();

    if (shoppingData.error) {
      return Response.json({ error: shoppingData.error }, { status: 400 });
    }

    const shoppingResults = (shoppingData.shopping_results || []).slice(0, 8).map((item) => ({
      store_name: item.source || "Tienda desconocida",
      product_title: item.title,
      price: item.extracted_price || null,
      price_str: item.price || null,
      currency: locale.currency,
      url: item.link || item.product_link || "#",
      image_url: item.thumbnail || null,
      rating: item.rating || null,
      reviews_count: item.reviews || null,
      in_stock: true,
      delivery: item.delivery || null,
    }));

    // Also get organic results for more context
    const organicUrl = new URL("https://serpapi.com/search");
    organicUrl.searchParams.set("engine", "google");
    organicUrl.searchParams.set("q", query + " precio comprar");
    organicUrl.searchParams.set("gl", locale.gl);
    organicUrl.searchParams.set("hl", locale.hl);
    organicUrl.searchParams.set("num", "5");
    organicUrl.searchParams.set("api_key", apiKey);

    const organicRes = await fetch(organicUrl.toString());
    const organicData = await organicRes.json();

    const organicResults = (organicData.organic_results || []).slice(0, 5).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: item.displayed_link,
    }));

    return Response.json({
      query,
      country_code,
      currency: locale.currency,
      shopping_results: shoppingResults,
      organic_results: organicResults,
      search_metadata: {
        total_shopping: shoppingResults.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});