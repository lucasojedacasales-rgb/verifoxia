import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import TrustScore from "@/components/TrustScore";

export default function AIRecommendation({ product }) {
  return (
    <div className="bg-gradient-to-br from-blue-950/60 to-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          Análisis de IA
        </h2>
        <TrustScore score={product.ai_score ?? 50} size="sm" />
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mb-5">
        {product.ai_recommendation}
      </p>

      {/* Quick verdict chips */}
      <div className="flex flex-wrap gap-2">
        {product.verdict === "comprar" && (
          <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/25 rounded-full px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-300 text-xs font-medium">Recomendado para comprar</span>
          </div>
        )}
        {product.verdict === "esperar" && (
          <div className="flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/25 rounded-full px-3 py-1">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-300 text-xs font-medium">Considera esperar una mejor oferta</span>
          </div>
        )}
        {product.verdict === "no_comprar" && (
          <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/25 rounded-full px-3 py-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-300 text-xs font-medium">No recomendado en este momento</span>
          </div>
        )}
        {product.price_trend && (
          <div className="bg-slate-700/50 border border-white/10 rounded-full px-3 py-1">
            <span className="text-slate-300 text-xs">
              Precio {product.price_trend === "subiendo" ? "🔴 subiendo" : product.price_trend === "bajando" ? "🟢 bajando" : "🟡 estable"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}