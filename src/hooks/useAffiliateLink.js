import { trackStoreClick } from "@/lib/analytics";

const affiliatePrograms = [
  {
    matches: ["amazon."],
    buildUrl: (url) => {
      const tag = localStorage.getItem("verifoxia_amazon_affiliate_tag");
      if (!tag) return url;
      const affiliateUrl = new URL(url);
      affiliateUrl.searchParams.set("tag", tag);
      return affiliateUrl.toString();
    },
  },
];

const getAffiliateUrl = (storeUrl) => {
  try {
    const url = new URL(storeUrl);
    const program = affiliatePrograms.find(({ matches }) =>
      matches.some((match) => url.hostname.toLowerCase().includes(match))
    );
    return program ? program.buildUrl(storeUrl) : storeUrl;
  } catch {
    return storeUrl;
  }
};

export function useAffiliateLink() {
  const openAffiliateLink = ({
    storeUrl,
    storeName,
    productName,
    searchQuery,
    countryCode,
    estimatedPrice,
    currency,
  }) => {
    if (storeUrl && storeUrl !== "#") {
      trackStoreClick({
        storeName,
        productName: productName || searchQuery,
        countryCode,
        estimatedPrice,
        currency,
      });
      window.open(getAffiliateUrl(storeUrl), "_blank", "noopener,noreferrer");
    }
  };

  return { openAffiliateLink, pendingStore: null };
}
