import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ExternalLink, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useSEO from "@/hooks/useSEO";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: "Favoritos — VERIFOX", description: "Tus ofertas guardadas" });

  useEffect(() => {
    base44.entities.Favorite.list("-created_date")
      .then(setFavorites)
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (favId) => {
    await base44.entities.Favorite.delete(favId);
    setFavorites((prev) => prev.filter((f) => f.id !== favId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-lg mx-auto px-4 py-8 pb-28 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <h1 className="text-white font-bold text-xl">Favoritos</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4 text-center">
            <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-400/40" />
            </div>
            <p className="text-slate-400 text-sm">No tienes ofertas guardadas aún.</p>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              <Search className="w-4 h-4" />
              Buscar productos
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {favorites.map((fav) => (
              <li key={fav.id} className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-2xl px-4 py-3">
                {fav.image_url && (
                  <img
                    src={fav.image_url}
                    alt={fav.product_name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-white/10"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{fav.product_name}</p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">
                    {fav.best_store} · <span className="text-green-400 font-medium">{fav.best_price_str || "—"}</span>
                  </p>
                  {fav.verdict && (
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      fav.verdict === "comprar" ? "bg-green-500/20 text-green-400" :
                      fav.verdict === "esperar" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {fav.verdict === "comprar" ? "✓ Comprar" : fav.verdict === "esperar" ? "⏳ Esperar" : "✗ No comprar"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  {fav.best_store_url && (
                    <a
                      href={fav.best_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                      aria-label="Ver oferta"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleRemove(fav.id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    aria-label="Eliminar favorito"
                  >
                    <Heart className="w-4 h-4 fill-red-400" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}