import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import { Search, ArrowLeft, Bell } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import VerdictBanner from "@/components/VerdictBanner";
import StoreComparison from "@/components/StoreComparison";
import ReviewSummary from "@/components/ReviewSummary";
import AIRecommendation from "@/components/AIRecommendation";
import CountrySelector from "@/components/CountrySelector";
import { useCountry } from "@/hooks/useCountry";
import { fetchProductContext } from "@/hooks/useProductData";
import { getStoresPromptText } from "@/lib/storesByRegion";
import PriceAlertModal from "@/components/PriceAlertModal";
import PricePrediction from "@/components/PricePrediction";
import TotalCostCalculator from "@/components/TotalCostCalculator";
import AdBanner from "@/components/AdBanner";
import AIVerdict from "@/components/AIVerdict";
import FraudDetector from "@/components/FraudDetector";
import BestAlternative from "@/components/BestAlternative";
import SatisfactionIndex from "@/components/SatisfactionIndex";
import SearchResultsSkeleton from "@/components/SearchResultsSkeleton";
import SearchLoadingAnimation from "@/components/SearchLoadingAnimation";

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  const navigate = useNavigate();
  const { selectedCountry, changeCountry, countries } = useCountry();
  const { lang, changeLanguage, languages, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [pendingHistoryEntry, setPendingHistoryEntry] = useState(null);

  const onRefresh = useCallback(() => {
    // End WebView native pull-to-refresh if available
    if (window.__TRUSTIFY_NATIVE__ && window.__TRUSTIFY_NATIVE__.endRefresh) {
      window.__TRUSTIFY_NATIVE__.endRefresh();
    }
    if (query) return analyzeProduct(query);
    return Promise.resolve();
  }, [query, selectedCountry.code]);
  const { scrollProps, indicatorRef } = usePullToRefresh(onRefresh);

  useEffect(() => {
    if (query) analyzeProduct(query);
  }, [query, selectedCountry.code]);

  const analyzeProduct = async (q) => {
    setLoading(true);
    setProduct(null);
    // Optimistic history entry — shown immediately while LLM runs
    setPendingHistoryEntry({ query: q, verdict: null, _pending: true, id: null });

    // Fetch real product context + SerpAPI shopping results in parallel
    const [productContext, serpApiResponse] = await Promise.all([
      fetchProductContext(q),
      base44.functions.invoke("searchProducts", { query: q, country_code: selectedCountry.code }).catch(() => null),
    ]);

    const serpData = serpApiResponse?.data;
    const serpShoppingResults = serpData?.shopping_results || [];

    // Build SerpAPI context text for the LLM
    let serpContextText = "";
    if (serpShoppingResults.length > 0) {
      serpContextText = `\n=== PRECIOS REALES DE GOOGLE SHOPPING (SerpAPI) — USA ESTOS DATOS DIRECTAMENTE ===\n`;
      serpShoppingResults.forEach((item, i) => {
        serpContextText += `${i + 1}. Tienda: ${item.store_name} | Producto: "${item.product_title}" | Precio: ${item.price_str || item.price + " " + item.currency} | URL: ${item.url}`;
        if (item.rating) serpContextText += ` | Rating: ${item.rating}/5 (${item.reviews_count?.toLocaleString() || "?"} reseñas)`;
        if (item.delivery) serpContextText += ` | Envío: ${item.delivery}`;
        serpContextText += "\n";
      });
      serpContextText += `IMPORTANTE: Los precios y tiendas de arriba son REALES y verificados. Úsalos directamente en el campo "stores" sin modificarlos.\n=== FIN DE PRECIOS REALES ===\n`;
    }

    // Get category-aware stores for this country (we use "otro" initially; LLM will detect real category)
    const storesText = getStoresPromptText(selectedCountry.code, "otro", q);

    const [result, imageResult] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `Eres un experto en comparación de precios y análisis de productos de compras online.
IMPORTANTE: Responde TODO el contenido textual (description, ai_recommendation, pros, cons, best_time_to_buy, ai_verdict_reasons, fraud_flags, safe_signals, best_alternative.reason, best_alternative.why_better) en el idioma: ${lang.name} (código: ${lang.code}).
      
El usuario busca: "${q}"
País del usuario: ${selectedCountry.name} (${selectedCountry.code})
Moneda local: ${selectedCountry.currency} (${selectedCountry.symbol})

=== CONTEXTO REAL DEL PRODUCTO (extraído de Wikipedia y DuckDuckGo) ===
${productContext.contextText || "No se encontró contexto adicional."}
=== FIN DEL CONTEXTO ===${serpContextText}

=== TIENDAS DISPONIBLES EN ${selectedCountry.name.toUpperCase()} ===
${storesText}
=== FIN DE TIENDAS ===

PASO 1 — Detecta la categoría exacta del producto: "${q}"
PASO 2 — Si hay datos de PRECIOS REALES (sección SerpAPI), úsalos DIRECTAMENTE para rellenar "stores". Son datos reales de Google Shopping, no los modifiques ni inventes otros. Si no hay datos de SerpAPI, usa la lista de tiendas del país.
PASO 3 — Devuelve precios EXCLUSIVAMENTE en la moneda local: ${selectedCountry.currency} (símbolo: ${selectedCountry.symbol}). NUNCA uses USD si el país es de la UE. El campo "currency" de CADA tienda DEBE ser "${selectedCountry.currency}" sin excepción.
PASO 4 — Para "name" del producto, usa el título exacto del producto de SerpAPI si está disponible, no uno genérico.

Devuelve un JSON con esta estructura exacta:
{
  "name": "nombre completo y específico del producto",
  "description": "descripción detallada de 2-3 oraciones basada en el contexto real",
  "category": "electronica|videojuegos|ropa|zapatos|hogar|muebles|deportes|belleza|juguetes|libros|alimentacion|herramientas|automovil|mascotas|salud|otro",
  "stores": [
    {
      "store_name": "nombre EXACTO de la tienda seleccionada",
      "price": precio_numero_en_${selectedCountry.currency},
      "currency": "${selectedCountry.currency}",
      "url": "URL real de la tienda (usa las URLs de SerpAPI si están disponibles, si no usa las URLs de la lista de tiendas)",
      "in_stock": true_o_false,
      "rating": numero_1_a_5,
      "reviews_count": numero_de_reseñas_estimado
    }
  ],
  "pros": ["ventaja 1", "ventaja 2", "ventaja 3"],
  "cons": ["desventaja 1", "desventaja 2"],
  "best_time_to_buy": "cuándo es mejor comprarlo en ${selectedCountry.name}",
  "price_trend": "subiendo|bajando|estable",
  "ai_recommendation": "análisis detallado para comprar en ${selectedCountry.name}: qué tienda local conviene más, costes de envío, disponibilidad local vs importación, contexto del mercado local",
  "ai_score": numero_0_a_100,
  "verdict": "comprar|esperar|no_comprar",
  "ai_verdict_reasons": ["razón 1 corta", "razón 2 corta", "razón 3 corta"],
  "fraud_risk": "bajo|medio|alto",
  "fraud_flags": ["señal negativa 1", "señal negativa 2"],
  "safe_signals": ["señal positiva 1", "señal positiva 2"],
  "satisfaction_index": {
    "quality": numero_1_a_10,
    "durability": numero_1_a_10,
    "value": numero_1_a_10,
    "support": numero_1_a_10,
    "return_rate": "baja|media|alta"
  },
  "best_alternative": {
    "name": "nombre del producto alternativo recomendado",
    "reason": "por qué es mejor en una frase",
    "why_better": "explicación de la ventaja principal",
    "score": numero_0_a_100,
    "price_diff_pct": numero_porcentaje_diferencia_de_precio,
    "incident_reduction": numero_porcentaje_menos_incidencias
  }
}

REGLA CRÍTICA DE MONEDA: El campo "currency" de CADA entrada del array "stores" DEBE ser exactamente "${selectedCountry.currency}". Los precios deben estar expresados en ${selectedCountry.currency} (${selectedCountry.symbol}) con IVA incluido. NUNCA pongas "USD" si la moneda local es "${selectedCountry.currency}".
REGLA DE TIENDAS: Si hay datos de SerpAPI, usa EXACTAMENTE esas tiendas con sus precios y URLs reales. No inventes ni combines con otras tiendas. Si no hay datos de SerpAPI, selecciona tiendas reales del país que vendan ese producto.
REGLA DE NOMBRE: El campo "name" debe ser el nombre EXACTO y COMPLETO del producto (modelo, versión, color, capacidad) tal como aparece en los resultados de SerpAPI.
Para "fraud_risk": analiza si el producto suele tener reseñas sospechosas, cambios de ficha o historial de precios inflados artificialmente. Sé honesto y específico en "fraud_flags" y "safe_signals".
Para "best_alternative": sugiere un producto alternativo real y concreto que el usuario debería considerar.`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            stores: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  store_name: { type: "string" },
                  price: { type: "number" },
                  currency: { type: "string" },
                  url: { type: "string" },
                  in_stock: { type: "boolean" },
                  rating: { type: "number" },
                  reviews_count: { type: "number" }
                }
              }
            },
            pros: { type: "array", items: { type: "string" } },
            cons: { type: "array", items: { type: "string" } },
            best_time_to_buy: { type: "string" },
            price_trend: { type: "string" },
            ai_recommendation: { type: "string" },
            ai_score: { type: "number" },
            verdict: { type: "string" },
            ai_verdict_reasons: { type: "array", items: { type: "string" } },
            fraud_risk: { type: "string" },
            fraud_flags: { type: "array", items: { type: "string" } },
            safe_signals: { type: "array", items: { type: "string" } },
            satisfaction_index: {
              type: "object",
              properties: {
                quality:     { type: "number" },
                durability:  { type: "number" },
                value:       { type: "number" },
                support:     { type: "number" },
                return_rate: { type: "string" }
              },
              required: ["quality", "durability", "value", "support", "return_rate"]
            },
            best_alternative: {
              type: "object",
              properties: {
                name:               { type: "string" },
                reason:             { type: "string" },
                why_better:         { type: "string" },
                score:              { type: "number" },
                price_diff_pct:     { type: "number" },
                incident_reduction: { type: "number" }
              },
              required: ["name", "reason", "why_better", "score"]
            }
          }
        }
      }),
      base44.integrations.Core.GenerateImage({
        prompt: `Professional product photo of ${q}, clean white background, high quality, commercial photography style, studio lighting`
      })
    ]);

    const imageUrl = imageResult?.url || productContext.wikiImageUrl || serpShoppingResults[0]?.image_url || null;

    // Always use SerpAPI data directly when available — real URLs, real prices, real product titles
    const mergedStores = serpShoppingResults.length > 0
      ? serpShoppingResults
          .filter((s) => s.url && s.url !== "#" && s.price)
          .map((s) => ({
            store_name: s.store_name,
            product_title: s.product_title,  // keep exact SerpAPI product title per store
            price: s.price,
            currency: s.currency || selectedCountry.currency,
            url: s.url,                       // real direct product URL from Google Shopping
            in_stock: s.in_stock ?? true,
            rating: s.rating,
            reviews_count: s.reviews_count,
            delivery: s.delivery,
          }))
      : (result.stores || []);

    // Use the most specific product name: from SerpAPI's top result or LLM
    const productName = serpShoppingResults[0]?.product_title || result.name;

    setProduct({ ...result, name: productName, stores: mergedStores, image_url: imageUrl, search_query: q });

    // Persist and clear optimistic entry
    base44.entities.SearchHistory.create({ query: q, verdict: result.verdict });
    setPendingHistoryEntry(null);

    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&country=${selectedCountry.code}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 relative">
      {/* Search bar below global header */}
      <div className="sticky top-[60px] z-5 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_other}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-9"
              />
            </div>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 h-9 px-4">
              Buscar
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <LanguageSelector lang={lang} languages={languages} onChange={changeLanguage} />
            <CountrySelector
              selectedCountry={selectedCountry}
              countries={countries}
              onChange={changeCountry}
            />
          </div>
        </div>
      </div>

      <PullToRefreshIndicator ref={indicatorRef} />
      <main className="flex-1 overflow-y-auto w-full px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-8 md:max-w-6xl md:mx-auto" style={{ overscrollBehaviorY: "none" }} {...scrollProps}>
        {loading && (
          <div className="w-full space-y-3">
            <SearchLoadingAnimation query={query} />
            <SearchResultsSkeleton />
          </div>
        )}

        {showAlertModal && product && (
          <PriceAlertModal
            product={product}
            country={selectedCountry}
            onClose={() => setShowAlertModal(false)}
          />
        )}

        {!loading && product && (
          <div className="w-full space-y-4 sm:space-y-6">
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="lg:col-span-2">
                <ProductCard product={product} />
              </div>
              <div className="flex flex-col gap-3 sm:gap-4">
                <VerdictBanner product={product} />
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg sm:rounded-xl text-blue-400 hover:text-blue-300 font-medium transition-all text-sm sm:text-base min-h-[44px]"
                  >
                  <Bell className="w-4 h-4" />
                  {t.create_alert}
                </button>
              </div>
            </div>
            <StoreComparison stores={product.stores || []} />

            {/* Anuncio AdSense — entre comparativa de tiendas y reseñas */}
            <AdBanner slot="9217364670" format="auto" className="rounded-lg sm:rounded-xl overflow-hidden" />

            {/* ¿La compraría la IA? + Detector de fraude */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <AIVerdict product={product} />
              <FraudDetector product={product} />
            </div>

            {/* Índice de satisfacción + Mejor alternativa */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <SatisfactionIndex product={product} />
              <BestAlternative product={product} />
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <ReviewSummary product={product} />
              <AIRecommendation product={product} />
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <PricePrediction product={product} country={selectedCountry} />
              <TotalCostCalculator product={product} country={selectedCountry} />
            </div>

            {/* Anuncio AdSense — al final de los resultados */}
            <AdBanner slot="8142785294" format="auto" className="rounded-lg sm:rounded-xl overflow-hidden" />
          </div>
        )}

        {!loading && !product && (
          <div className="text-center py-20 text-slate-400">
            Introduce un producto para analizar
          </div>
        )}
      </main>
    </div>
  );
}