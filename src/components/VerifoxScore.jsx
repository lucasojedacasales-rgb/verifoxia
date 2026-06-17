import { Shield, TrendingUp, Star, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const SCORE_LEVELS = [
  { min: 80, label: "Excelente", color: "text-emerald-400", bg: "bg-emerald-500", ring: "ring-emerald-500/30", glow: "shadow-emerald-500/20", icon: CheckCircle },
  { min: 60, label: "Bueno",     color: "text-blue-400",    bg: "bg-blue-500",    ring: "ring-blue-500/30",    glow: "shadow-blue-500/20",    icon: TrendingUp },
  { min: 40, label: "Regular",   color: "text-yellow-400",  bg: "bg-yellow-500",  ring: "ring-yellow-500/30",  glow: "shadow-yellow-500/20",  icon: AlertTriangle },
  { min: 0,  label: "Malo",      color: "text-red-400",     bg: "bg-red-500",     ring: "ring-red-500/30",     glow: "shadow-red-500/20",     icon: XCircle },
];

function getLevel(score) {
  return SCORE_LEVELS.find((l) => score >= l.min) || SCORE_LEVELS[SCORE_LEVELS.length - 1];
}

export default function VerifoxScore({ product }) {
  if (!product) return null;

  const score = Math.round(product.ai_score ?? 0);
  const level = getLevel(score);
  const Icon = level.icon;

  // Sub-scores from satisfaction_index
  const si = product.satisfaction_index || {};
  const subScores = [
    { label: "Calidad", value: si.quality },
    { label: "Durabilidad", value: si.durability },
    { label: "Precio/Valor", value: si.value },
    { label: "Soporte", value: si.support },
  ].filter((s) => s.value != null);

  // Circumference of the SVG circle
  const R = 52;
  const circ = 2 * Math.PI * R;
  const offset = circ - (score / 100) * circ;

  return (
    <div className={`bg-slate-800/70 border border-white/10 rounded-2xl p-5 ring-1 ${level.ring} shadow-lg ${level.glow}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm leading-tight">VERIFOX Score</h3>
          <p className="text-slate-500 text-xs">Puntuación IA del producto</p>
        </div>
      </div>

      {/* Score ring + label */}
      <div className="flex items-center gap-6 mb-5">
        <div className="relative shrink-0">
          <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
            {/* Track */}
            <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            {/* Progress */}
            <circle
              cx="64" cy="64" r={R}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className={level.color}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${level.color}`}>{score}</span>
            <span className="text-slate-500 text-xs font-medium">/100</span>
          </div>
        </div>

        <div className="flex-1">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2 bg-white/5`}>
            <Icon className={`w-4 h-4 ${level.color}`} />
            <span className={`font-bold text-base ${level.color}`}>{level.label}</span>
          </div>

          {/* Verdict */}
          <VerdictChip verdict={product.verdict} />

          {/* Fraud risk */}
          {product.fraud_risk && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-slate-500 text-xs">Riesgo fraude:</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                product.fraud_risk === "bajo" ? "bg-emerald-500/15 text-emerald-400"
                : product.fraud_risk === "medio" ? "bg-yellow-500/15 text-yellow-400"
                : "bg-red-500/15 text-red-400"
              }`}>
                {product.fraud_risk.charAt(0).toUpperCase() + product.fraud_risk.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-score bars */}
      {subScores.length > 0 && (
        <div className="space-y-2.5 mb-4 border-t border-white/5 pt-4">
          {subScores.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-slate-400 text-xs w-24 shrink-0">{label}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${level.bg}`}
                  style={{ width: `${(value / 10) * 100}%`, transition: "width 1s ease" }}
                />
              </div>
              <span className="text-slate-400 text-xs w-6 text-right">{value}/10</span>
            </div>
          ))}
        </div>
      )}

      {/* AI verdict reasons */}
      {(product.ai_verdict_reasons || []).length > 0 && (
        <div className="border-t border-white/5 pt-4 space-y-1.5">
          {product.ai_verdict_reasons.slice(0, 3).map((reason, i) => (
            <div key={i} className="flex items-start gap-2">
              <Star className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${level.color}`} />
              <span className="text-slate-300 text-xs leading-relaxed">{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VerdictChip({ verdict }) {
  if (!verdict) return null;
  const map = {
    comprar:    { label: "✅ Comprar",     cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    esperar:    { label: "⏳ Esperar",     cls: "bg-yellow-500/15  text-yellow-400  border-yellow-500/30"  },
    no_comprar: { label: "❌ No comprar",  cls: "bg-red-500/15     text-red-400     border-red-500/30"     },
  };
  const v = map[verdict] || { label: verdict, cls: "bg-white/10 text-slate-300" };
  return (
    <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${v.cls}`}>
      {v.label}
    </span>
  );
}