import { Star } from "lucide-react";

export default function ReviewSummary({ product }) {
  const stores = product.stores || [];
  if (!stores.length) return null;

  const totalReviews = stores.reduce((a, s) => a + (s.reviews_count || 0), 0);
  const avgRating = stores.reduce((a, s) => a + (s.rating || 0), 0) / stores.length;

  // Simulated distribution based on avg rating
  const dist = getDistribution(avgRating);

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
      <h2 className="text-white font-bold text-lg mb-4">Resumen de reseñas</h2>

      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-white">{avgRating.toFixed(1)}</p>
          <div className="flex gap-0.5 justify-center mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
              />
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-1">{totalReviews.toLocaleString()} reseñas</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-slate-400 text-xs w-4">{star}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${dist[star]}%` }}
                />
              </div>
              <span className="text-slate-500 text-xs w-8 text-right">{dist[star]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per store ratings */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">Por tienda</p>
        <div className="space-y-2">
          {stores.map((store, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{store.store_name}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= Math.round(store.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
                    />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">{store.rating?.toFixed(1)}</span>
                <span className="text-slate-600 text-xs">({store.reviews_count?.toLocaleString()})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDistribution(avg) {
  // Generate realistic-looking distribution based on average rating
  const base = Math.round(avg);
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (base >= 4) {
    dist[5] = 55; dist[4] = 25; dist[3] = 10; dist[2] = 6; dist[1] = 4;
  } else if (base === 3) {
    dist[5] = 25; dist[4] = 30; dist[3] = 25; dist[2] = 12; dist[1] = 8;
  } else {
    dist[5] = 15; dist[4] = 20; dist[3] = 20; dist[2] = 25; dist[1] = 20;
  }
  return dist;
}