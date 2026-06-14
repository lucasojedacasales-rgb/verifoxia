/**
 * Popular stores by country region and product category.
 * Used to enrich the LLM prompt with locally relevant stores.
 */

// Region grouping by country code
const COUNTRY_REGION = {
  ES: "europe_es",
  DE: "europe_de",
  FR: "europe_fr",
  IT: "europe_it",
  GB: "europe_gb",
  US: "us",
  MX: "latam_mx",
  AR: "latam_ar",
  CO: "latam_co",
  CL: "latam_cl",
  PE: "latam_pe",
  BR: "brazil",
};

// Base global stores always included (with search URL templates)
const GLOBAL_STORES = [
  { name: "Amazon", urlTemplate: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}` },
  { name: "eBay", urlTemplate: (q) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}` },
  { name: "AliExpress", urlTemplate: (q) => `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}` },
];

// Regional stores by region code, with category overrides
const REGIONAL_STORES = {
  europe_es: {
    default: ["El Corte Inglés", "MediaMarkt", "Fnac", "PcComponentes", "Carrefour"],
    electronica: ["PcComponentes", "MediaMarkt", "Fnac", "El Corte Inglés"],
    ropa: ["Zara", "El Corte Inglés", "Mango", "ASOS", "Shein"],
    hogar: ["IKEA", "El Corte Inglés", "Leroy Merlin", "Carrefour"],
    deportes: ["Decathlon", "El Corte Inglés", "Nike ES", "Adidas ES"],
    belleza: ["El Corte Inglés", "Primor", "Douglas", "Sephora ES"],
    libros: ["Casa del Libro", "Fnac", "El Corte Inglés"],
    juguetes: ["Toysrus ES", "El Corte Inglés", "Carrefour"],
  },
  europe_de: {
    default: ["Otto", "Saturn", "MediaMarkt", "Zalando", "Kaufland"],
    electronica: ["Saturn", "MediaMarkt", "Alternate", "Notebooksbilliger"],
    ropa: ["Zalando", "About You", "H&M DE", "Otto"],
    hogar: ["IKEA", "Otto", "Kaufland", "Bauhaus"],
    deportes: ["Decathlon DE", "SportScheck", "Adidas DE"],
    belleza: ["Douglas DE", "Rossmann", "dm"],
    libros: ["Thalia", "Hugendubel", "Weltbild"],
  },
  europe_fr: {
    default: ["Cdiscount", "Fnac", "Darty", "La Redoute", "Leclerc"],
    electronica: ["Fnac", "Darty", "Cdiscount", "Boulanger"],
    ropa: ["La Redoute", "Zalando FR", "Kiabi", "H&M FR"],
    hogar: ["IKEA", "Leroy Merlin FR", "Castorama", "Conforama"],
    deportes: ["Decathlon FR", "Go Sport", "Intersport"],
    belleza: ["Sephora", "Nocibé", "Marionnaud"],
    libros: ["Fnac", "Cultura", "La Fnac Livres"],
  },
  europe_gb: {
    default: ["Argos", "John Lewis", "Currys", "Next", "Marks & Spencer"],
    electronica: ["Currys", "John Lewis", "Argos", "Very"],
    ropa: ["ASOS", "Next", "Marks & Spencer", "Topshop"],
    hogar: ["IKEA", "Argos", "John Lewis", "Dunelm"],
    deportes: ["Sports Direct", "JD Sports", "Decathlon UK"],
    belleza: ["Boots", "Superdrug", "Lookfantastic"],
    libros: ["Waterstones", "WHSmith", "Book Depository"],
  },
  europe_it: {
    default: ["Unieuro", "MediaWorld IT", "Zalando IT", "ePrice", "Euronics"],
    electronica: ["Unieuro", "MediaWorld IT", "ePrice", "Euronics"],
    ropa: ["Zalando IT", "ASOS IT", "OVS", "Yoox"],
    hogar: ["IKEA", "Bricoman", "Leroy Merlin IT"],
    deportes: ["Decathlon IT", "Sportmaster", "Nike IT"],
    belleza: ["Sephora IT", "Pinalli", "Douglas IT"],
  },
  us: {
    default: ["Walmart", "Target", "Best Buy", "Costco", "Newegg"],
    electronica: ["Best Buy", "Newegg", "B&H Photo", "Micro Center", "Costco"],
    ropa: ["Nordstrom", "Macy's", "Gap", "Target", "ASOS US"],
    hogar: ["Wayfair", "Home Depot", "IKEA US", "Target", "Costco"],
    deportes: ["Dick's Sporting Goods", "Nike US", "Academy Sports", "REI"],
    belleza: ["Ulta Beauty", "Sephora US", "Sally Beauty"],
    libros: ["Barnes & Noble", "Books-A-Million", "Thriftbooks"],
    juguetes: ["Target", "Walmart", "GameStop"],
  },
  latam_mx: {
    default: ["Mercado Libre MX", "Liverpool", "Coppel", "Walmart MX", "Palacio de Hierro"],
    electronica: ["Mercado Libre MX", "Liverpool", "Best Buy MX", "Costco MX"],
    ropa: ["Liverpool", "Coppel", "Zara MX", "H&M MX", "Mercado Libre MX"],
    hogar: ["Coppel", "Liverpool", "IKEA MX", "Home Depot MX"],
    deportes: ["Liverpool", "Coppel", "Decathlon MX", "Nike MX"],
    belleza: ["Liverpool", "Sephora MX", "Mercado Libre MX"],
  },
  latam_ar: {
    default: ["Mercado Libre AR", "Falabella AR", "Frávega", "Musimundo", "Garbarino"],
    electronica: ["Frávega", "Garbarino", "Musimundo", "Mercado Libre AR"],
    ropa: ["Mercado Libre AR", "Zara AR", "Falabella AR", "Renner"],
    hogar: ["Easy AR", "Falabella AR", "Sodimac AR"],
    deportes: ["Decathlon AR", "Mercado Libre AR", "Nike AR"],
  },
  latam_co: {
    default: ["Mercado Libre CO", "Falabella CO", "Éxito", "Alkosto", "Linio"],
    electronica: ["Alkosto", "Falabella CO", "Mercado Libre CO", "Ktronix"],
    ropa: ["Falabella CO", "Éxito", "Zara CO", "H&M CO"],
    hogar: ["Falabella CO", "Éxito", "Homecenter", "Easy CO"],
    deportes: ["Decathlon CO", "Alkosto", "Mercado Libre CO"],
  },
  latam_cl: {
    default: ["Mercado Libre CL", "Falabella CL", "Ripley", "Paris", "La Polar"],
    electronica: ["Falabella CL", "Ripley", "Mercado Libre CL", "PC Factory"],
    ropa: ["Falabella CL", "Ripley", "Paris", "Zara CL"],
    hogar: ["Falabella CL", "Sodimac CL", "Easy CL"],
    deportes: ["Decathlon CL", "Falabella CL", "Nike CL"],
  },
  latam_pe: {
    default: ["Mercado Libre PE", "Falabella PE", "Ripley PE", "Saga Falabella", "Oechsle"],
    electronica: ["Falabella PE", "Ripley PE", "Mercado Libre PE", "Hiraoka"],
    ropa: ["Falabella PE", "Ripley PE", "Oechsle", "Zara PE"],
    hogar: ["Sodimac PE", "Promart", "Falabella PE"],
  },
  brazil: {
    default: ["Mercado Livre BR", "Magazine Luiza", "Americanas", "Submarino", "Casas Bahia"],
    electronica: ["Magazine Luiza", "Kabum", "Ponto Frio", "Americanas"],
    ropa: ["Renner", "Riachuelo", "Marisa", "Zara BR", "Dafiti"],
    hogar: ["Magazine Luiza", "Casas Bahia", "Tok&Stok", "IKEA BR"],
    deportes: ["Decathlon BR", "Centauro", "Nike BR"],
    belleza: ["Sephora BR", "O Boticário", "Natura"],
    libros: ["Livraria Cultura", "Saraiva", "Amazon BR"],
  },
};

/**
 * Returns a list of store names relevant for the given country and category.
 * Always includes the 3 global stores + up to 4 regional/category-specific ones.
 */
export function getStoresForContext(countryCode, category = "otro") {
  const region = COUNTRY_REGION[countryCode] || "us";
  const regional = REGIONAL_STORES[region] || {};
  const categoryStores = regional[category] || regional["default"] || [];

  // Deduplicate: regional stores first, then globals
  const allStores = [...new Set([...categoryStores.slice(0, 4), ...GLOBAL_STORES.map(s => s.name)])];

  return allStores;
}

/**
 * Returns a formatted string for the LLM prompt with ALL stores grouped by category for a region.
 * The LLM will select the most relevant ones based on the detected product category.
 */
export function getStoresPromptText(countryCode, _category, query) {
  const region = COUNTRY_REGION[countryCode] || "us";
  const regional = REGIONAL_STORES[region] || {};

  // Collect all unique regional store names across all categories
  const allRegionalNames = [...new Set(Object.values(regional).flat())];

  // Build category-grouped section
  const categoryEntries = Object.entries(regional)
    .filter(([key]) => key !== "default")
    .map(([cat, stores]) => `  [${cat}]: ${stores.join(", ")}`)
    .join("\n");

  const defaultStores = (regional["default"] || allRegionalNames.slice(0, 5)).join(", ");

  // Global stores with real URLs
  const globalLines = GLOBAL_STORES.map(s => `  - ${s.name}: ${s.urlTemplate(query)}`).join("\n");

  // Regional stores with Google search fallback URLs
  const regionalLines = allRegionalNames.map(name => {
    const searchName = encodeURIComponent(`${name} ${query}`);
    return `  - ${name}: https://www.google.com/search?q=${searchName}`;
  }).join("\n");

  return `Tiendas globales siempre disponibles:
${globalLines}

Tiendas locales populares en esta región (elige las más relevantes según la categoría del producto):
${regionalLines}

Guía de tiendas por categoría en esta región:
${categoryEntries || `  Por defecto: ${defaultStores}`}`;
}