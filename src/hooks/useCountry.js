import { useState } from "react";

const COUNTRIES = [
  { code: "ES", name: "España", flag: "🇪🇸", currency: "EUR", symbol: "€" },
  { code: "MX", name: "México", flag: "🇲🇽", currency: "MXN", symbol: "$" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", currency: "ARS", symbol: "$" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", currency: "COP", symbol: "$" },
  { code: "CL", name: "Chile", flag: "🇨🇱", currency: "CLP", symbol: "$" },
  { code: "PE", name: "Perú", flag: "🇵🇪", currency: "PEN", symbol: "S/" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "GB", name: "Reino Unido", flag: "🇬🇧", currency: "GBP", symbol: "£" },
  { code: "DE", name: "Alemania", flag: "🇩🇪", currency: "EUR", symbol: "€" },
  { code: "FR", name: "Francia", flag: "🇫🇷", currency: "EUR", symbol: "€" },
  { code: "IT", name: "Italia", flag: "🇮🇹", currency: "EUR", symbol: "€" },
  { code: "BR", name: "Brasil", flag: "🇧🇷", currency: "BRL", symbol: "R$" },
];

export function useCountry() {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem("pricewise_country");
    return saved ? JSON.parse(saved) : COUNTRIES[0];
  });

  const changeCountry = (country) => {
    setSelectedCountry(country);
    localStorage.setItem("pricewise_country", JSON.stringify(country));
  };

  return { selectedCountry, changeCountry, countries: COUNTRIES };
}