import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, ArrowLeft, Bell } from "lucide-react";
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

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  const navigate = useNavigate();
  const { selectedCountry, changeCountry, countries } = useCountry();

  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    if (query) analyzeProduct(query);
  }, [query, selectedCountry.code]);

  const analyzeProduct = async (q) => {
    setLoading(true);
    setProduct(null);

    // Fetch real product context from free public APIs
    const productContext = await fetchProductContext(q);

    // Get category-aware stores for this country (we use "otro" initially; LLM will detect real category)
    const storesText = getStoresPromptText(selectedCountry.code, "otro", q);

    const [result, imageResult] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `Eres un experto en comparación de precios y análisis de productos de compras online.
      
El usuario busca: "${q}"
País del usuario: ${selectedCountry.name} (${selectedCountry.code})
Moneda local: ${selectedCountry.currency} (${selectedCountry.symbol})

=== CONTEXTO REAL DEL PRODUCTO (extraído de Wikipedia y DuckDuckGo) ===
${productContext.contextText || "No se encontró contexto adicional."}
=== FIN DEL CONTEXTO ===

=== TIENDAS POPULARES EN ${selectedCountry.name.toUpperCase()} ===
Estas son las tiendas más populares y relevantes para este país y tipo de producto. DEBES incluir TODAS en tu análisis:
${storesText}
=== FIN DE TIENDAS ===

Usa el contexto real para dar datos PRECISOS. Devuelve precios realistas para ${selectedCountry.name} en cada tienda listada arriba.

Devuelve un JSON con esta estructura exacta:
{
  "name": "nombre completo y específico del producto",
  "description": "descripción detallada de 2-3 oraciones basada en el contexto real",
  "category": "electronica|ropa|hogar|deportes|belleza|juguetes|libros|otro",
  "stores": [
    {
      "store_name": "nombre EXACTO de la tienda de la lista de arriba",
      "price": precio_numero_en_${selectedCountry.currency},
      "currency": "${selectedCountry.currency}",
      "url": "URL de búsqueda de la tienda (usa las URLs proporcionadas arriba)",
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
  "verdict": "comprar|esperar|no_comprar"
}

IMPORTANTE: Incluye TODAS las tiendas de la lista. Los precios deben reflejar la realidad del mercado de ${selectedCountry.name} incluyendo impuestos e importación si aplica.`,
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
            verdict: { type: "string" }
          }
        }
      }),
      base44.integrations.Core.GenerateImage({
        prompt: `Professional product photo of ${q}, clean white background, high quality, commercial photography style, studio lighting`
      })
    ]);

    const imageUrl = imageResult?.url || productContext.wikiImageUrl || null;
    setProduct({ ...result, image_url: imageUrl, search_query: q });

    await base44.entities.SearchHistory.create({
      query: q,
      verdict: result.verdict
    });

    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&country=${selectedCountry.code}`);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold hidden sm:block">Trustify</span>
          </div>
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca otro producto..."
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-9"
              />
            </div>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 h-9 px-4">
              Buscar
            </Button>
          </form>
          <CountrySelector
            selectedCountry={selectedCountry}
            countries={countries}
            onChange={changeCountry}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-white text-lg font-medium">Analizando "{query}"...</p>
            <p className="text-slate-400 text-sm">Consultando Wikipedia, DuckDuckGo y generando análisis con IA...</p>
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductCard product={product} />
              </div>
              <div className="flex flex-col gap-4">
                <VerdictBanner product={product} />
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:text-blue-300 font-medium transition-all"
                >
                  <Bell className="w-4 h-4" />
                  Crear alerta de precio
                </button>
              </div>
            </div>
            <StoreComparison stores={product.stores || []} />

            {/* Anuncio AdSense — entre comparativa de tiendas y reseñas */}
            <AdBanner slot="XXXXXXXXXX" format="auto" className="rounded-xl overflow-hidden" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReviewSummary product={product} />
              <AIRecommendation product={product} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PricePrediction product={product} country={selectedCountry} />
              <TotalCostCalculator product={product} country={selectedCountry} />
            </div>

            {/* Anuncio AdSense — al final de los resultados */}
            <AdBanner slot="XXXXXXXXXX" format="auto" className="rounded-xl overflow-hidden" />
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