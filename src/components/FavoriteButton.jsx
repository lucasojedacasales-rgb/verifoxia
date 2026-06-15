import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoriteButton({ product, country }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // "added" | "removed"
  const [favoriteId, setFavoriteId] = useState(null);

  // Check if already favorited on mount
  useEffect(() => {
    if (!product?.search_query) return;
    base44.entities.Favorite.filter({ search_query: product.search_query })
      .then((results) => {
        if (results.length > 0) {
          setIsFavorite(true);
          setFavoriteId(results[0].id);
        }
      })
      .catch(() => {});
  }, [product?.search_query]);

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isFavorite && favoriteId) {
        await base44.entities.Favorite.delete(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        showToast("removed");
      } else {
        // Get best store info
        const sortedStores = [...(product.stores || [])].sort((a, b) => a.price - b.price);
        const best = sortedStores[0];

        const fav = await base44.entities.Favorite.create({
          product_name: product.name,
          search_query: product.search_query,
          best_price: best?.price,
          best_price_str: best ? `${best.currency || country?.currency || ""} ${best.price}` : null,
          best_store: best?.store_name,
          best_store_url: best?.url,
          image_url: product.image_url,
          verdict: product.verdict,
          ai_score: product.ai_score,
          currency: best?.currency || country?.currency,
          country_code: country?.code,
        });
        setIsFavorite(true);
        setFavoriteId(fav.id);
        showToast("added");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-3 sm:px-4 border rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base min-h-[44px] ${
          isFavorite
            ? "bg-pink-500/20 hover:bg-pink-500/30 border-pink-500/40 text-pink-400 hover:text-pink-300"
            : "bg-white/5 hover:bg-white/10 border-white/15 text-slate-300 hover:text-white"
        }`}
        aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      >
        <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-pink-400 text-pink-400" : ""}`} />
        {isFavorite ? "Guardado" : "Guardar oferta"}
      </button>

      {/* Mini toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-white/10 z-50"
          >
            {toast === "added" ? "❤️ Oferta guardada" : "🗑️ Eliminado de favoritos"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}