import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, TrendingUp, MousePointerClick, DollarSign, Store, ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSEO from "@/hooks/useSEO";

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useSEO({
    title: "Dashboard de Afiliados — VERIFOX",
    description: "Informes de tráfico de afiliados: clics, comisiones estimadas y tiendas con mejor rendimiento.",
  });

  useEffect(() => {
    setLoading(true);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    base44.asServiceRole.entities.AffiliateClick
      .filter({ created_date: { $gte: since } }, "-created_date", 500)
      .then(setClicks)
      .catch(() => setClicks([]))
      .finally(() => setLoading(false));
  }, [days]);

  const stats = useMemo(() => {
    const total = clicks.length;
    const withAffiliate = clicks.filter((c) => c.estimated_commission_pct > 0);
    const totalCommission = withAffiliate.reduce((sum, c) => sum + (c.estimated_value || 0), 0);
    const avgCommissionPct = withAffiliate.length
      ? withAffiliate.reduce((sum, c) => sum + c.estimated_commission_pct, 0) / withAffiliate.length
      : 0;

    // Top stores
    const storeMap = {};
    clicks.forEach((c) => {
      const key = c.store_name;
      if (!storeMap[key]) storeMap[key] = { name: key, clicks: 0, commission: 0 };
      storeMap[key].clicks++;
      storeMap[key].commission += c.estimated_value || 0;
    });
    const topStores = Object.values(storeMap)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Top products
    const productMap = {};
    clicks.forEach((c) => {
      const key = c.product_name;
      if (!productMap[key]) productMap[key] = { name: key, clicks: 0, commission: 0 };
      productMap[key].clicks++;
      productMap[key].commission += c.estimated_value || 0;
    });
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Per day
    const dayMap = {};
    clicks.forEach((c) => {
      const day = c.created_date?.split("T")[0] || "?";
      if (!dayMap[day]) dayMap[day] = { day, clicks: 0, commission: 0 };
      dayMap[day].clicks++;
      dayMap[day].commission += c.estimated_value || 0;
    });
    const perDay = Object.values(dayMap).sort((a, b) => a.day.localeCompare(b.day));

    return { total, withAffiliate: withAffiliate.length, totalCommission, avgCommissionPct, topStores, topProducts, perDay };
  }, [clicks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-slate-300 hover:text-white shrink-0" aria-label="Volver">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Dashboard de Afiliados
          </h1>
          <div className="flex-1" />
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 min-h-[40px]"
          >
            <option value={1} className="bg-slate-800">Hoy</option>
            <option value={7} className="bg-slate-800">7 días</option>
            <option value={30} className="bg-slate-800">30 días</option>
            <option value={90} className="bg-slate-800">90 días</option>
          </select>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: MousePointerClick, label: "Clics totales", value: stats.total, color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: TrendingUp, label: "Con afiliación", value: stats.withAffiliate, color: "text-green-400", bg: "bg-green-500/10" },
                { icon: DollarSign, label: "Comisión est.", value: `${stats.totalCommission.toFixed(2)} €`, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                { icon: BarChart3, label: "Comisión media", value: `${stats.avgCommissionPct.toFixed(1)}%`, color: "text-purple-400", bg: "bg-purple-500/10" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={`${bg} border border-white/10 rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-slate-400 text-xs">{label}</span>
                  </div>
                  <p className="text-white font-bold text-xl sm:text-2xl">{value}</p>
                </div>
              ))}
            </div>

            {/* Por día */}
            {stats.perDay.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Evolución diaria
                </h2>
                <div className="flex items-end gap-1 h-32">
                  {stats.perDay.map((d) => {
                    const max = Math.max(...stats.perDay.map((x) => x.clicks), 1);
                    const h = (d.clicks / max) * 100;
                    return (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <span className="text-slate-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {d.clicks}
                        </span>
                        <div
                          className="w-full bg-blue-500/40 hover:bg-blue-500/60 rounded-t transition-all min-h-[4px]"
                          style={{ height: `${Math.max(h, 4)}%` }}
                        />
                        <span className="text-slate-500 text-[9px] mt-1">
                          {new Date(d.day).toLocaleDateString("es", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top stores + top products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Store className="w-4 h-4 text-orange-400" />
                  Top tiendas
                </h2>
                {stats.topStores.length === 0 ? (
                  <p className="text-slate-500 text-sm">Sin datos aún</p>
                ) : (
                  <div className="space-y-2">
                    {stats.topStores.map((s, i) => (
                      <div key={s.name} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-xs font-bold w-5 h-5 rounded flex items-center justify-center shrink-0 ${i < 3 ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-700 text-slate-400"}`}>
                            {i + 1}
                          </span>
                          <span className="text-slate-200 text-sm truncate capitalize">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-400 text-xs">{s.clicks} clics</span>
                          {s.commission > 0 && (
                            <span className="text-green-400 text-xs font-medium">{s.commission.toFixed(2)} €</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  Top productos
                </h2>
                {stats.topProducts.length === 0 ? (
                  <p className="text-slate-500 text-sm">Sin datos aún</p>
                ) : (
                  <div className="space-y-2">
                    {stats.topProducts.map((p, i) => (
                      <div key={p.name} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-xs font-bold w-5 h-5 rounded flex items-center justify-center shrink-0 ${i < 3 ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-700 text-slate-400"}`}>
                            {i + 1}
                          </span>
                          <span className="text-slate-200 text-sm truncate">{p.name}</span>
                        </div>
                        <span className="text-slate-400 text-xs shrink-0">{p.clicks} clics</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de últimos clics */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 overflow-x-auto">
              <h2 className="text-white font-semibold mb-4">Últimos clics</h2>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 text-xs border-b border-white/10">
                    <th className="pb-2 pr-3 font-medium">Producto</th>
                    <th className="pb-2 pr-3 font-medium">Tienda</th>
                    <th className="pb-2 pr-3 font-medium">País</th>
                    <th className="pb-2 pr-3 font-medium">Comisión</th>
                    <th className="pb-2 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.slice(0, 50).map((c) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-3 text-slate-200 truncate max-w-[180px]">{c.product_name}</td>
                      <td className="py-2 pr-3 text-slate-400 capitalize">{c.store_name}</td>
                      <td className="py-2 pr-3 text-slate-500">{c.country_code}</td>
                      <td className="py-2 pr-3">
                        {c.estimated_commission_pct > 0 ? (
                          <span className="text-green-400">{c.estimated_commission_pct}%</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2 text-slate-500 text-xs">
                        {c.created_date ? new Date(c.created_date).toLocaleString("es", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}