import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Detect if a string is a URL
function isUrl(str) {
  try { new URL(str); return str.startsWith("http"); } catch { return false; }
}

// Extract domain/store name from URL
function storeName(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.split(".")[0].charAt(0).toUpperCase() + host.split(".")[0].slice(1);
  } catch { return "Tienda"; }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, country_code } = await req.json();

    if (!query) {
      return Response.json({ error: 'query es requerido' }, { status: 400 });
    }

    const apiKey = Deno.env.get("SERPAPI_KEY");

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

    // --- URL mode: fetch product info from the page, then search ---
    let effectiveQuery = query;
    let sourceUrl = null;
    let urlPageText = null;

    if (isUrl(query)) {
      sourceUrl = query;
      // Try to fetch the product page for context
      try {
        const pageRes = await fetch(query, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; VerifoxBot/1.0)" },
          redirect: "follow",
          signal: AbortSignal.timeout(6000),
        });
        const html = await pageRes.text();
        // Extract title tag and meta description for product name
        const titleMatch = html.match(/<title[^>]*>([^<]{3,150})<\/title>/i);
        const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{5,300})["']/i)
          || html.match(/<meta[^>]+content=["']([^"']{5,300})["'][^>]+name=["']description["']/i);
        const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{3,150})["']/i)
          || html.match(/<meta[^>]+content=["']([^"']{3,150})["'][^>]+property=["']og:title["']/i);

        const rawTitle = ogTitle?.[1] || titleMatch?.[1] || "";
        // Clean up site name from title (e.g. "iPhone 15 | Apple" → "iPhone 15")
        effectiveQuery = rawTitle.split(/[|\-–—]/)[0].trim() || storeName(query);
        urlPageText = metaDesc?.[1] || "";
      } catch (_) {
        effectiveQuery = storeName(query);
      }
    }

    // Use effective product name for Google Shopping search
    const shoppingUrl = new URL("https://serpapi.com/search");
    shoppingUrl.searchParams.set("engine", "google_shopping");
    shoppingUrl.searchParams.set("q", effectiveQuery);
    shoppingUrl.searchParams.set("gl", locale.gl);
    shoppingUrl.searchParams.set("hl", locale.hl);
    shoppingUrl.searchParams.set("num", "15");
    shoppingUrl.searchParams.set("tbs", "mr:1,avg_rating:400");
    shoppingUrl.searchParams.set("api_key", apiKey);

    const organicUrl = new URL("https://serpapi.com/search");
    organicUrl.searchParams.set("engine", "google");
    organicUrl.searchParams.set("q", `${effectiveQuery} especificaciones review precio`);
    organicUrl.searchParams.set("gl", locale.gl);
    organicUrl.searchParams.set("hl", locale.hl);
    organicUrl.searchParams.set("num", "5");
    organicUrl.searchParams.set("api_key", apiKey);

    const [shoppingRes, organicRes] = await Promise.all([
      fetch(shoppingUrl.toString()),
      fetch(organicUrl.toString()),
    ]);

    const [shoppingData, organicData] = await Promise.all([
      shoppingRes.json(),
      organicRes.json(),
    ]);

    if (shoppingData.error) {
      return Response.json({ error: shoppingData.error }, { status: 400 });
    }

    const queryLower = effectiveQuery.toLowerCase();
    const queryWords = queryLower.split(" ").filter(w => w.length > 2);

    const allResults = shoppingData.shopping_results || [];

    const scored = allResults.map(item => {
      const titleLower = (item.title || "").toLowerCase();
      const matchCount = queryWords.filter(w => titleLower.includes(w)).length;
      const score = queryWords.length > 0 ? matchCount / queryWords.length : 0;
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topResults = scored.slice(0, 10);

    // If input was a URL, prepend the source store as first result (if we have price from page)
    const shoppingResults = topResults.map(({ item }) => ({
      store_name: item.source || "Tienda desconocida",
      product_title: item.title,
      price: item.extracted_price || null,
      price_str: item.price || null,
      currency: locale.currency,
      url: item.product_link || item.link || null,
      image_url: item.thumbnail || null,
      rating: item.rating || null,
      reviews_count: item.reviews || null,
      in_stock: true,
      delivery: item.delivery || null,
    }));

    const organicResults = (organicData.organic_results || []).slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: item.displayed_link,
    }));

    return Response.json({
      query,
      effective_query: effectiveQuery,
      source_url: sourceUrl,
      url_page_context: urlPageText,
      is_url_search: !!sourceUrl,
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