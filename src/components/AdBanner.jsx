import { useEffect, useRef } from "react";

/**
 * Componente de anuncio Google AdSense.
 *
 * Props:
 *  - slot: Ad Unit ID (ej: "1234567890") — obligatorio
 *  - format: "auto" | "rectangle" | "leaderboard" | etc. (default: "auto")
 *  - className: clases extra para el contenedor
 */
export default function AdBanner({ slot, format = "auto", className = "" }) {
  const adRef = useRef(null);

  useEffect(() => {
    // Solo intentar cargar si el script de AdSense está disponible
    if (typeof window !== "undefined" && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {}
    }
  }, []);

  if (!slot) return null;

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2658614645953419"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}