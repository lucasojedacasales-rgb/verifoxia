import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, Search, MousePointerClick, Eye, ArrowUp, ArrowDown, Minus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PERIODS = [
  { label: "Últimos 7 días", days: 7 },
  { label: "Últimos 28 días", days: 28 },
  { label: "Últimos 90 días", days: 90 },
];

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function MetricCard({ label, value, icon: IconComp, color }) {
  const Icon = IconComp;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-white font-bold text-lg">{value}</p>
      </div>
    </div>
  );
}

function TrendIcon({ position }) {
  if (position === undefined || position === null) return <Minus className="w-3 h-3 text-slate-500" />;
  if (position <= 3) return <ArrowUp className="w-3 h-3 text-green-400" />;
  if (position <= 10) return <Minus className="w-3 h-3 text-yellow-400" />;
  return <ArrowDown className="w-3 h-3 text-red-400" />;
}

export default function SearchConsole() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [periodDays, setPeriodDays] = useState(28);
  const [sortBy, setSortBy] = useState("clicks");

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("searchConsoleQueries", {
        siteUrl: "https://placeholder.com", // dummy to get sites list
        startDate: getDateDaysAgo(7),
        endDate: getDateDaysAgo(1),
      });
      const siteList = res.data?.sites || [];
      setSites(siteList);
      if (siteList.length > 0) {
        setSelectedSite(siteList[0].siteUrl);
      }
    } catch (e) {
      setError("No se pudieron cargar los sitios. Verifica que Search Console está conectado.");
    }
    setLoading(false);
  };

  const loadQueries = async (site, days) => {
    if (!site) return;
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("searchConsoleQueries", {
        siteUrl: site,
        startDate: getDateDaysAgo(days),
        endDate: getDateDaysAgo(1),
        rowLimit: 50,
      });
      setRows(res.data?.rows || []);
    } catch (e) {
      setError("Error al cargar las consultas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSite) loadQueries(selectedSite, periodDays);
  }, [selectedSite, periodDays]);

  const sorted = [...rows].sort((a, b) => {
    if (sortBy === "clicks") return b.clicks - a.clicks;
    if (sortBy === "impressions") return b.impressions - a.impressions;
    if (sortBy === "ctr") return b.ctr - a.ctr;
    if (sortBy === "position") return a.position - b.position;
    return 0;
  });

  const totals = rows.reduce(
    (acc, r) => ({
      clicks: acc.clicks + r.clicks,
      impressions: acc.impressions + r.impressions,
    }),
    { clicks: 0, impressions: 0 }
  );
  const avgCtr = rows.length ? (rows.reduce((a, r) => a + r.ctr, 0) / rows.length) * 100 : 0;
  const avgPos = rows.length ? rows.reduce((a, r) => a + r.position, 0) / rows.length : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Search Console</h1>
              <p className="text-slate-400 text-xs">Consultas con mejor rendimiento</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {sites.length > 0 && (
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-9 text-sm min-w-[180px]">
                  <SelectValue placeholder="Seleccionar sitio" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((s) => (
                    <SelectItem key={s.siteUrl} value={s.siteUrl}>
                      {s.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={String(periodDays)} onValueChange={(v) => setPeriodDays(Number(v))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white h-9 text-sm w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p.days} value={String(p.days)}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-white"
              onClick={() => loadQueries(selectedSite, periodDays)}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Metric cards */}
        {rows.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Clics totales" value={totals.clicks.toLocaleString()} icon={MousePointerClick} color="bg-blue-500/20 text-blue-400" />
            <MetricCard label="Impresiones" value={totals.impressions.toLocaleString()} icon={Eye} color="bg-purple-500/20 text-purple-400" />
            <MetricCard label="CTR medio" value={`${avgCtr.toFixed(1)}%`} icon={TrendingUp} color="bg-green-500/20 text-green-400" />
            <MetricCard label="Posición media" value={avgPos.toFixed(1)} icon={Search} color="bg-yellow-500/20 text-yellow-400" />
          </div>
        )}

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {/* Sort controls */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
            <p className="text-white font-medium text-sm">
              {rows.length > 0 ? `${rows.length} consultas` : "Consultas de búsqueda"}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span>Ordenar por:</span>
              {["clicks", "impressions", "ctr", "position"].map((k) => (
                <button
                  key={k}
                  onClick={() => setSortBy(k)}
                  className={`px-2 py-1 rounded transition-colors ${sortBy === k ? "bg-blue-500/20 text-blue-300" : "hover:text-white"}`}
                >
                  {k === "clicks" ? "Clics" : k === "impressions" ? "Imp." : k === "ctr" ? "CTR" : "Posición"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              {sites.length === 0 ? "No se encontraron sitios en Search Console." : "No hay datos para el período seleccionado."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs border-b border-white/10">
                    <th className="text-left px-4 py-2">#</th>
                    <th className="text-left px-4 py-2">Consulta</th>
                    <th className="text-right px-4 py-2">Clics</th>
                    <th className="text-right px-4 py-2">Impresiones</th>
                    <th className="text-right px-4 py-2">CTR</th>
                    <th className="text-right px-4 py-2">Posición</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TrendIcon position={row.position} />
                          <span className="text-white font-medium truncate max-w-[220px]">{row.keys?.[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-blue-300 font-medium">{row.clicks.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-purple-300">{row.impressions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-green-300">{(row.ctr * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${row.position <= 3 ? "text-green-400" : row.position <= 10 ? "text-yellow-400" : "text-slate-400"}`}>
                          {row.position.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}