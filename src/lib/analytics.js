/**
 * Helper centralizado para enviar eventos a Google Analytics (gtag).
 * El tag GA ya está cargado en index.html.
 */
const gtag = (...args) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

/** Vista de página — se llama automáticamente en cambios de ruta */
export const trackPageView = (path) => {
  gtag("event", "page_view", { page_path: path });
};

/** El usuario busca un producto */
export const trackSearch = (query, country) => {
  gtag("event", "search", {
    search_term: query,
    country_code: country,
  });
};

/** El usuario inicia una comparación */
export const trackCompare = (productA, productB, country) => {
  gtag("event", "compare_products", {
    product_a: productA,
    product_b: productB,
    country_code: country,
  });
};

/** El usuario guarda un favorito */
export const trackFavorite = (productName) => {
  gtag("event", "add_to_favorites", { product_name: productName });
};

/** El usuario crea una alerta de precio */
export const trackPriceAlert = (productName, targetPrice, currency) => {
  gtag("event", "create_price_alert", {
    product_name: productName,
    target_price: targetPrice,
    currency,
  });
};

/** El usuario hace clic en una tienda para ver el precio */
export const trackStoreClick = ({
  storeName,
  productName,
  countryCode,
  estimatedPrice,
  currency,
}) => {
  gtag("event", "store_click", {
    store_name: storeName,
    product_name: productName,
    country_code: countryCode,
    estimated_price: estimatedPrice,
    currency,
  });
};
