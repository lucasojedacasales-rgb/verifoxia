/**
 * FraudDetector — Detector de productos "trampa"
 * Muestra señales de alerta sobre opiniones falsas, precios inflados, etc.
 */
import { ShieldAlert, ShieldCheck, ShieldX, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const riskConfig = {
  bajo:   { color: "text-green-400", bg: "from-green-500/10 to-green-500/5", border: "border-green-500/20", Icon: ShieldCheck,  label: "Riesgo Bajo",  dot: "bg-green-400" },
  medio:  { color: "text-yellow-400", bg: "from-yellow-500/10 to-yellow-500/5", border: "border-yellow-500/20", Icon: ShieldAlert, label: "Riesgo Medio", dot: "bg-yellow-400" },
  alto:   { color: "text-red-400",   bg: "from-red-500/10 to-red-500/5",   border: "border-red-500/20",   Icon: ShieldX,     label: "Riesgo Alto",  dot: "bg-red-400"   },
};

export default function FraudDetector({ product }) {
  const risk = product.fraud_risk || "medio";
  const cfg = riskConfig[risk] || riskConfig.medio;
  const RiskIcon = cfg.Icon;
  const flags = product.fraud_flags || [];
  const safeSignals = product.safe_signals || [];

  return (
    <div className={`bg-gradient-to-br ${cfg.bg} border ${cfg.border} rounded-2xl p-6`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <RiskIcon className={`w-5 h-5 ${cfg.color}`} />
        <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Detector de fraude</span>
      </div>

      {/* Risk badge */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border ${cfg.border}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} animate-pulse`} />
          <span className={`font-black text-lg ${cfg.color}`}>{cfg.label}</span>
        </div>
        <span className="text-slate-500 text-sm">de compra</span>
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="mb-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Señales de alerta
          </p>
          <ul className="space-y-1.5">
            {flags.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safe signals */}
      {safeSignals.length > 0 && (
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Señales positivas
          </p>
          <ul className="space-y-1.5">
            {safeSignals.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}