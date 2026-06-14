import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Brain, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PricePrediction({ product, country }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const currentPrice = product?.stores?.length
    ? Math.min(...product.stores.map(s => s.price || Infinity))
    : 0;

  const fetchPrediction = async () => {
    if (prediction) { setExpanded(!expanded); return; }
    setLoading(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Eres un analista experto en tendencias de precios de productos tecnológicos y de consumo.

Producto: "${product.name}"
Categoría: ${product.category}
Precio actual mínimo: ${currentPrice} ${country?.currency || "EUR"}
País: ${country?.name || "España"}
Tendencia actual: ${product.price_trend || "estable"}
Fecha actual: ${new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}

Analiza los patrones históricos típicos de este tipo de producto y devuelve una predicción de precios.
Considera: ciclos de lanzamiento de productos, temporadas de descuentos (Black Friday, Navidades, rebajas de enero/julio), 
antigüedad del producto, competencia en el mercado.

Devuelve JSON:
{
  "next_7_days": { "direction": "sube|baja|estable", "pct": numero_porcentaje, "reason": "explicación breve" },
  "next_30_days": { "direction": "sube|baja|estable", "pct": numero_porcentaje, "reason": "explicación breve" },
  "best_time_window": "cuándo exactamente es el mejor momento para comprar (ej: 'En 3 semanas, durante las rebajas de verano')",
  "confidence": numero_0_a_100,
  "key_factors": ["factor 1", "factor 2", "factor 3"],
  "verdict": "comprar_ahora|esperar_7_dias|esperar_30_dias|esperar_mas"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          next_7_days: { type: "object", properties: { direction: { type: "string" }, pct: { type: "number" }, reason: { type: "string" } } },
          next_30_days: { type: "object", properties: { direction: { type: "string" }, pct: { type: "number" }, reason: { type: "string" } } },
          best_time_window: { type: "string" },
          confidence: { type: "number" },
          key_factors: { type: "array", items: { type: "string" } },
          verdict: { type: "string" }
        }
      }
    });

    setPrediction(result);
    setExpanded(true);
    setLoading(false);
  };

  const directionConfig = {
    sube: { icon: TrendingUp, color: "text-red-400", bg: "bg-red-500/10", label: "Sube" },
    baja: { icon: TrendingDown, color: "text-green-400", bg: "bg-green-500/10", label: "Baja" },
    estable: { icon: Minus, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Estable" }
  };

  const verdictLabels = {
    comprar_ahora: { label: "Compra ahora", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
    esperar_7_dias: { label: "Espera 7 días", color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/30" },
    esperar_30_dias: { label: "Espera ~1 mes", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30" },
    esperar_mas: { label: "Espera más tiempo", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" }
  };

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={fetchPrediction}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Brain className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold">Predictor de precio con IA</p>
            <p className="text-slate-400 text-sm">¿Subirá o bajará en los próximos días?</p>
          </div>
        </div>
        {loading ? (
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        ) : expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {expanded && prediction && (
        <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-4">
          {/* Verdict */}
          {prediction.verdict && verdictLabels[prediction.verdict] && (
            <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${verdictLabels[prediction.verdict].bg}`}>
              <span className="text-slate-300 text-sm font-medium">Recomendación IA</span>
              <span className={`font-bold text-sm ${verdictLabels[prediction.verdict].color}`}>
                {verdictLabels[prediction.verdict].label}
              </span>
            </div>
          )}

          {/* 7 and 30 days */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Próximos 7 días", data: prediction.next_7_days },
              { label: "Próximos 30 días", data: prediction.next_30_days }
            ].map(({ label, data }) => {
              if (!data) return null;
              const cfg = directionConfig[data.direction] || directionConfig.estable;
              const Icon = cfg.icon;
              return (
                <div key={label} className={`rounded-xl p-3 ${cfg.bg} border border-white/5`}>
                  <p className="text-slate-400 text-xs mb-2">{label}</p>
                  <div className={`flex items-center gap-1.5 mb-1 ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-base">{data.pct > 0 ? "+" : ""}{data.pct}%</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{data.reason}</p>
                </div>
              );
            })}
          </div>

          {/* Best time window */}
          {prediction.best_time_window && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide mb-1">⏰ Mejor momento para comprar</p>
              <p className="text-white text-sm">{prediction.best_time_window}</p>
            </div>
          )}

          {/* Key factors */}
          {prediction.key_factors?.length > 0 && (
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Factores clave</p>
              <ul className="space-y-1">
                {prediction.key_factors.map((f, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence */}
          {prediction.confidence && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-white/5">
              <span>Confianza de la predicción</span>
              <span className="text-slate-400 font-medium">{prediction.confidence}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}