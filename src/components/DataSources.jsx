import { Database, Globe, Cpu, RefreshCw } from "lucide-react";

const sources = [
  {
    icon: Globe,
    title: "Google Shopping",
    desc: "Precios, tiendas y disponibilidad en tiempo real mediante SerpAPI. Comparamos ofertas de cientos de comercios verificados en tu país."
  },
  {
    icon: Cpu,
    title: "Inteligencia Artificial",
    desc: "Modelos de lenguaje avanzados analizan reseñas, detectan patrones de fraude, predicen tendencias y generan recomendaciones personalizadas."
  },
  {
    icon: Database,
    title: "Bases de datos públicas",
    desc: "Información técnica de productos extraída de Wikipedia, DuckDuckGo y fuentes abiertas para enriquecer cada análisis."
  },
  {
    icon: RefreshCw,
    title: "Actualización continua",
    desc: "Los precios y puntuaciones se actualizan periódicamente. Tus alertas y favoritos se revisan cada 12 horas automáticamente."
  }
];

export default function DataSources() {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-white font-bold text-2xl sm:text-3xl mb-3">Fuentes de datos</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Transparencia total sobre de dónde viene cada dato que ves en VERIFOX.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sources.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:bg-white/8 transition-all group">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-xs text-center mt-6">
        VERIFOX no vende productos directamente. Todos los precios y enlaces redirigen a las tiendas originales.
      </p>
    </section>
  );
}