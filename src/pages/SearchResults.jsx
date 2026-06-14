import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import VerdictBanner from "@/components/VerdictBanner";
import StoreComparison from "@/components/StoreComparison";
import ReviewSummary from "@/components/ReviewSummary";
import AIRecommendation from "@/components/AIRecommendation";

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) analyzeProduct(query);
  }, [query]);

  const analyzeProduct = async (q) => {
    setLoading(true);
    setError(null);
    setProduct(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Eres un experto en comparación de precios y análisis de productos de compras online.
      
El usuario busca: "${q}"

Genera datos REALISTAS y detallados de comparación de este producto como si lo hubieras buscado en múltiples tiendas online.

Devuelve un JSON con esta estructura exacta:
{
  "name": "nombre completo y específico del producto",
  "description": "descripción detallada de 2-3 oraciones",
  "category": "electronica|ropa|hogar|deportes|belleza|juguetes|libros|otro",
  "image_url": "https://source.unsplash.com/400x400/?product,${encodeURIComponent(q)}",
  "stores": [
    {
      "store_name": "nombre de tienda real (Amazon, eBay, Walmart, BestBuy, etc.)",
      "price": precio_numero,
      "currency": "USD",
      "url": "#",
      "in_stock": true_o_false,
      "rating": numero_1_a_5,
      "reviews_count": numero_de_reseñas
    }
  ],
  "pros": ["ventaja 1", "ventaja 2", "ventaja 3"],
  "cons": ["desventaja 1", "desventaja 2"],
  "best_time_to_buy": "descripción de cuándo es mejor comprarlo",
  "price_trend": "subiendo|bajando|estable",
  "ai_recommendation": "párrafo detallado explicando si conviene comprar, comparando tiendas, mencionando pros/cons y el contexto del mercado actual",
  "ai_score": numero_0_a_100,
  "verdict": "comprar|esperar|no_comprar"
}

Usa entre 4-6 tiendas reales. Los precios deben ser realistas y variar entre tiendas. El ai_score debe reflejar la relación calidad-precio.`,
      response_json_schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          image_url: { type: "string" },
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
    });

    setProduct({ ...result, search_query: q });

    // Save to history
    await base44.entities.SearchHistory.create({
      query: q,
      verdict: result.verdict
    });

    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <p className="text-white text-lg font-medium">Analizando "{query}"...</p>
            <p className="text-slate-400 text-sm">Comparando precios y reseñas en múltiples tiendas</p>
          </div>
        )}

        {!loading && product && (
          <div className="space-y-6">
            {/* Product overview + Verdict */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductCard product={product} />
              </div>
              <div>
                <VerdictBanner product={product} />
              </div>
            </div>

            {/* Store comparison */}
            <StoreComparison stores={product.stores || []} />

            {/* Reviews + AI Recommendation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReviewSummary product={product} />
              <AIRecommendation product={product} />
            </div>
          </div>
        )}

        {!loading && !product && !error && (
          <div className="text-center py-20 text-slate-400">
            Introduce un producto para analizar
          </div>
        )}
      </main>
    </div>
  );
}