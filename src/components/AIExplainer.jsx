const steps = [
  {
    step: "01",
    title: "Consultamos fuentes externas",
    desc: "Usamos Google Shopping y tiendas disponibles por país para obtener referencias de precio cuando hay datos suficientes.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    step: "02",
    title: "La IA estudia el producto",
    desc: "Nuestro modelo analiza reseñas, historial de precios, fiabilidad del vendedor y relación calidad-precio.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    step: "03",
    title: "Genera el VERIFOX Score",
    desc: "Una puntuación de 0 a 100 que resume si el producto vale lo que cuesta y si es buen momento para comprar.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    step: "04",
    title: "Te da un veredicto claro",
    desc: "\"Comprar ahora\", \"Esperar\" o \"No comprar\" — sin tecnicismos, directo al grano.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export default function AIExplainer() {
  return (
    <section className="px-4 sm:px-6 py-10 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-block bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
          Inteligencia Artificial
        </span>
        <h2 className="text-white font-black text-2xl sm:text-3xl mb-2">
          ¿Cómo decide la IA si un producto vale la pena?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          No es magia — es un proceso en 4 pasos que analiza cada producto desde todos los ángulos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map(({ step, title, desc, color, bg, border }) => (
          <div key={step} className={`relative ${bg} border ${border} rounded-2xl p-5`}>
            <span className={`text-4xl font-black ${color} opacity-30 leading-none block mb-3`}>{step}</span>
            <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
