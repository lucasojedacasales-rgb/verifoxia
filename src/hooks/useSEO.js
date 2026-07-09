import { useEffect } from "react";

/**
 * Hook para actualizar dinámicamente el <title> y <meta description> de cada página.
 * Mejora el SEO en SPA sin necesidad de SSR.
 *
 * @param {{ title?: string, description?: string, canonical?: string }} options
 */
export default function useSEO({ title, description, canonical } = {}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const siteName = "VERIFOX";
    const pageTitle = title ? `${title} | ${siteName}` : `${siteName} — Comparador de precios con IA`;
    const pageDescription =
      description ||
      "VERIFOX compara precios disponibles usando datos externos e IA. Revisa ofertas, señales de confianza y alertas de precio gratis.";

    document.title = pageTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", pageDescription);

    const setOG = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setOG("og:title", pageTitle);
    setOG("og:description", pageDescription);
    setOG("og:type", "website");
    setOG("og:site_name", siteName);
    if (canonical) setOG("og:url", canonical);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [title, description, canonical]);
}
