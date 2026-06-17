import { useState } from "react";

/**
 * Hook: convierte un clic en tienda en un clic de afiliado.
 * Llama a redirectAffiliate para registrar el clic y obtener la URL de redirección.
 */
export function useAffiliateLink() {
  const [pendingStore, setPendingStore] = useState(null);

  const openAffiliateLink = async ({
    storeUrl,
    storeName,
    productName,
    searchQuery = "",
    countryCode = "ES",
    currency = "EUR",
    estimatedPrice = 0
  }) => {
    setPendingStore(storeName);

    try {
      const { base44 } = await import("@/api/base44Client");
      const res = await base44.functions.invoke("redirectAffiliate", {
        store_url: storeUrl,
        store_name: storeName,
        product_name: productName,
        search_query: searchQuery,
        country_code: countryCode,
        currency,
        estimated_price: estimatedPrice
      });

      const redirectUrl = res?.data?.redirect_url || storeUrl;
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
      return true;
    } catch {
      // Fallback: abrir URL original si falla el tracking
      window.open(storeUrl, "_blank", "noopener,noreferrer");
      return false;
    } finally {
      setPendingStore(null);
    }
  };

  return { openAffiliateLink, pendingStore };
}