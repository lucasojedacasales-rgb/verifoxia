import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "trustify_disclaimer_accepted";

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 md:bottom-6 left-3 right-3 z-50 max-w-2xl mx-auto"
        >
          <div className="bg-slate-800 border border-yellow-500/30 rounded-2xl p-4 shadow-2xl shadow-black/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-1">Aviso legal</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Los precios, disponibilidad y recomendaciones mostrados en Trustify son orientativos y se obtienen de fuentes externas (Google Shopping, IA). 
                  Trustify no vende productos ni garantiza la exactitud de los datos. 
                  Verifica siempre el precio final en la tienda antes de comprar.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={handleAccept}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors min-h-[36px]"
                  >
                    Entendido
                  </button>
                  <a
                    href="/about"
                    className="text-blue-400 hover:text-blue-300 text-xs underline transition-colors"
                  >
                    Más info
                  </a>
                </div>
              </div>
              <button
                onClick={handleAccept}
                className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Cerrar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}