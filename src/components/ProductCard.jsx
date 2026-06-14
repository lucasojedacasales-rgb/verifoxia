import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

const categoryLabels = {
  electronica: "Electrónica",
  ropa: "Ropa",
  hogar: "Hogar",
  deportes: "Deportes",
  belleza: "Belleza",
  juguetes: "Juguetes",
  libros: "Libros",
  otro: "Otro"
};

const trendIcons = {
  subiendo: { icon: TrendingUp, color: "text-red-400", label: "Precio subiendo" },
  bajando: { icon: TrendingDown, color: "text-green-400", label: "Precio bajando" },
  estable: { icon: Minus, color: "text-yellow-400", label: "Precio estable" }
};

export default function ProductCard({ product }) {
  const prices = (product.stores || []).map(s => s.price).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const avgRating = product.stores?.length
    ? (product.stores.reduce((a, s) => a + (s.rating || 0), 0) / product.stores.length).toFixed(1)
    : null;
  const totalReviews = product.stores?.reduce((a, s) => a + (s.reviews_count || 0), 0) || 0;

  const trend = product.price_trend ? trendIcons[product.price_trend] : null;
  const TrendIcon = trend?.icon;

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
      <div className="flex gap-4">
        <img
          src={product.image_url || `https://source.unsplash.com/200x200/?${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-xl bg-slate-700 shrink-0"
          onError={(e) => { e.target.src = "https://source.unsplash.com/200x200/?product"; }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
              {categoryLabels[product.category] || "Producto"}
            </Badge>
          </div>
          <h1 className="text-white font-bold text-xl leading-tight mb-2">{product.name}</h1>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{product.description}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10">
        <div>
          <p className="text-slate-500 text-xs mb-1">Rango de precio</p>
          {minPrice ? (
            <p className="text-white font-bold text-lg">
              ${minPrice.toLocaleString()} – ${maxPrice?.toLocaleString()}
            </p>
          ) : (
            <p className="text-slate-400 text-sm">No disponible</p>
          )}
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Rating promedio</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-bold text-lg">{avgRating || "—"}</span>
          </div>
          <p className="text-slate-500 text-xs">{totalReviews.toLocaleString()} reseñas</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Tendencia</p>
          {trend ? (
            <div className={`flex items-center gap-1 ${trend.color}`}>
              <TrendIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{trend.label}</span>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">—</p>
          )}
        </div>
      </div>

      {/* Pros & Cons */}
      {(product.pros?.length || product.cons?.length) && (
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10">
          {product.pros?.length > 0 && (
            <div>
              <p className="text-green-400 text-xs font-semibold uppercase tracking-wide mb-2">✓ Ventajas</p>
              <ul className="space-y-1">
                {product.pros.map((p, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-1.5">
                    <span className="text-green-400 mt-0.5">•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.cons?.length > 0 && (
            <div>
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wide mb-2">✗ Desventajas</p>
              <ul className="space-y-1">
                {product.cons.map((c, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-1.5">
                    <span className="text-red-400 mt-0.5">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}