/**
 * Hook simplificado: abre la URL de la tienda directamente.
 * El tracking de afiliados AWIN está desactivado temporalmente.
 */
export function useAffiliateLink() {
  const openAffiliateLink = ({ storeUrl }) => {
    if (storeUrl && storeUrl !== "#") {
      window.open(storeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return { openAffiliateLink, pendingStore: null };
}