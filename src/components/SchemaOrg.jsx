import { useEffect, useMemo } from "react";

/**
 * Injects JSON-LD structured data into the page <head> for SEO.
 * Supports WebApplication, Organization, and FAQ schemas.
 */
export default function SchemaOrg({ type = "WebApplication", data = {} }) {
  const serializedData = useMemo(() => JSON.stringify(data), [data]);

  useEffect(() => {
    const schemas = {
      WebApplication: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "VERIFOX — Comparador de precios con IA",
        url: "https://verifoxia.com",
        description: "Compara precios disponibles con inteligencia artificial. Análisis de fiabilidad, señales de fraude y alertas de precio gratis.",
        applicationCategory: "ShoppingApplication",
        operatingSystem: "Web, iOS, Android",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR"
        }
      },
      Organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "VERIFOX",
        url: "https://verifoxia.com",
        logo: "https://media.base44.com/images/public/6a2e1f2e45b60383a960c225/d049c4265_UseAIImageJun16202600_47_52.png",
        description: "Plataforma de comparación de precios con inteligencia artificial que ayuda a los consumidores a tomar decisiones de compra informadas.",
        sameAs: []
      },
      FAQ: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Cómo compara VERIFOX los precios?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VERIFOX usa inteligencia artificial y datos de Google Shopping cuando están disponibles para comparar precios de tiendas online en tu país."
            }
          },
          {
            "@type": "Question",
            name: "¿Es gratis usar VERIFOX?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí, VERIFOX es completamente gratis. Puedes buscar productos, comparar precios y crear alertas sin coste alguno."
            }
          },
          {
            "@type": "Question",
            name: "¿Cómo funciona el Verifox Score?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "El Verifox Score es una puntuación de 0 a 100 que analiza calidad, durabilidad, relación calidad-precio, soporte al cliente y tasa de devoluciones del producto."
            }
          }
        ]
      }
    };

    const schema = { ...(schemas[type] || {}), ...JSON.parse(serializedData) };

    const scriptId = `schema-org-jsonld-${type}`;
    document.getElementById(scriptId)?.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = scriptId;
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [type, serializedData]);

  return null;
}
