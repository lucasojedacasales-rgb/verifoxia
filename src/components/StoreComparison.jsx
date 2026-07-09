import { ExternalLink, CheckCircle, XCircle, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAffiliateLink } from "@/hooks/useAffiliateLink";

export default function StoreComparison({ stores, productName = "", searchQuery = "", countryCode = "ES" }) {
  const { openAffiliateLink } = useAffiliateLink();
  if (!stores.length) return null;
  const sorted = [...stores].sort((a, b) => (a.price || 0) - (b.price || 0));
  const minPrice = sorted[0]?.price;
  const hasRealPrices = stores.some((store) => store.data_source === "google_shopping");

  const sourceBadge = (source) => (
    <Badge
      variant="outline"
      className={
        source === "google_shopping"
          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs px-1.5 py-0"
          : "bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs px-1.5 py-0"
      }
    >
      {source === "google_shopping" ? "Dato real" : "Estimado IA"}
    </Badge>
  );

  const goToStore = (store) => {
    if (!store.url || store.url === "#") return;
    const price = store.price || 0;
    openAffiliateLink({
      storeUrl: store.url,
      storeName: store.store_name,
      productName: store.product_title || productName,
      searchQuery,
      countryCode,
      currency: store.currency || "EUR",
      estimatedPrice: price,
    });
  };

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-4 md:p-6">
      <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Comparación de tiendas
      </h2>

      {!hasRealPrices && (
        <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          No hemos encontrado precios reales suficientes; esta comparación puede contener estimaciones.
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-slate-400 text-xs font-medium pb-3 pr-4">Tienda</th>
              <th className="text-right text-slate-400 text-xs font-medium pb-3 px-4">Precio</th>
              <th className="text-right text-slate-400 text-xs font-medium pb-3 px-4">Rating</th>
              <th className="text-right text-slate-400 text-xs font-medium pb-3 px-4">Reseñas</th>
              <th className="text-center text-slate-400 text-xs font-medium pb-3 px-4">Stock</th>
              <th className="text-right text-slate-400 text-xs font-medium pb-3 pl-4">Ahorro</th>
              <th className="text-right text-slate-400 text-xs font-medium pb-3 pl-4">Enlace</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((store, i) => {
              const isBest = store.price === minPrice;
              const savings = i > 0 ? ((store.price - minPrice) / store.price * 100).toFixed(0) : null;

              return (
                <tr
                   key={i}
                   className={`border-b border-white/5 last:border-0 ${isBest ? "bg-green-500/5" : ""}`}
                 >
                   <td className="py-3 pr-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          {isBest && (
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1.5 py-0">
                              Mejor
                            </Badge>
                          )}
                          {sourceBadge(store.data_source)}
                          <button
                            onClick={() => goToStore(store)}
                            className="text-white font-medium hover:text-blue-400 flex items-center gap-1 transition-colors"
                          >
                            {store.store_name}
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </button>
                        </div>
                        {store.product_title && (
                          <span className="text-slate-500 text-xs truncate max-w-[220px]" title={store.product_title}>
                            {store.product_title}
                          </span>
                        )}
                        {store.delivery && (
                          <span className="text-green-400 text-xs">{store.delivery}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold text-lg ${isBest ? "text-green-400" : "text-white"}`}>
                        {store.price?.toLocaleString()} <span className="text-sm font-normal">{store.currency}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-300 text-sm">{store.rating?.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-400 text-sm">{store.reviews_count?.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {store.in_stock ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      {savings && parseInt(savings) > 0 ? (
                        <span className="text-red-400 text-sm font-medium">+{savings}% más caro</span>
                      ) : (
                        <span className="text-green-400 text-sm font-medium">Más barato</span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => goToStore(store)}
                        disabled={!store.in_stock}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all min-h-[44px] ${
                          store.in_stock
                            ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border border-blue-500/30"
                            : "bg-slate-700/50 text-slate-500 border border-white/5 cursor-not-allowed opacity-60"
                        }`}
                      >
                        Comprar
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                    </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((store, i) => {
          const isBest = store.price === minPrice;
          const savings = i > 0 ? ((store.price - minPrice) / store.price * 100).toFixed(0) : null;

          return (
            <div key={i} className={`border border-white/10 rounded-xl p-4 ${isBest ? "bg-green-500/10 border-green-500/30" : "bg-slate-700/30"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    {isBest && (
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1.5 py-0 shrink-0">
                        Mejor
                      </Badge>
                    )}
                    {sourceBadge(store.data_source)}
                    <button
                      onClick={() => goToStore(store)}
                      className="text-white font-semibold hover:text-blue-400 transition-colors text-left"
                    >
                      {store.store_name}
                    </button>
                  </div>
                  {store.product_title && (
                    <span className="text-slate-500 text-xs line-clamp-1">{store.product_title}</span>
                  )}
                  {store.delivery && (
                    <span className="text-green-400 text-xs">{store.delivery}</span>
                  )}
                </div>
                {store.in_stock ? (
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Precio:</span>
                  <span className={`font-bold text-base ${isBest ? "text-green-400" : "text-white"}`}>
                    {store.price?.toLocaleString()} {store.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-slate-300">{store.rating?.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reseñas:</span>
                  <span className="text-slate-300">{store.reviews_count?.toLocaleString()}</span>
                </div>
                {savings && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Diferencia:</span>
                    <span className={parseInt(savings) > 0 ? "text-red-400 font-medium" : "text-green-400 font-medium"}>
                      {parseInt(savings) > 0 ? `+${savings}% más caro` : "Más barato"}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => goToStore(store)}
                disabled={!store.in_stock}
                className={`w-full mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all min-h-[44px] ${
                  store.in_stock
                    ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border border-blue-500/30"
                    : "bg-slate-700/50 text-slate-500 border border-white/5 cursor-not-allowed opacity-60"
                }`}
              >
                Comprar
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
