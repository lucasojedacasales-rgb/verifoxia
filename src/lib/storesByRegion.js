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
    default:       ["El Corte Inglés", "MediaMarkt", "Fnac", "PcComponentes", "Carrefour"],
    electronica:   ["PcComponentes", "MediaMarkt", "Fnac", "El Corte Inglés"],
    videojuegos:   ["PcComponentes", "Fnac", "El Corte Inglés", "Game ES", "MediaMarkt"],
    ropa:          ["Zara", "El Corte Inglés", "Mango", "ASOS", "Shein"],
    zapatos:       ["Zara", "El Corte Inglés", "Zalando ES", "Footdistrict", "Sprinter"],
    hogar:         ["IKEA", "El Corte Inglés", "Leroy Merlin", "Carrefour"],
    muebles:       ["IKEA", "El Corte Inglés", "Leroy Merlin", "Westwing", "Maisons du Monde"],
    deportes:      ["Decathlon", "El Corte Inglés", "Nike ES", "Adidas ES", "Sprinter"],
    belleza:       ["El Corte Inglés", "Primor", "Douglas", "Sephora ES"],
    libros:        ["Casa del Libro", "Fnac", "El Corte Inglés"],
    juguetes:      ["Toysrus ES", "El Corte Inglés", "Carrefour", "Juguettos"],
    alimentacion:  ["Carrefour", "El Corte Inglés", "Mercadona", "Dia"],
    herramientas:  ["Leroy Merlin", "Bricodepot", "Ferrokey", "El Corte Inglés"],
    automovil:     ["El Corte Inglés", "Carrefour", "eBay Motor ES", "AutoDoc"],
    mascotas:      ["Kiwoko", "Tiendanimal", "Zooplus ES", "El Corte Inglés"],
    salud:         ["Farmacia.es", "El Corte Inglés", "Parafarmacia Ahorro"],
  },
  europe_de: {
    default:       ["Otto", "Saturn", "MediaMarkt", "Zalando", "Kaufland"],
    electronica:   ["Saturn", "MediaMarkt", "Alternate", "Notebooksbilliger"],
    videojuegos:   ["Saturn", "MediaMarkt", "GameStop DE", "Alternate"],
    ropa:          ["Zalando", "About You", "H&M DE", "Otto"],
    zapatos:       ["Zalando", "About You", "Görtz", "Deichmann"],
    hogar:         ["IKEA", "Otto", "Kaufland", "Bauhaus"],
    muebles:       ["IKEA", "Otto", "Home24", "Wayfair DE"],
    deportes:      ["Decathlon DE", "SportScheck", "Adidas DE"],
    belleza:       ["Douglas DE", "Rossmann", "dm"],
    libros:        ["Thalia", "Hugendubel", "Weltbild"],
    herramientas:  ["Bauhaus", "OBI", "Hornbach"],
    mascotas:      ["Zooplus DE", "Fressnapf", "Petshop DE"],
  },
  europe_fr: {
    default:       ["Cdiscount", "Fnac", "Darty", "La Redoute", "Leclerc"],
    electronica:   ["Fnac", "Darty", "Cdiscount", "Boulanger"],
    videojuegos:   ["Fnac", "Micromania", "Cdiscount", "Darty"],
    ropa:          ["La Redoute", "Zalando FR", "Kiabi", "H&M FR"],
    zapatos:       ["Zalando FR", "La Redoute", "Sarenza", "Kiabi"],
    hogar:         ["IKEA", "Leroy Merlin FR", "Castorama", "Conforama"],
    muebles:       ["IKEA", "Conforama", "But", "Maisons du Monde FR"],
    deportes:      ["Decathlon FR", "Go Sport", "Intersport"],
    belleza:       ["Sephora", "Nocibé", "Marionnaud"],
    libros:        ["Fnac", "Cultura", "La Fnac Livres"],
    herramientas:  ["Leroy Merlin FR", "Castorama", "Brico Dépôt"],
    mascotas:      ["Zooplus FR", "Jardiland", "Animalis"],
  },
  europe_gb: {
    default:       ["Argos", "John Lewis", "Currys", "Next", "Marks & Spencer"],
    electronica:   ["Currys", "John Lewis", "Argos", "Very"],
    videojuegos:   ["GAME UK", "Currys", "Argos", "Very"],
    ropa:          ["ASOS", "Next", "Marks & Spencer", "Topshop"],
    zapatos:       ["ASOS", "Schuh", "Foot Locker UK", "Office Shoes"],
    hogar:         ["IKEA", "Argos", "John Lewis", "Dunelm"],
    muebles:       ["IKEA", "John Lewis", "Dunelm", "Furniture Village"],
    deportes:      ["Sports Direct", "JD Sports", "Decathlon UK"],
    belleza:       ["Boots", "Superdrug", "Lookfantastic"],
    libros:        ["Waterstones", "WHSmith", "Book Depository"],
    herramientas:  ["B&Q", "Screwfix", "Wickes"],
    mascotas:      ["Pets at Home", "Jollyes", "Zooplus UK"],
  },
  europe_it: {
    default:       ["Unieuro", "MediaWorld IT", "Zalando IT", "ePrice", "Euronics"],
    electronica:   ["Unieuro", "MediaWorld IT", "ePrice", "Euronics"],
    videojuegos:   ["Unieuro", "GameStop IT", "MediaWorld IT", "ePrice"],
    ropa:          ["Zalando IT", "ASOS IT", "OVS", "Yoox"],
    zapatos:       ["Zalando IT", "Scarpe&Scarpe", "Geox IT", "Yoox"],
    hogar:         ["IKEA", "Bricoman", "Leroy Merlin IT"],
    muebles:       ["IKEA", "Maisons du Monde IT", "Mondo Convenienza"],
    deportes:      ["Decathlon IT", "Sportmaster", "Nike IT"],
    belleza:       ["Sephora IT", "Pinalli", "Douglas IT"],
    herramientas:  ["Leroy Merlin IT", "Bricoman", "Bricocenter"],
    mascotas:      ["Zooplus IT", "Arcaplanet", "Isola dei Tesori"],
  },
  us: {
    default:       ["Walmart", "Target", "Best Buy", "Costco", "Newegg"],
    electronica:   ["Best Buy", "Newegg", "B&H Photo", "Micro Center", "Costco"],
    videojuegos:   ["GameStop", "Best Buy", "Target", "Walmart", "Steam"],
    ropa:          ["Nordstrom", "Macy's", "Gap", "Target", "ASOS US"],
    zapatos:       ["Zappos", "Foot Locker US", "DSW", "Nordstrom"],
    hogar:         ["Wayfair", "Home Depot", "IKEA US", "Target", "Costco"],
    muebles:       ["Wayfair", "IKEA US", "Ashley Furniture", "West Elm"],
    deportes:      ["Dick's Sporting Goods", "Nike US", "Academy Sports", "REI"],
    belleza:       ["Ulta Beauty", "Sephora US", "Sally Beauty"],
    libros:        ["Barnes & Noble", "Books-A-Million", "Thriftbooks"],
    juguetes:      ["Target", "Walmart", "GameStop"],
    herramientas:  ["Home Depot", "Lowe's", "Harbor Freight"],
    automovil:     ["AutoZone", "O'Reilly Auto Parts", "eBay Motors"],
    mascotas:      ["Chewy", "PetSmart", "Petco"],
    alimentacion:  ["Walmart", "Costco", "Whole Foods", "Target"],
  },
  latam_mx: {
    default:       ["Mercado Libre MX", "Liverpool", "Coppel", "Walmart MX", "Palacio de Hierro"],
    electronica:   ["Mercado Libre MX", "Liverpool", "Best Buy MX", "Costco MX"],
    videojuegos:   ["Liverpool", "Best Buy MX", "GameStop MX", "Mercado Libre MX"],
    ropa:          ["Liverpool", "Coppel", "Zara MX", "H&M MX", "Mercado Libre MX"],
    zapatos:       ["Liverpool", "Coppel", "Flexi", "Mercado Libre MX"],
    hogar:         ["Coppel", "Liverpool", "IKEA MX", "Home Depot MX"],
    muebles:       ["IKEA MX", "Liverpool", "Coppel", "Famsa"],
    deportes:      ["Liverpool", "Coppel", "Decathlon MX", "Nike MX"],
    belleza:       ["Liverpool", "Sephora MX", "Mercado Libre MX"],
    mascotas:      ["Petco MX", "Mercado Libre MX", "Liverpool"],
  },
  latam_ar: {
    default:       ["Mercado Libre AR", "Falabella AR", "Frávega", "Musimundo", "Garbarino"],
    electronica:   ["Frávega", "Garbarino", "Musimundo", "Mercado Libre AR"],
    videojuegos:   ["Frávega", "Garbarino", "Mercado Libre AR", "Musimundo"],
    ropa:          ["Mercado Libre AR", "Zara AR", "Falabella AR", "Renner"],
    zapatos:       ["Mercado Libre AR", "Falabella AR", "Arezzo", "Ricky Sarkany"],
    hogar:         ["Easy AR", "Falabella AR", "Sodimac AR"],
    muebles:       ["Easy AR", "Sodimac AR", "Falabella AR", "Mercado Libre AR"],
    deportes:      ["Decathlon AR", "Mercado Libre AR", "Nike AR"],
    mascotas:      ["Mercado Libre AR", "PetShop AR", "Petco AR"],
  },
  latam_co: {
    default:       ["Mercado Libre CO", "Falabella CO", "Éxito", "Alkosto", "Linio"],
    electronica:   ["Alkosto", "Falabella CO", "Mercado Libre CO", "Ktronix"],
    videojuegos:   ["Alkosto", "Éxito", "Falabella CO", "Mercado Libre CO"],
    ropa:          ["Falabella CO", "Éxito", "Zara CO", "H&M CO"],
    zapatos:       ["Falabella CO", "Éxito", "Mercado Libre CO"],
    hogar:         ["Falabella CO", "Éxito", "Homecenter", "Easy CO"],
    muebles:       ["Homecenter", "Easy CO", "Falabella CO", "Mercado Libre CO"],
    deportes:      ["Decathlon CO", "Alkosto", "Mercado Libre CO"],
    mascotas:      ["Mercado Libre CO", "Éxito", "PetCenter"],
  },
  latam_cl: {
    default:       ["Mercado Libre CL", "Falabella CL", "Ripley", "Paris", "La Polar"],
    electronica:   ["Falabella CL", "Ripley", "Mercado Libre CL", "PC Factory"],
    videojuegos:   ["Falabella CL", "Ripley", "PC Factory", "Mercado Libre CL"],
    ropa:          ["Falabella CL", "Ripley", "Paris", "Zara CL"],
    zapatos:       ["Falabella CL", "Ripley", "Bata CL", "Hush Puppies CL"],
    hogar:         ["Falabella CL", "Sodimac CL", "Easy CL"],
    muebles:       ["Sodimac CL", "Easy CL", "Falabella CL", "Mercado Libre CL"],
    deportes:      ["Decathlon CL", "Falabella CL", "Nike CL"],
    mascotas:      ["PetCo CL", "Mercado Libre CL", "Falabella CL"],
  },
  latam_pe: {
    default:       ["Mercado Libre PE", "Falabella PE", "Ripley PE", "Saga Falabella", "Oechsle"],
    electronica:   ["Falabella PE", "Ripley PE", "Mercado Libre PE", "Hiraoka"],
    videojuegos:   ["Falabella PE", "Ripley PE", "Hiraoka", "Mercado Libre PE"],
    ropa:          ["Falabella PE", "Ripley PE", "Oechsle", "Zara PE"],
    zapatos:       ["Falabella PE", "Ripley PE", "Oechsle", "Bata PE"],
    hogar:         ["Sodimac PE", "Promart", "Falabella PE"],
    muebles:       ["Sodimac PE", "Promart", "Falabella PE", "Mercado Libre PE"],
    mascotas:      ["Mercado Libre PE", "Petco PE", "Oechsle"],
  },
  brazil: {
    default:       ["Mercado Livre BR", "Magazine Luiza", "Americanas", "Submarino", "Casas Bahia"],
    electronica:   ["Magazine Luiza", "Kabum", "Ponto Frio", "Americanas"],
    videojuegos:   ["Kabum", "Magazine Luiza", "GameStop BR", "Americanas"],
    ropa:          ["Renner", "Riachuelo", "Marisa", "Zara BR", "Dafiti"],
    zapatos:       ["Netshoes BR", "Dafiti", "Centauro", "Renner"],
    hogar:         ["Magazine Luiza", "Casas Bahia", "Tok&Stok", "IKEA BR"],
    muebles:       ["Tok&Stok", "Mobly", "Casas Bahia", "Magazine Luiza"],
    deportes:      ["Decathlon BR", "Centauro", "Nike BR"],
    belleza:       ["Sephora BR", "O Boticário", "Natura"],
    libros:        ["Livraria Cultura", "Saraiva", "Amazon BR"],
    herramientas:  ["Leroy Merlin BR", "Castorama BR", "Magazine Luiza"],
    mascotas:      ["Cobasi", "PetLove", "Petz"],
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
 * Returns a formatted string for the LLM prompt with stores grouped by category for a region.
 * The LLM will detect the product category and select only the relevant stores.
 */
export function getStoresPromptText(countryCode, _category, query) {
  const region = COUNTRY_REGION[countryCode] || "us";
  const regional = REGIONAL_STORES[region] || {};

  // Build category-grouped section
  const categoryEntries = Object.entries(regional)
    .filter(([key]) => key !== "default")
    .map(([cat, stores]) => `  [${cat}]: ${stores.join(", ")}`)
    .join("\n");

  const defaultStores = (regional["default"] || []).join(", ");

  // Global stores with real URLs
  const globalLines = GLOBAL_STORES.map(s => `  - ${s.name}: ${s.urlTemplate(query)}`).join("\n");

  return `Tiendas globales (incluye siempre estas 3):
${globalLines}

Tiendas locales de esta región agrupadas por categoría de producto.
INSTRUCCIÓN CRÍTICA: Detecta la categoría real del producto buscado y usa SOLO las tiendas de esa categoría. 
NO incluyas tiendas de categorías no relacionadas (ej: si el producto es un videojuego, no incluyas tiendas de ropa o zapatos).
Si el producto no encaja en ninguna categoría específica, usa [default]: ${defaultStores}

Tiendas por categoría:
${categoryEntries}`;
}