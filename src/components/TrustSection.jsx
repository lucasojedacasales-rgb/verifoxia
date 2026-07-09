import { ShieldCheck, Database, RefreshCw, Brain, Lock, Users } from "lucide-react";

const pillars = [
  {
    icon: Database,
    title: "Datos de fuentes verificadas",
    desc: "Los precios provienen directamente de Google Shopping y APIs oficiales de tiendas — no los inventamos.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: RefreshCw,
    title: "Consulta por búsqueda",
    desc: "Cada análisis intenta obtener datos actuales de fuentes externas y muestra estimaciones cuando no hay precios suficientes.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: Brain,
    title: "IA entrenada para compras",
    desc: "La IA ayuda a resumir reseñas, precios y señales de riesgo para darte un veredicto orientativo.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Lock,
    title: "Sin conflicto de interés",
    desc: "No somos una tienda. No tenemos stock que vender. Nuestro único objetivo es que tú pagues menos.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Detección de fraudes activa",
    desc: "Señalamos indicios de precios inflados, productos dudosos o tiendas que requieren una revisión extra.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: Users,
    title: "Historial útil",
    desc: "Tus búsquedas, favoritos y alertas ayudan a organizar mejor tus decisiones de compra.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

export default function TrustSection() {
  return (
    <section className="px-4 sm:px-6 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block bg-green-500/15 border border-green-500/25 text-green-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
          Transparencia total
        </span>
        <h2 className="text-white font-black text-2xl sm:text-3xl mb-2">
          ¿Por qué confiar en <span className="text-white">VERI</span><span className="text-orange-500">FOX</span>?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
          Buena pregunta. Esto es lo que nos diferencia de un simple comparador de precios.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {pillars.map(({ icon: Icon, title, desc, color, bg, border }) => (
          <div key={title} className={`${bg} border ${border} rounded-2xl p-5`}>
            <div className={`w-10 h-10 ${bg} border ${border} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Quote / CTA */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl px-6 py-5 text-center">
        <p className="text-slate-300 text-sm sm:text-base italic mb-1">
          "La puntuación es una ayuda para decidir: combina precio, reseñas y señales de fiabilidad, pero siempre conviene verificar el dato final en la tienda."
        </p>
        <p className="text-slate-500 text-xs">— Equipo <span className="text-white font-bold">VERI</span><span className="text-orange-500 font-bold">FOX</span></p>
      </div>
    </section>
  );
}
