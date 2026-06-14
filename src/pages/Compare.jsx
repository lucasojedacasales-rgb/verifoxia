import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Loader2, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import CountrySelector from "@/components/CountrySelector";
import { useCountry } from "@/hooks/useCountry";
import { fetchProductContext } from "@/hooks/useProductData";

export default function Compare() {
  const navigate = useNavigate();
  const { selectedCountry, changeCountry, countries } = useCountry();

  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);

  const analyzeComparison = async (e) => {
    e.preventDefault();
    if (!queryA.trim() || !queryB.trim()) return;
    setLoading(true);
    setComparison(null);

    const [contextA, contextB] = await Promise.all([
      fetchProductContext(queryA),
      fetchProductContext(queryB)
    ]);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Eres un experto en comparación de productos. El usuario quiere comparar DOS productos para decidir cuál comprar.

País: ${selectedCountry.name} (${selectedCountry.code})
Moneda: ${selectedCountry.currency}

PRODUCTO A: "${queryA}"
Contexto A: ${contextA.contextText || "No disponible"}

PRODUCTO B: "${queryB}"
Contexto B: ${contextB.contextText || "No disponible"}

Realiza una comparación exhaustiva y devuelve JSON:
{
  "product_a": {
    "name": "nombre completo",
    "price_range": "rango de precios en ${selectedCountry.currency}",
    "best_price": numero,
    "best_store": "tienda más barata",
    "rating": numero_1_a_5,
    "pros": ["pro1", "pro2", "pro3"],
    "cons": ["con1", "con2"],
    "best_for": "perfil de usuario para quien es ideal"
  },
  "product_b": {
    "name": "nombre completo",
    "price_range": "rango de precios en ${selectedCountry.currency}",
    "best_price": numero,
    "best_store": "tienda más barata",
    "rating": numero_1_a_5,
    "pros": ["pro1", "pro2", "pro3"],
    "cons": ["con1", "con2"],
    "best_for": "perfil de usuario para quien es ideal"
  },
  "head_to_head": [
    { "criterion": "Precio", "winner": "A|B|empate", "detail": "explicación" },
    { "criterion": "Calidad", "winner": "A|B|empate", "detail": "explicación" },
    { "criterion": "Durabilidad", "winner": "A|B|empate", "detail": "explicación" },
    { "criterion": "Relación calidad-precio", "winner": "A|B|empate", "detail": "explicación" },
    { "criterion": "Disponibilidad en ${selectedCountry.name}", "winner": "A|B|empate", "detail": "explicación" },
    { "criterion": "Soporte y garantía", "winner": "A|B|empate", "detail": "explicación" }
  ],
  "overall_winner": "A|B|empate",
  "winner_reason": "Explicación clara de 2-3 oraciones de por qué es el ganador",
  "recommendation": "Consejo personalizado para el usuario en ${selectedCountry.name}"
}`,
      response_json_schema: {
        type: "object",
        required: ["product_a", "product_b", "head_to_head", "overall_winner", "winner_reason", "recommendation"],
        properties: {
          product_a: { type: "object" },
          product_b: { type: "object" },
          head_to_head: { type: "array", items: { type: "object" } },
          overall_winner: { type: "string" },
          winner_reason: { type: "string" },
          recommendation: { type: "string" }
        }
      }
    });

    setComparison(result);
    setLoading(false);
  };

  const winnerColor = { A: "blue", B: "purple", empate: "yellow" };
  const getWinnerStyle = (winner, side) => {
    if (winner === "empate") return "text-yellow-400";
    return winner === side ? "text-green-400" : "text-slate-500";
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">VS</span>
            </div>
            <span className="text-white font-bold">Comparador cara a cara</span>
          </div>
          <div className="ml-auto">
            <CountrySelector selectedCountry={selectedCountry} countries={countries} onChange={changeCountry} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={analyzeComparison} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-blue-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Producto A</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={queryA}
                onChange={(e) => setQueryA(e.target.value)}
                placeholder="ej: iPhone 15 Pro"
                className="pl-9 bg-white/5 border-blue-500/30 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-purple-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Producto B</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={queryB}
                onChange={(e) => setQueryB(e.target.value)}
                placeholder="ej: Samsung Galaxy S24"
                className="pl-9 bg-white/5 border-purple-500/30 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-center">
            <Button type="submit" disabled={loading || !queryA.trim() || !queryB.trim()} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-11 px-10 font-semibold">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Comparando...</> : "⚡ Comparar ahora"}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white font-medium">Analizando ambos productos...</p>
            <p className="text-slate-500 text-sm">Consultando fuentes externas y generando comparativa con IA</p>
          </div>
        )}

        {!loading && comparison && (
          <div className="space-y-6">
            {/* Winner banner */}
            {comparison.overall_winner && comparison.overall_winner !== "empate" && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 flex gap-4">
                <Trophy className="w-8 h-8 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-bold text-lg mb-1">
                    Ganador: {comparison.overall_winner === "A"
                      ? comparison.product_a?.name
                      : comparison.product_b?.name}
                  </p>
                  <p className="text-slate-300 text-sm">{comparison.winner_reason}</p>
                  {comparison.recommendation && (
                    <p className="text-slate-400 text-sm mt-2 italic">💡 {comparison.recommendation}</p>
                  )}
                </div>
              </div>
            )}

            {/* Side by side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { key: "product_a", side: "A", label: "Producto A", accent: "blue" },
                { key: "product_b", side: "B", label: "Producto B", accent: "purple" }
              ].map(({ key, side, label, accent }) => {
                const p = comparison[key];
                if (!p) return null;
                const isWinner = comparison.overall_winner === side;
                return (
                  <div key={key} className={`bg-slate-800/60 border rounded-2xl p-5 ${isWinner ? `border-${accent}-500/40` : "border-white/10"}`}>
                    {isWinner && (
                      <div className={`inline-flex items-center gap-1 bg-${accent}-500/20 text-${accent}-300 text-xs font-semibold px-2 py-0.5 rounded-full mb-3`}>
                        <Trophy className="w-3 h-3" /> Ganador
                      </div>
                    )}
                    <h3 className="text-white font-bold text-base mb-1">{p.name}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-${accent}-400 font-bold text-xl`}>{p.best_price?.toLocaleString()} {selectedCountry.currency}</span>
                      <span className="text-slate-500 text-sm">en {p.best_store}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(p.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`} />
                      ))}
                      <span className="text-slate-400 text-xs ml-1">{p.rating?.toFixed(1)}</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {p.pros?.map((pro, i) => (
                        <p key={i} className="text-green-400 text-xs flex gap-1.5"><span>✓</span>{pro}</p>
                      ))}
                      {p.cons?.map((con, i) => (
                        <p key={i} className="text-red-400 text-xs flex gap-1.5"><span>✗</span>{con}</p>
                      ))}
                    </div>
                    {p.best_for && (
                      <div className="bg-slate-900/50 rounded-lg px-3 py-2">
                        <p className="text-slate-500 text-xs">Ideal para</p>
                        <p className="text-slate-300 text-xs mt-0.5">{p.best_for}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Head to head table */}
            {comparison.head_to_head?.length > 0 && (
              <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">Comparativa detallada</h3>
                <div className="space-y-2">
                  {comparison.head_to_head.map((row, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-slate-300 text-sm font-medium">{row.criterion}</span>
                      <span className="text-slate-400 text-xs col-span-1">{row.detail}</span>
                      <div className="flex justify-end">
                        {row.winner === "empate" ? (
                          <span className="text-yellow-400 text-xs font-semibold bg-yellow-500/10 px-2 py-0.5 rounded-full">Empate</span>
                        ) : (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.winner === "A" ? "text-blue-400 bg-blue-500/10" : "text-purple-400 bg-purple-500/10"}`}>
                            {row.winner === "A" ? comparison.product_a?.name?.split(" ")[0] : comparison.product_b?.name?.split(" ")[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !comparison && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚖️</span>
            </div>
            <p className="text-slate-300 font-semibold text-lg mb-2">Compara dos productos cara a cara</p>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Introduce dos productos y nuestra IA analizará cuál es mejor en precio, calidad, disponibilidad y más.</p>
          </div>
        )}
      </main>
    </div>
  );
}