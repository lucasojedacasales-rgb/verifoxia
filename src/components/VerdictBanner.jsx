import { CheckCircle2, Clock, XCircle } from "lucide-react";
import TrustScore from "@/components/TrustScore";

const verdictConfig = {
  comprar: {
    icon: CheckCircle2,
    label: "¡Comprar ahora!",
    sublabel: "Buena relación calidad-precio",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
    text: "text-green-400",
    bar: "bg-green-500",
  },
  esperar: {
    icon: Clock,
    label: "Esperar",
    sublabel: "Puede mejorar el precio pronto",
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    bar: "bg-yellow-500",
  },
  no_comprar: {
    icon: XCircle,
    label: "No comprar",
    sublabel: "No vale lo que cuesta",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    text: "text-red-400",
    bar: "bg-red-500",
  },
};

export default function VerdictBanner({ product }) {
  const config = verdictConfig[product.verdict] || verdictConfig.esperar;
  const Icon = config.icon;
  const score = product.ai_score ?? 50;

  return (
    <div className={`h-full ${config.bg} border ${config.border} rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4`}>
      <Icon className={`w-14 h-14 ${config.text}`} />
      <div>
        <h2 className={`text-2xl font-bold ${config.text}`}>{config.label}</h2>
        <p className="text-slate-400 text-sm mt-1">{config.sublabel}</p>
      </div>

      {/* TrustScore™ */}
      <TrustScore score={score} size="lg" />

      {product.best_time_to_buy && (
        <div className="bg-white/5 rounded-xl p-3 w-full">
          <p className="text-slate-500 text-xs mb-1">Mejor momento para comprar</p>
          <p className="text-slate-300 text-sm">{product.best_time_to_buy}</p>
        </div>
      )}
    </div>
  );
}