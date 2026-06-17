import { useState, useEffect } from "react";
import { Bell, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";

export default function PriceAlertsList() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.PriceAlert
      .filter({ status: "active" }, "-created_date", 5)
      .then(setAlerts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (alert) => {
    setDeleting(alert.id);
    await base44.entities.PriceAlert.update(alert.id, { status: "cancelled" });
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!alerts.length) {
    return (
      <section className="px-6 py-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-blue-400" />
          <h2 className="text-white font-bold text-lg">Tus alertas de precio</h2>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-6 text-center">
          <p className="text-slate-400 text-sm mb-3">No tienes alertas activas. Crea una al buscar un producto y pulsar el icono de campana.</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium underline underline-offset-4"
          >
            Buscar productos
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-4 h-4 text-blue-400" />
        <h2 className="text-white font-bold text-lg">Tus alertas de precio</h2>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{alert.product_name}</p>
              <p className="text-slate-400 text-xs truncate">
                Actual: {alert.current_price?.toLocaleString()} {alert.currency} → Objetivo: {alert.target_price?.toLocaleString()} {alert.currency}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate(`/search?q=${encodeURIComponent(alert.search_query)}`)}
                className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label={`Buscar ${alert.product_name}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCancel(alert)}
                disabled={deleting === alert.id}
                className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label={`Cancelar alerta para ${alert.product_name}`}
              >
                {deleting === alert.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}