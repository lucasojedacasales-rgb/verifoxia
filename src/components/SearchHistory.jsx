import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Clock, CheckCircle2, Clock3, XCircle, ChevronRight } from "lucide-react";

const verdictConfig = {
  comprar: { icon: CheckCircle2, color: "text-green-400", label: "Comprar" },
  esperar: { icon: Clock3, color: "text-yellow-400", label: "Esperar" },
  no_comprar: { icon: XCircle, color: "text-red-400", label: "No comprar" },
};

export default function SearchHistory({ pendingEntry }) {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const load = useCallback(() => {
    base44.entities.SearchHistory.list("-created_date", 8).then(setHistory);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Optimistic: prepend a pending entry from the parent (SearchResults)
  const displayed = pendingEntry
    ? [pendingEntry, ...history.filter((h) => h.query !== pendingEntry.query)]
    : history;

  if (!displayed.length) return null;

  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Búsquedas recientes
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayed.map((item) => {
          const config = item.verdict ? verdictConfig[item.verdict] : null;
          const Icon = config?.icon;
          const isPending = item._pending;
          return (
            <button
              key={item.id || item.query}
              onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
              className={`flex items-center justify-between bg-white/5 hover:bg-white/10 border rounded-xl px-4 py-3 min-h-[44px] text-left transition-all group ${
                isPending ? "border-blue-500/30 opacity-70" : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {Icon && <Icon className={`w-4 h-4 ${config.color} shrink-0`} />}
                {isPending && !Icon && (
                  <div className="w-4 h-4 border-2 border-blue-400/40 border-t-blue-400 rounded-full animate-spin shrink-0" />
                )}
                <span className="text-slate-300 text-sm truncate">{item.query}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 ml-2 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}