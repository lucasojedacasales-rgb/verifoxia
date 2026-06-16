/**
 * Hook para actualizar dinámicamente el <title> y <meta description> de cada página.
 * Mejora el SEO en SPA sin necesidad de SSR.
 */
export default function useSEO({ title, description, canonical }) {
  const siteName = "VERIFOX";

  // Title
  document.title = title ? `${title} | ${siteName}` : `${siteName} — Comparador de precios con IA`;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute(
    "content",
    description ||
      "VERIFOX compara precios de miles de tiendas en tiempo real usando IA. Encuentra la mejor oferta, detecta fraudes y crea alertas de precio gratis."
  );

  // Open Graph
  const setOG = (property, content) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  setOG("og:title", title ? `${title} | ${siteName}` : siteName);
  setOG("og:description", description || "Compara precios con IA y ahorra dinero en cada compra.");
  setOG("og:type", "website");
  setOG("og:site_name", siteName);

  // Canonical
  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }
}