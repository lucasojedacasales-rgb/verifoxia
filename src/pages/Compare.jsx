import { useState } from "react";
import { Search, Loader2, Trophy, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import CountrySelector from "@/components/CountrySelector";
import { useCountry } from "@/hooks/useCountry";
import TechSpecsTable from "@/components/TechSpecsTable";
import AdBanner from "@/components/AdBanner";
import { trackCompare } from "@/lib/analytics";
import useSEO from "@/hooks/useSEO";

export default function Compare() {
  const { selectedCountry, changeCountry, countries } = useCountry();

  useSEO({
    title: "Comparar productos — ¿Cuál es mejor?",
    description: "Compara dos productos cara a cara con IA.",
    canonical: "https://verifox.app/compare",
  });

  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);

  const analyzeComparison = async (e) => {
    e.preventDefault();
    if (!queryA.trim() || !queryB.trim()) return;

    setLoading(true);
    setComparison(null);
    setError(null);

    try {
      const response = await base44.functions.invoke("compareProducts", {
        queryA: queryA.trim(),
        queryB: queryB.trim(),
        countryName: selectedCountry.name,
        countryCode: selectedCountry.code,
        currency: selectedCountry.currency,
        symbol: selectedCountry.symbol,
      });

      const data = response?.data ?? response;

      if (!data) throw new Error("Respuesta vacía del servidor");
      if (data.error) throw new Error(data.error);
      if (!data.product_a || !data.product_b) throw new Error("La IA no devolvió datos completos. Inténtalo de nuevo.");

      trackCompare(queryA.trim(), queryB.trim(), selectedCountry.code);
      setComparison(data);
    } catch (err) {
      console.error("Compare error:", err);
      setError(err.message || "No se pudo completar la comparativa. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="sticky top-[52px] z-10 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-end">
          <CountrySelector selectedCountry={selectedCountry} countries={countries} onChange={changeCountry} />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
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
            <Button
              type="submit"
              disabled={loading || !queryA.trim() || !queryB.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-11 px-10 font-semibold"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Comparando...</>
                : "⚡ Comparar ahora"}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white font-medium">Analizando ambos productos...</p>
            <p className="text-slate-500 text-sm">Esto puede tardar unos segundos</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-red-300 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="mt-1 text-sm text-slate-400 underline hover:text-white">
              Volver a intentar
            </button>
          </div>
        )}

        {!loading && comparison && <CompareResults comparison={comparison} selectedCountry={selectedCountry} />}

        {!loading && !comparison && !error && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚖️</span>
            </div>
            <p className="text-slate-300 font-semibold text-lg mb-2">Compara dos productos cara a cara</p>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Introduce dos productos y nuestra IA analizará cuál es mejor en precio, calidad, disponibilidad y más.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function CompareResults({ comparison, selectedCountry }) {
  const pa = comparison.product_a || {};
  const pb = comparison.product_b || {};

  return (
    <div className="space-y-6">
      {comparison.overall_winner && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 flex gap-4">
          <Trophy className="w-8 h-8 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-bold text-lg mb-1">
              {comparison.overall_winner === "empate"
                ? "¡Empate técnico!"
                : `Ganador: ${comparison.overall_winner === "A" ? pa.name : pb.name}`}
            </p>
            <p className="text-slate-300 text-sm">{comparison.winner_reason}</p>
            {comparison.recommendation && (
              <p className="text-slate-400 text-sm mt-2 italic">💡 {comparison.recommendation}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[{ p: pa, side: "A", accent: "blue" }, { p: pb, side: "B", accent: "purple" }].map(({ p, side, accent }) => {
          const isWinner = comparison.overall_winner === side;
          return (
            <div key={side} className={`bg-slate-800/60 border rounded-2xl p-5 ${isWinner ? (accent === "blue" ? "border-blue-500/40" : "border-purple-500/40") : "border-white/10"}`}>
              {isWinner && (
                <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${accent === "blue" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"}`}>
                  <Trophy className="w-3 h-3" /> Ganador
                </div>
              )}
              <h3 className="text-white font-bold text-base mb-1">{p.name}</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className={`font-bold text-xl ${accent === "blue" ? "text-blue-400" : "text-purple-400"}`}>
                  {typeof p.best_price === "number" ? p.best_price.toLocaleString() : p.best_price} {selectedCountry.currency}
                </span>
                <span className="text-slate-500 text-sm">en {p.best_store}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(p.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`} />
                ))}
                <span className="text-slate-400 text-xs ml-1">{(p.rating || 0).toFixed(1)}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {(p.pros || []).map((pro, i) => <p key={i} className="text-green-400 text-xs flex gap-1.5"><span>✓</span>{pro}</p>)}
                {(p.cons || []).map((con, i) => <p key={i} className="text-red-400 text-xs flex gap-1.5"><span>✗</span>{con}</p>)}
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

      <AdBanner slot="9217364670" format="auto" className="rounded-xl overflow-hidden" />

      {comparison.is_tech && (pa.tech_specs?.length > 0 || pb.tech_specs?.length > 0) && (
        <TechSpecsTable productA={pa} productB={pb} />
      )}

      <AdBanner slot="8142785294" format="auto" className="rounded-xl overflow-hidden" />

      {(comparison.head_to_head || []).length > 0 && (
        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">Comparativa detallada</h3>
          <div className="space-y-2">
            {comparison.head_to_head.map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-slate-300 text-sm font-medium">{row.criterion}</span>
                <span className="text-slate-400 text-xs">{row.detail}</span>
                <div className="flex justify-end">
                  {row.winner === "empate" ? (
                    <span className="text-yellow-400 text-xs font-semibold bg-yellow-500/10 px-2 py-0.5 rounded-full">Empate</span>
                  ) : (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.winner === "A" ? "text-blue-400 bg-blue-500/10" : "text-purple-400 bg-purple-500/10"}`}>
                      {row.winner === "A" ? (pa.name || "").split(" ")[0] : (pb.name || "").split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}