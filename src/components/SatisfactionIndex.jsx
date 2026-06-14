/**
 * SatisfactionIndex — Índice de satisfacción real
 * Desglose de dimensiones: calidad, durabilidad, precio, devoluciones.
 */
import { Star } from "lucide-react";

const dimensions = [
  { key: "quality",       label: "Calidad",              color: "bg-blue-500",    text: "text-blue-400"    },
  { key: "durability",    label: "Durabilidad",           color: "bg-purple-500",  text: "text-purple-400"  },
  { key: "value",         label: "Relación calidad/precio", color: "bg-green-500", text: "text-green-400"   },
  { key: "support",       label: "Servicio postventa",    color: "bg-yellow-500",  text: "text-yellow-400"  },
];

const returnRateConfig = {
  baja:   { color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20",  label: "Devoluciones: Bajas"   },
  media:  { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Devoluciones: Medias"  },
  alta:   { color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    label: "Devoluciones: Altas"   },
};

export default function SatisfactionIndex({ product }) {
  const idx = product.satisfaction_index;
  if (!idx) return null;

  const returnCfg = returnRateConfig[idx.return_rate || "media"] || returnRateConfig.media;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="text-white font-semibold">Índice de satisfacción real</span>
      </div>

      {/* Dimensions */}
      <div className="space-y-4 mb-5">
        {dimensions.map(({ key, label, color, text }) => {
          const score = idx[key] ?? 0;
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-400 text-sm">{label}</span>
                <span className={`font-bold text-sm ${text}`}>{score}<span className="text-slate-600 font-normal">/10</span></span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700`}
                  style={{ width: `${score * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Return rate badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${returnCfg.bg} border ${returnCfg.border}`}>
        <span className={`text-sm font-semibold ${returnCfg.color}`}>{returnCfg.label}</span>
      </div>
    </div>
  );
}