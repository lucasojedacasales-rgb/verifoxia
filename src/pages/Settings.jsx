import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Settings() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteAccount = async () => {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    setError(null);
    try {
      // Call backend function to delete all user data
      await base44.functions.invoke('deleteUserAccount', {});
      // Logout and redirect
      await base44.auth.logout();
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(err.message || "Error al eliminar la cuenta. Por favor, intenta de nuevo.");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-lg mx-auto px-4 py-10 pb-28 space-y-6">
        {/* Account section */}
        <section
          className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 space-y-4"
          role="region"
          aria-labelledby="account-heading"
        >
          <h2 id="account-heading" className="text-white font-semibold text-base">
            Cuenta
          </h2>
          <p className="text-slate-400 text-sm">
            Al eliminar tu cuenta se borrarán permanentemente todos tus datos, historial de búsquedas y alertas de precio.
          </p>

          {error && (
            <div
              className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4"
              role="alert"
              aria-live="polite"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {confirm && (
            <div
              className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4"
              role="alert"
              aria-live="assertive"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-red-300 text-sm">
                ¿Estás seguro? Esta acción es irreversible. Pulsa de nuevo para confirmar.
              </p>
            </div>
          )}

          <Button
            variant="destructive"
            className="w-full gap-2 min-h-[44px] focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleDeleteAccount}
            disabled={deleting}
            aria-label={confirm ? "Confirmar eliminación de cuenta" : "Eliminar mi cuenta"}
            aria-busy={deleting}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            {deleting ? "Eliminando..." : confirm ? "Confirmar eliminación" : "Eliminar mi cuenta"}
          </Button>

          {confirm && (
            <button
              onClick={() => setConfirm(false)}
              className="w-full text-slate-500 text-sm hover:text-slate-300 transition-colors py-2 px-4 rounded min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:text-slate-200"
              aria-label="Cancelar eliminación de cuenta"
            >
              Cancelar
            </button>
          )}
        </section>

        {/* App info */}
        <section
          className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 space-y-2"
          role="region"
          aria-labelledby="info-heading"
        >
          <h2 id="info-heading" className="text-white font-semibold text-base">
            Información
          </h2>
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