import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useSEO from "@/hooks/useSEO";

export default function About() {
  const navigate = useNavigate();

  useSEO({
    title: "Acerca de VERIFOX — Comparador de precios con IA",
    description: "Conoce VERIFOX, la plataforma de comparación de precios con inteligencia artificial. Nuestra misión es ayudarte a ahorrar dinero con información transparente y análisis detallados.",
    canonical: "https://verifoxia.com/about",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-slate-300 hover:text-white"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-bold text-lg">Acerca de VERIFOX</h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 pb-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h1 className="text-4xl font-bold text-white mb-6">
              Sobre <span className="text-white">VERI</span><span className="text-orange-500">FOX</span>
            </h1>
            <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
              <p>
                VERIFOX es una plataforma web diseñada para mejorar la manera en que los consumidores comparan productos en línea. En un mercado saturado de opciones y precios variables, VERIFOX utiliza inteligencia artificial para ofrecer recomendaciones orientativas sobre dónde comprar, cuándo comprar y si vale la pena invertir en un producto específico.
              </p>
              <p>
                Nuestra misión es empoderar a los compradores con información transparente y análisis detallados. Comparamos precios disponibles de múltiples tiendas en tu país, evaluamos señales de fiabilidad basadas en reseñas y datos externos, y ofrecemos estimaciones de tendencias para ayudarte a detectar oportunidades de ahorro.
              </p>
              <p>
                VERIFOX está dirigido a consumidores inteligentes que desean tomar decisiones informadas antes de realizar una compra. Ya sea que busques un producto específico, desees comparar alternativas, o simplemente quieras estar atento a cambios de precio, VERIFOX es tu aliado de confianza en el mundo del e-commerce.
              </p>
              <p>
                VERIFOX fue construido por un equipo apasionado de desarrolladores y diseñadores que creen que la transparencia y la accesibilidad a la información son derechos de todo consumidor. Utilizamos tecnologías modernas y APIs de fuentes externas para mostrar datos disponibles y señalar cuándo una comparación contiene estimaciones.
              </p>
            </div>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Características Principales</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Comparación de precios disponibles de múltiples tiendas</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Análisis de fiabilidad y detección de fraude con IA</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Alertas de precio personalizadas cuando el producto baja de tu presupuesto</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Predicción de tendencias de precios para comprar en el mejor momento</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Soporte multi-idioma y multi-moneda para usuarios globales</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Búsqueda visual de productos por imagen</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
