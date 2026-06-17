import { useNavigate } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";

const categories = [
  { label: "Móviles", emoji: "📱", query: "smartphone" },
  { label: "Portátiles", emoji: "💻", query: "portátil laptop" },
  { label: "TV & Pantallas", emoji: "📺", query: "televisor 4K" },
  { label: "Auriculares", emoji: "🎧", query: "auriculares inalámbricos" },
  { label: "Tablets", emoji: "📟", query: "tablet" },
  { label: "Cámaras", emoji: "📷", query: "cámara digital" },
  { label: "Consolas", emoji: "🎮", query: "consola gaming" },
  { label: "Electrodomésticos", emoji: "🏠", query: "electrodomésticos" },
  { label: "Zapatillas", emoji: "👟", query: "zapatillas deportivas" },
  { label: "Relojes", emoji: "⌚", query: "smartwatch" },
  { label: "Perfumes", emoji: "🌸", query: "perfume mujer hombre" },
  { label: "Libros", emoji: "📚", query: "libros bestseller" },
];

export default function CategoryGrid() {
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();

  return (
    <section className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4 tracking-tight">
        Explorar por categoría
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
        {categories.map(({ label, emoji, query }) => (
          <button
            key={label}
            onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&country=${selectedCountry.code}`)}
            className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl px-2 py-3 sm:py-4 transition-all group"
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">{emoji}</span>
            <span className="text-slate-300 text-xs font-medium text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}