import { Star } from "lucide-react";

const testimonials = [
  { text: "Ahorré 120€ en un televisor 4K. La IA me avisó que esperara una semana y acertó.", name: "María G.", role: "Compradora frecuente", stars: 5 },
  { text: "Comparar móviles nunca fue tan fácil. El detector de fraude me salvó de una oferta falsa.", name: "Carlos R.", role: "Usuario verificador", stars: 5 },
  { text: "Las alertas de precio son oro puro. Me llegó el email justo cuando bajó el portátil que quería.", name: "Laura M.", role: "Estudiante", stars: 5 },
  { text: "Por fin una web que te dice la verdad sobre si comprar o no. Sin publicidad engañosa.", name: "David P.", role: "Ingeniero", stars: 4 },
];

export default function TestimonialStrip() {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-white font-bold text-2xl sm:text-3xl mb-3">Lo que dicen nuestros usuarios</h2>
        <p className="text-slate-400">Miles de compradores inteligentes ya usan VERIFOX cada día.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {testimonials.map(({ text, name, role, stars }) => (
          <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/8 transition-all">
            <div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < stars ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
                  />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{text}"</p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{name}</p>
              <p className="text-slate-500 text-xs">{role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}