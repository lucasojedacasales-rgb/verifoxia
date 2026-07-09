import { useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Loader2, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function TotalCostCalculator({ product, country }) {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const bestStore = product?.stores?.length
    ? [...product.stores].sort((a, b) => (a.price || 0) - (b.price || 0))[0]
    : null;
  const currency = bestStore?.currency || country?.currency || "EUR";

  const fetchBreakdown = async () => {
    if (breakdown) { setExpanded(!expanded); return; }
    setLoading(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Eres un experto en comercio internacional, aduanas e impuestos de importación.

Producto: "${product.name}"
Categoría: ${product.category}
País del comprador: ${country?.name || "España"} (${country?.code || "ES"})
Moneda: ${currency}

Tiendas y precios:
${(product.stores || []).map(s => `- ${s.store_name}: ${s.price} ${s.currency}`).join("\n")}

Calcula el COSTE TOTAL REAL de comprar este producto en cada tienda, incluyendo:
- Precio base del producto
- Coste de envío estimado al país del usuario
- IVA / impuestos locales aplicables
- Aranceles de importación (especialmente si la tienda es extranjera)
- Tasas de gestión aduanera si aplica
- Tiempo de entrega estimado

Devuelve JSON:
{
  "stores_breakdown": [
    {
      "store_name": "nombre",
      "base_price": numero,
      "shipping": numero,
      "taxes": numero,
      "import_duties": numero,
      "handling_fee": numero,
      "total_real_cost": numero,
      "delivery_days": "ej: 2-3 días",
      "notes": "observación importante si la hay"
    }
  ],
  "cheapest_real": "nombre de la tienda más barata en coste total real",
  "biggest_surprise": "tienda donde hay mayor diferencia entre precio base y coste real",
  "tax_note": "nota sobre el régimen fiscal del país del usuario (IVA, umbrales de importación, etc.)"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          stores_breakdown: {
            type: "array",
            items: {
              type: "object",
              properties: {
                store_name: { type: "string" },
                base_price: { type: "number" },
                shipping: { type: "number" },
                taxes: { type: "number" },
                import_duties: { type: "number" },
                handling_fee: { type: "number" },
                total_real_cost: { type: "number" },
                delivery_days: { type: "string" },
                notes: { type: "string" }
              }
            }
          },
          cheapest_real: { type: "string" },
          biggest_surprise: { type: "string" },
          tax_note: { type: "string" }
        }
      }
    });

    setBreakdown(result);
    setExpanded(true);
    setLoading(false);
  };

  const costItems = [
    { key: "shipping", label: "Envío", color: "text-blue-300" },
    { key: "taxes", label: "Impuestos / IVA", color: "text-yellow-300" },
    { key: "import_duties", label: "Aranceles importación", color: "text-orange-300" },
    { key: "handling_fee", label: "Gestión aduanera", color: "text-red-300" },
  ];

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={fetchBreakdown}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-4.5 h-4.5 text-yellow-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold">Coste real total</p>
            <p className="text-slate-400 text-sm">Precio + envío + impuestos + aduanas</p>
          </div>
        </div>
        {loading ? (
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        ) : expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {expanded && breakdown && (
        <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-4">

          {/* Cheapest real */}
          {breakdown.cheapest_real && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-slate-300 text-sm">Más barato en total real</span>
              <span className="text-green-400 font-bold text-sm">{breakdown.cheapest_real}</span>
            </div>
          )}

          {/* Per-store breakdown */}
          <div className="space-y-3">
            {(breakdown.stores_breakdown || []).map((store, i) => (
              <div key={i} className="bg-slate-900/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold text-sm">{store.store_name}</span>
                  <div className="text-right">
                    <span className="text-white font-bold">{store.total_real_cost?.toLocaleString()} {currency}</span>
                    <p className="text-slate-500 text-xs">coste total</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Precio base</span>
                    <span className="text-slate-300">{store.base_price?.toLocaleString()} {currency}</span>
                  </div>
                  {costItems.map(({ key, label, color }) =>
                    store[key] > 0 ? (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-slate-500">+ {label}</span>
                        <span className={color}>+{store[key]?.toLocaleString()} {currency}</span>
                      </div>
                    ) : null
                  )}
                  <div className="flex justify-between text-xs pt-1 border-t border-white/5 mt-1">
                    <span className="text-slate-400">⏱ Entrega</span>
                    <span className="text-slate-300">{store.delivery_days}</span>
                  </div>
                  {store.notes && (
                    <div className="flex gap-1.5 mt-2 bg-blue-500/10 rounded-lg px-2 py-1.5">
                      <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-blue-300 text-xs">{store.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tax note */}
          {breakdown.tax_note && (
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">📋 Nota fiscal</p>
              <p className="text-slate-300 text-xs leading-relaxed">{breakdown.tax_note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
