import { useNavigate } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";

const examples = [
  {
    name: "iPhone 15 128GB",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&h=80&fit=crop",
    score: 87,
    verdict: "comprar",
    price: "799€",
    store: "Amazon",
    reason: "Precio mínimo histórico. Excelente relación calidad-precio.",
    query: "iPhone 15",
  },
  {
    name: "Samsung 4K QLED 55\"",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=80&h=80&fit=crop",
    score: 62,
    verdict: "esperar",
    price: "649€",
    store: "MediaMarkt",
    reason: "El precio bajará ~15% en las próximas 3 semanas según tendencia.",
    query: "Samsung TV 4K",
  },
  {
    name: "AirPods Pro 2",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&h=80&fit=crop",
    score: 91,
    verdict: "comprar",
    price: "229€",
    store: "El Corte Inglés",
    reason: "Precio más bajo en 6 meses. Alta demanda, puede subir pronto.",
    query: "AirPods Pro",
  },
  {
    name: 'Xiaomi Redmi Note 13',
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop",
    score: 34,
    verdict: "no_comprar",
    price: "219€",
    store: "Fnac",
    reason: "Sobrecoste del 40% vs competencia. Alternativas mejores por menos.",
    query: "Xiaomi Redmi Note 13",
  },
];

const verdictConfig = {
  comprar: { label: "✅ Comprar", bg: "bg-green-500/15", border: "border-green-500/25", text: "text-green-400" },
  esperar: { label: "⏳ Esperar", bg: "bg-yellow-500/15", border: "border-yellow-500/25", text: "text-yellow-400" },
  no_comprar: { label: "❌ No comprar", bg: "bg-red-500/15", border: "border-red-500/25", text: "text-red-400" },
};

function ScoreRing({ score }) {
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const radius = 20;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">{score}</span>
    </div>
  );
}

export default function ScoreExamples() {
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();

  return (
    <section className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <span className="inline-block bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
          Ejemplos reales
        </span>
        <h2 className="text-white font-black text-2xl sm:text-3xl mb-2">
          El VERIFOX Score en acción
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Así de claro te decimos si comprar o no. Sin rodeos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map(({ name, image, score, verdict, price, store, reason, query }) => {
          const v = verdictConfig[verdict];
          return (
            <button
              key={name}
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&country=${selectedCountry.code}`)}
              className="flex items-start gap-3 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-left transition-all group"
            >
              <ScoreRing score={score} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-white font-semibold text-sm truncate">{name}</p>
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${v.bg} ${v.border} ${v.text} border`}>
                    {v.label}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mb-2 leading-snug">{reason}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-white font-bold">{price}</span>
                  <span>·</span>
                  <span>{store}</span>
                  <span className="ml-auto text-blue-400 group-hover:text-blue-300 font-medium">Ver análisis →</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}