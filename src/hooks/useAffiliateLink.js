import { trackStoreClick } from "@/lib/analytics";

// Amazon Associate tags by country (public identifiers visible in URLs — not secrets).
// Each Amazon marketplace requires its own tag. Override any via VITE_ env vars.
const AMAZON_TAGS = {
  ES: import.meta.env.VITE_AMAZON_TAG_ES || "lukrator90-21",
  US: import.meta.env.VITE_AMAZON_TAG_US || "",
  GB: import.meta.env.VITE_AMAZON_TAG_GB || "",
  DE: import.meta.env.VITE_AMAZON_TAG_DE || "",
  FR: import.meta.env.VITE_AMAZON_TAG_FR || "",
  IT: import.meta.env.VITE_AMAZON_TAG_IT || "",
};

// Amazon domain → country code mapping
const AMAZON_DOMAINS = {
  "amazon.es": "ES",
  "amazon.com": "US",
  "amazon.co.uk": "GB",
  "amazon.de": "DE",
  "amazon.fr": "FR",
  "amazon.it": "IT",
};

function isAmazonUrl(url) {
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  return Object.prototype.hasOwnProperty.call(AMAZON_DOMAINS, host);
}

function countryFromAmazonDomain(url) {
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  return AMAZON_DOMAINS[host] || null;
}

function resolveAmazonTag(countryCode) {
  return AMAZON_TAGS[countryCode] || AMAZON_TAGS.ES;
}

function buildAmazonAffiliateUrl(storeUrl, userCountryCode) {
  const url = new URL(storeUrl);
  // Prefer the Amazon marketplace's own country (each store needs its own tag),
  // fall back to the user's country, then ES.
  const country = countryFromAmazonDomain(url) || userCountryCode || "ES";
  const tag = resolveAmazonTag(country);
  if (tag) {
    url.searchParams.set("tag", tag); // set() adds or replaces
  }
  return url.toString();
}

const getAffiliateUrl = (storeUrl, countryCode) => {
  try {
    const url = new URL(storeUrl);
    if (isAmazonUrl(url)) {
      return buildAmazonAffiliateUrl(storeUrl, countryCode);
    }
    return storeUrl; // non-Amazon: unchanged
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
      window.open(getAffiliateUrl(storeUrl, countryCode), "_blank", "noopener,noreferrer");
    }
  };

  return { openAffiliateLink, pendingStore: null };
}