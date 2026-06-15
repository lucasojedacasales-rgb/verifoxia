import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle, User, Bell, Globe, Languages, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage, LANGUAGES } from "@/hooks/useLanguage";
import { base44 as b44 } from "@/api/base44Client";

const COUNTRIES = [
  { code: "ES", name: "España", flag: "🇪🇸", currency: "EUR", symbol: "€" },
  { code: "MX", name: "México", flag: "🇲🇽", currency: "MXN", symbol: "$" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", currency: "ARS", symbol: "$" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", currency: "COP", symbol: "$" },
  { code: "CL", name: "Chile", flag: "🇨🇱", currency: "CLP", symbol: "$" },
  { code: "PE", name: "Perú", flag: "🇵🇪", currency: "PEN", symbol: "S/" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "GB", name: "Reino Unido", flag: "🇬🇧", currency: "GBP", symbol: "£" },
  { code: "DE", name: "Alemania", flag: "🇩🇪", currency: "EUR", symbol: "€" },
  { code: "FR", name: "Francia", flag: "🇫🇷", currency: "EUR", symbol: "€" },
  { code: "IT", name: "Italia", flag: "🇮🇹", currency: "EUR", symbol: "€" },
  { code: "BR", name: "Brasil", flag: "🇧🇷", currency: "BRL", symbol: "R$" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { selectedCountry, changeCountry } = useCountry();
  const { lang, changeLanguage } = useLanguage();

  // Account deletion state
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Personal info state
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // Price alerts
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setDisplayName(u?.full_name || "");
    }).catch(() => {});
    base44.entities.PriceAlert.filter({ status: "active" }).then((a) => {
      setAlerts(a);
    }).catch(() => {}).finally(() => setLoadingAlerts(false));
  }, []);

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setSavingName(true);
    try {
      await base44.auth.updateMe({ full_name: displayName.trim() });
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelAlert = async (alertId) => {
    await base44.entities.PriceAlert.update(alertId, { status: "cancelled" });
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleDeleteAccount = async () => {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    setError(null);
    try {
      await base44.functions.invoke("deleteUserAccount", {});
      await base44.auth.logout();
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al eliminar la cuenta. Por favor, intenta de nuevo.");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-lg mx-auto px-4 py-10 pb-28 space-y-5">

        {/* Personal Information */}
        <section className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 space-y-4" aria-labelledby="personal-heading">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <h2 id="personal-heading" className="text-white font-semibold text-base">Información personal</h2>
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">Email</label>
            <p className="text-slate-300 text-sm bg-white/5 rounded-lg px-3 py-2.5">{user?.email || "—"}</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="display-name" className="text-slate-400 text-xs font-medium uppercase tracking-wide">Nombre</label>
            <div className="flex gap-2">
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                placeholder="Tu nombre"
              />
              <button
                onClick={handleSaveName}
                disabled={savingName}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center gap-1.5"
              >
                {nameSaved ? <><Check className="w-4 h-4" /> Guardado</> : savingName ? "..." : "Guardar"}
              </button>
            </div>
          </div>
        </section>

        {/* Price Alerts */}
        <section className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 space-y-4" aria-labelledby="alerts-heading">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-400" />
            <h2 id="alerts-heading" className="text-white font-semibold text-base">Alertas de precio</h2>
          </div>
          {loadingAlerts ? (
            <p className="text-slate-400 text-sm">Cargando alertas...</p>
          ) : alerts.length === 0 ? (
            <p className="text-slate-400 text-sm">No tienes alertas de precio activas.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((alert) => (
                <li key={alert.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{alert.product_name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Objetivo: {alert.currency} {alert.target_price?.toFixed(2)} · {alert.best_store}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelAlert(alert.id)}
                    className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 rounded-lg px-2.5 py-1.5 transition-colors min-h-[36px]"
                  >
                    Cancelar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Regional & Language Preferences */}
        <section className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 space-y-4" aria-labelledby="regional-heading">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-400" />
            <h2 id="regional-heading" className="text-white font-semibold text-base">Región e idioma</h2>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1.5"><Globe className="w-3 h-3" /> País / Moneda</label>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => changeCountry(c)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all min-h-[44px] text-left ${
                    selectedCountry.code === c.code
                      ? "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                      : "bg-white/5 border border-transparent text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-xs text-slate-500">{c.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1.5"><Languages className="w-3 h-3" /> Idioma</label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLanguage(l)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all min-h-[44px] text-left ${
                    lang.code === l.code
                      ? "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                      : "bg-white/5 border border-transparent text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="truncate">{l.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Account Deletion */}
        <section className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 space-y-4" aria-labelledby="account-heading">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            <h2 id="account-heading" className="text-white font-semibold text-base">Cuenta</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Al eliminar tu cuenta se borrarán permanentemente todos tus datos, historial de búsquedas y alertas de precio.
          </p>
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4" role="alert">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          {confirm && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4" role="alert">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">¿Estás seguro? Esta acción es irreversible. Pulsa de nuevo para confirmar.</p>
            </div>
          )}
          <Button
            variant="destructive"
            className="w-full gap-2 min-h-[44px]"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Eliminando..." : confirm ? "Confirmar eliminación" : "Eliminar mi cuenta"}
          </Button>
          {confirm && (
            <button
              onClick={() => setConfirm(false)}
              className="w-full text-slate-500 text-sm hover:text-slate-300 transition-colors py-2 px-4 rounded min-h-[44px]"
            >
              Cancelar
            </button>
          )}
        </section>

        {/* App info */}
        <section className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 space-y-2" aria-labelledby="info-heading">
          <h2 id="info-heading" className="text-white font-semibold text-base">Información</h2>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Versión</span>
            <span className="text-slate-300">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">App</span>
            <span className="text-slate-300">Trustify</span>
          </div>
        </section>

      </main>
    </div>
  );
}