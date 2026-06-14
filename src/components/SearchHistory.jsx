import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Clock, CheckCircle2, Clock3, XCircle, ChevronRight } from "lucide-react";

const verdictConfig = {
  comprar: { icon: CheckCircle2, color: "text-green-400", label: "Comprar" },
  esperar: { icon: Clock3, color: "text-yellow-400", label: "Esperar" },
  no_comprar: { icon: XCircle, color: "text-red-400", label: "No comprar" },
};

export default function SearchHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.SearchHistory.list("-created_date", 8).then(setHistory);
  }, []);

  if (!history.length) return null;

  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Búsquedas recientes
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {history.map((item) => {
          const config = item.verdict ? verdictConfig[item.verdict] : null;
          const Icon = config?.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-left transition-all group"
            >
              <div className="flex items-center gap-2 min-w-0">
                {Icon && <Icon className={`w-4 h-4 ${config.color} shrink-0`} />}
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