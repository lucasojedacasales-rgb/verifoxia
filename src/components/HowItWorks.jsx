import { Search, Sparkles, ShieldCheck, Bell, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Busca cualquier producto",
    desc: "Escribe lo que quieres comprar — desde un iPhone hasta unas zapatillas. Nuestra IA entiende lo que buscas aunque uses lenguaje natural.",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/20"
  },
  {
    icon: Sparkles,
    title: "La IA analiza por ti",
    desc: "Comparamos precios en tiempo real de cientos de tiendas, analizamos reseñas, detectamos fraudes y calculamos la puntuación Verifox.",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/20"
  },
  {
    icon: ShieldCheck,
    title: "Recibe un veredicto claro",
    desc: "Te decimos si merece la pena comprar, esperar o buscar otra opción. Con puntuación, pros, contras y mejor alternativa.",
    color: "bg-green-500/20 text-green-400 border-green-500/20"
  },
  {
    icon: Bell,
    title: "Activa alertas y compara",
    desc: "Crea alertas de precio, guarda favoritos y recibe avisos cuando baje el precio. Compara productos lado a lado.",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/20"
  }
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-white font-bold text-2xl sm:text-3xl mb-3">Cómo funciona</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Cuatro pasos para tomar la mejor decisión de compra, sin letra pequeña.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map(({ icon: Icon, title, desc, color }, i) => (
          <div key={title} className="relative group">
            <div className={`${color} border rounded-2xl p-5 h-full hover:scale-[1.02] transition-all bg-white/5`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-slate-600 text-xs font-bold bg-white/10 rounded-full w-5 h-5 flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div className={`w-10 h-10 ${color.split(" ")[0]} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold mb-1.5">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 z-10" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}