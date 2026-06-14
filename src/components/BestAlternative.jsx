/**
 * BestAlternative — Mejor alternativa automática
 * Muestra la alternativa recomendada por la IA con comparativa rápida.
 */
import { Zap, ArrowRight, TrendingUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";

export default function BestAlternative({ product }) {
  const alt = product.best_alternative;
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();

  if (!alt || !alt.name) return null;

  const priceDiff = alt.price_diff_pct;
  const priceDiffLabel = priceDiff > 0
    ? `${priceDiff}% más caro`
    : priceDiff < 0
    ? `${Math.abs(priceDiff)}% más barato`
    : "mismo precio";

  const priceDiffColor = priceDiff <= 0 ? "text-green-400" : "text-yellow-400";

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-purple-400" />
        <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Mejor alternativa</span>
      </div>

      {/* Alternative product — clickable */}
      <div
        className="bg-white/5 hover:bg-white/10 border border-transparent hover:border-purple-500/30 rounded-xl p-4 mb-4 cursor-pointer transition-all group"
        onClick={() => navigate(`/search?q=${encodeURIComponent(alt.name)}&country=${selectedCountry.code}`)}
        title={`Buscar opciones de compra para "${alt.name}"`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-white font-bold text-base leading-snug mb-1">{alt.name}</p>
          <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
        </div>
        <p className="text-slate-400 text-sm mb-3">{alt.reason}</p>

        {/* Metrics row */}
        <div className="flex flex-wrap gap-3">
          {alt.score && (
            <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-300 text-xs font-semibold">TrustScore {alt.score}/100</span>
            </div>
          )}
          {priceDiff !== undefined && (
            <div className={`flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5`}>
              <span className={`text-xs font-semibold ${priceDiffColor}`}>{priceDiffLabel}</span>
            </div>
          )}
          {alt.incident_reduction && (
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
              <span className="text-green-300 text-xs font-semibold">{alt.incident_reduction}% menos incidencias</span>
            </div>
          )}
        </div>
        <p className="text-purple-400 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <ExternalLink className="w-3 h-3" /> Ver opciones de compra
        </p>
      </div>

      {/* Why switch */}
      {alt.why_better && (
        <p className="text-slate-400 text-sm flex items-start gap-2">
          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
          {alt.why_better}
        </p>
      )}
    </div>
  );
}