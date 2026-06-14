import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import VerdictBanner from "@/components/VerdictBanner";
import StoreComparison from "@/components/StoreComparison";
import ReviewSummary from "@/components/ReviewSummary";
import AIRecommendation from "@/components/AIRecommendation";
import CountrySelector from "@/components/CountrySelector";
import { useCountry } from "@/hooks/useCountry";

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  const navigate = useNavigate();
  const { selectedCountry, changeCountry, countries } = useCountry();

  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (query) analyzeProduct(query);
  }, [query, selectedCountry.code]);

  const analyzeProduct = async (q) => {
    setLoading(true);
    setProduct(null);

    const [result, imageResult] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `Eres un experto en comparación de precios y análisis de productos de compras online.
      
El usuario busca: "${q}"
País del usuario: ${selectedCountry.name} (${selectedCountry.code})
Moneda local: ${selectedCountry.currency} (${selectedCountry.symbol})

Genera datos REALISTAS y detallados de comparación de este producto adaptados al mercado de ${selectedCountry.name}.

Devuelve un JSON con esta estructura exacta:
{
  "name": "nombre completo y específico del producto",
  "description": "descripción detallada de 2-3 oraciones",
  "category": "electronica|ropa|hogar|deportes|belleza|juguetes|libros|otro",
  "stores": [
    {
      "store_name": "una de estas tiendas exactamente: Amazon, eBay o AliExpress",
      "price": precio_numero_en_${selectedCountry.currency},
      "currency": "${selectedCountry.currency}",
      "url": "URL real de búsqueda del producto en esa tienda (ej: https://www.amazon.com/s?k=nombre+producto para Amazon, https://www.ebay.com/sch/i.html?_nkw=nombre+producto para eBay, https://www.aliexpress.com/wholesale?SearchText=nombre+producto para AliExpress)",
      "in_stock": true_o_false,
      "rating": numero_1_a_5,
      "reviews_count": numero_de_reseñas
    }
  ],
  "pros": ["ventaja 1", "ventaja 2", "ventaja 3"],
  "cons": ["desventaja 1", "desventaja 2"],
  "best_time_to_buy": "descripción de cuándo es mejor comprarlo considerando el mercado de ${selectedCountry.name}",
  "price_trend": "subiendo|bajando|estable",
  "ai_recommendation": "párrafo detallado explicando si conviene comprar en ${selectedCountry.name}, comparando tiendas, mencionando pros/cons, costes de envío al país y el contexto del mercado local",
  "ai_score": numero_0_a_100,
  "verdict": "comprar|esperar|no_comprar"
}

Usa EXACTAMENTE estas 3 tiendas: Amazon, eBay y AliExpress. Los precios deben estar en ${selectedCountry.currency} y ser realistas para el mercado de ${selectedCountry.name}. AliExpress suele ser más barato pero con mayor tiempo de envío.`,
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

    setProduct({ ...result, image_url: imageResult?.url, search_query: q });

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
            <span className="text-white font-bold hidden sm:block">PriceWise</span>
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
            <p className="text-slate-400 text-sm">Comparando precios, reseñas y generando imagen del producto</p>
          </div>
        )}

        {!loading && product && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductCard product={product} />
              </div>
              <div>
                <VerdictBanner product={product} />
              </div>
            </div>
            <StoreComparison stores={product.stores || []} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReviewSummary product={product} />
              <AIRecommendation product={product} />
            </div>
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