import { ExternalLink, CheckCircle, XCircle, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StoreComparison({ stores }) {
  if (!stores.length) return null;

  const sorted = [...stores].sort((a, b) => (a.price || 0) - (b.price || 0));
  const minPrice = sorted[0]?.price;

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
      <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Comparación de tiendas
      </h2>

      <div className="overflow-x-auto">
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
                    <div className="flex items-center gap-2">
                      {isBest && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1.5 py-0">
                          Mejor
                        </Badge>
                      )}
                      <a
                        href={store.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-medium hover:text-blue-400 flex items-center gap-1 transition-colors"
                      >
                        {store.store_name}
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-bold text-lg ${isBest ? "text-green-400" : "text-white"}`}>
                      ${store.price?.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-xs ml-1">{store.currency}</span>
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
                    <a
                      href={store.url && store.url !== "#" ? store.url : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        store.in_stock
                          ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border border-blue-500/30"
                          : "bg-slate-700/50 text-slate-500 border border-white/5 cursor-not-allowed pointer-events-none"
                      }`}
                    >
                      Comprar
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}