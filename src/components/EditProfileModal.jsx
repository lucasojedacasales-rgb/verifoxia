import { useState } from "react";
import { X, User, Mail, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

export default function EditProfileModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("El nombre no puede estar vacío");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await base44.auth.updateMe({ full_name: trimmed });
      setDone(true);
      onSaved?.(trimmed);
      setTimeout(() => onClose(), 1200);
    } catch (_) {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)" }}
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/15 rounded-2xl shadow-2xl w-full max-w-sm max-h-[60vh] sm:max-h-[85vh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Editar perfil"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-white font-semibold text-sm">Editar perfil</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          {done ? (
            <div className="flex flex-col items-center py-4 gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-green-300 text-sm font-medium">Perfil actualizado</p>
            </div>
          ) : (
            <>
              {/* Name */}
              <div>
                <label className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <User className="w-3 h-3" /> Nombre
                </label>
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 h-10"
                  placeholder="Tu nombre"
                  aria-label="Nombre"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3 h-3" /> Correo electrónico
                </label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-white/5 border-white/10 text-slate-500 h-10 cursor-not-allowed"
                />
                <p className="text-slate-600 text-[10px] mt-1">El correo no se puede modificar</p>
              </div>

              {error && (
                <p className="text-red-400 text-xs">{error}</p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="px-4 py-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-400 hover:text-white h-9"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || name.trim() === user?.full_name}
              className="bg-blue-500 hover:bg-blue-600 h-9 min-w-[80px]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}