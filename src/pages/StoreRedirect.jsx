import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Shield, AlertTriangle } from "lucide-react";

export default function StoreRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const storeUrl = urlParams.get("url") || "";
  const storeName = urlParams.get("store") || "Tienda";
  const productName = urlParams.get("product") || "";
  const navigate = useNavigate();

  const [iframeError, setIframeError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Some stores block iframes — detect via timeout heuristic
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!storeUrl) {
    navigate(-1);
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950" style={{ paddingTop: "60px" }}>
      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-3 bg-slate-900 border-b border-white/10 px-4 py-2.5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors min-h-[36px] shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm hidden sm:block">Volver</span>
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
          <Shield className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span className="text-slate-400 text-xs truncate">{storeUrl}</span>
        </div>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Abrir en nueva pestaña</span>
        </a>
      </div>

      {/* Product context bar */}
      {productName && (
        <div className="shrink-0 bg-slate-800/80 border-b border-white/5 px-4 py-2 flex items-center gap-2">
          <span className="text-slate-400 text-xs">Buscando:</span>
          <span className="text-white text-xs font-medium truncate">{productName}</span>
          <span className="text-slate-600 text-xs">en</span>
          <span className="text-blue-400 text-xs font-medium">{storeName}</span>
        </div>
      )}

      {/* iframe / fallback */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 gap-3">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Cargando {storeName}...</p>
          </div>
        )}

        {iframeError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 gap-5 px-6 text-center">
            <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg mb-1">Esta tienda no permite vista previa</p>
              <p className="text-slate-400 text-sm">{storeName} bloquea la carga en marcos internos por motivos de seguridad.</p>
            </div>
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[44px]"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir en el navegador
            </a>
            <button
              onClick={() => navigate(-1)}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Volver atrás
            </button>
          </div>
        ) : (
          <iframe
            src={storeUrl}
            title={`${storeName} - ${productName}`}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setIframeError(true); }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>
    </div>
  );
}