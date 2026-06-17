import { Sparkles, Tag, Target, Wallet, ChevronRight } from "lucide-react";

/**
 * Muestra cómo la IA interpretó la intención de búsqueda del usuario.
 * Props: { intent: { category, use, budget, priority, refined_query } }
 */
export default function IntentInterpreter({ intent }) {
  if (!intent) return null;

  const chips = [
    intent.category && { icon: Tag, label: "Categoría", value: intent.category, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    intent.use && { icon: Target, label: "Uso", value: intent.use, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    intent.priority && { icon: Sparkles, label: "Prioridad", value: intent.priority, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
    intent.budget && { icon: Wallet, label: "Presupuesto", value: intent.budget, color: "text-green-400 bg-green-500/10 border-green-500/20" },
  ].filter(Boolean);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-2">
      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        Intención detectada
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:block" />
      {chips.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
          <Icon className="w-3 h-3 shrink-0" />
          <span className="text-slate-400">{label}:</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}