/**
 * AIVerdict — "¿La compraría la IA?"
 * Veredicto directo, honesto y con explicación breve.
 */
import { Bot, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";

export default function AIVerdict({ product }) {
  const buy = product.verdict === "comprar";
  const wait = product.verdict === "esperar";

  const icon = buy
    ? <ThumbsUp className="w-8 h-8 text-green-400" />
    : wait
    ? <AlertTriangle className="w-8 h-8 text-yellow-400" />
    : <ThumbsDown className="w-8 h-8 text-red-400" />;

  const headline = buy
    ? "Sí, la compraría"
    : wait
    ? "Esperaría antes de comprar"
    : "No, no la compraría";

  const bg = buy
    ? "from-green-500/10 to-green-500/5 border-green-500/20"
    : wait
    ? "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
    : "from-red-500/10 to-red-500/5 border-red-500/20";

  const headlineColor = buy ? "text-green-400" : wait ? "text-yellow-400" : "text-red-400";

  const reasons = product.ai_verdict_reasons || [];

  return (
    <div className={`bg-gradient-to-br ${bg} border rounded-2xl p-6`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-slate-400" />
        <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">¿La compraría la IA?</span>
      </div>

      {/* Main verdict */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-black leading-tight ${headlineColor}`}>{headline}</p>
          <p className="text-slate-400 text-sm mt-0.5">Basado en precio, reseñas y fiabilidad</p>
        </div>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <ul className="space-y-2">
          {reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-0.5 shrink-0 text-slate-500">▸</span>
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}