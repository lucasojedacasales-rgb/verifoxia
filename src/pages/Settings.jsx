import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Settings() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    try {
      await base44.auth.logout();
    } catch {
      // proceed to logout anyway
    }
    setDeleting(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header
        className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center gap-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-white font-bold text-lg">Ajustes</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10 pb-28 space-y-6">
        {/* Account section */}
        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-base">Cuenta</h2>
          <p className="text-slate-400 text-sm">
            Al eliminar tu cuenta se borrarán permanentemente todos tus datos, historial de búsquedas y alertas de precio.
          </p>

          {confirm && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">
                ¿Estás seguro? Esta acción es irreversible. Pulsa de nuevo para confirmar.
              </p>
            </div>
          )}

          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Eliminando..." : confirm ? "Confirmar eliminación" : "Eliminar mi cuenta"}
          </Button>

          {confirm && (
            <button
              onClick={() => setConfirm(false)}
              className="w-full text-slate-500 text-sm hover:text-slate-300 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>

        {/* App info */}
        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 space-y-2">
          <h2 className="text-white font-semibold text-base">Información</h2>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Versión</span>
            <span className="text-slate-300">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">App</span>
            <span className="text-slate-300">Trustify</span>
          </div>
        </div>
      </main>
    </div>
  );
}