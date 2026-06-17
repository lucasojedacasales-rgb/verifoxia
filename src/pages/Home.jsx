import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Shield, Star, Zap, SplitSquareHorizontal, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import SearchHistory from "@/components/SearchHistory";
import ImageSearchButton from "@/components/ImageSearchButton";
import AdBanner from "@/components/AdBanner";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/hooks/useLanguage";
// hooks used for selectedCountry (search URL) and translations
import { base44 } from "@/api/base44Client";
import useSEO from "@/hooks/useSEO";

export default function Home() {
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();
  const { t } = useLanguage();

  useSEO({
    title: "Comparador de precios con IA — Encuentra la mejor oferta",
    description: "VERIFOX compara precios de miles de tiendas en tiempo real. Usa IA para detectar fraudes, predecir tendencias y crear alertas de precio gratis. ¡Ahorra dinero hoy!",
    canonical: "https://verifox.app/",
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleSearch = (e, directQuery) => {
    if (e?.preventDefault) e.preventDefault();
    const q = (directQuery || query).trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}&country=${selectedCountry.code}`);
  };

  const featureIcons = [TrendingUp, Star, Shield, Zap];
  const features = t.features.map((f, i) => ({ ...f, icon: featureIcons[i] }));

  const popular = ["iPhone 15", "Samsung 4K TV", "Nike Air Max", "AirPods Pro", "Kindle", "PS5"];

  const stats = [
    { value: "50K+", label: "Productos analizados" },
    { value: "200+", label: "Tiendas comparadas" },
    { value: "98%", label: "Precisión de IA" },
    { value: "Gratis", label: "Siempre" },
  ];

  const featureColors = [
    { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/20" },
    { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/20" },
    { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/20" },
    { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/20" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 pt-10 sm:pt-16 pb-12 text-center overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6 relative">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">{t.intro_badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-4 leading-tight uppercase tracking-tight relative">
          <span className="text-white">VERI</span><span className="text-orange-500">FOX</span><br />
          <span className="text-blue-400 normal-case font-bold text-2xl sm:text-4xl md:text-5xl">{t.hero_title_2}</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-xl mb-8 relative">
          {t.hero_sub}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl space-y-2 sm:space-y-0 sm:flex sm:gap-3 relative" role="search">
          <div className="relative flex-1 flex gap-2 sm:gap-0">
            <SearchAutocomplete
              value={query}
              onChange={setQuery}
              onSearch={(q) => handleSearch(null, q)}
              placeholder={t.search_placeholder}
            />
            <ImageSearchButton />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base min-h-[44px] shadow-lg shadow-blue-500/25 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {t.search_btn}
          </Button>
        </form>

        {/* Compare CTA */}
        <button
          onClick={() => navigate("/compare")}
          className="mt-4 flex items-center gap-2 text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-full px-5 py-2 transition-all text-sm font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label={t.compare_btn}>
          <SplitSquareHorizontal className="w-4 h-4" aria-hidden="true" />
          {t.compare_btn}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Popular searches */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center items-center">
          <span className="text-slate-500 text-xs uppercase tracking-wide font-medium">{t.popular}</span>
          {popular.map((p) =>
            <button
              key={p}
              onClick={() => navigate(`/search?q=${encodeURIComponent(p)}&country=${selectedCountry.code}`)}
              className="text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full px-3 py-1.5 transition-all min-h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Buscar ${p}`}>
              {p}
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl relative">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl py-3 px-2">
              <span className="text-white font-black text-xl">{value}</span>
              <span className="text-slate-500 text-xs mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h2 className="text-center text-white font-bold text-xl sm:text-2xl mb-6 tracking-tight">
          ¿Por qué elegir <span className="text-white">VERI</span><span className="text-orange-500">FOX</span>?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => {
            const c = featureColors[i] || featureColors[0];
            return (
              <div key={title} className={`bg-white/5 border ${c.border} rounded-2xl p-5 hover:bg-white/8 transition-all group`}>
                <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <h3 className="text-white font-semibold mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-6 py-4 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl px-5 py-4 flex flex-wrap gap-3 justify-center items-center">
          {["Análisis 100% gratuito", "Sin registro obligatorio", "Datos en tiempo real", "IA verificada"].map(item => (
            <div key={item} className="flex items-center gap-1.5 text-sm text-slate-300">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Anuncio AdSense */}
      <section className="px-6 py-8 max-w-5xl mx-auto">
        <AdBanner slot="3742564892" format="auto" className="rounded-lg sm:rounded-xl overflow-hidden" />
      </section>

      {/* Search History */}
      <section className="px-6 pb-24 max-w-5xl mx-auto md:pb-16">
        <SearchHistory key={refreshKey} />
      </section>

      {/* Footer with links to About and Contact */}
      <footer className="bg-slate-900/50 border-t border-white/10 px-6 py-6 text-center">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 mb-4">
          <a
            href="/about"
            className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium min-h-[44px] flex items-center">
            
            Acerca de
          </a>
          <a
            href="/contact"
            className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium min-h-[44px] flex items-center">
            
            Contacto
          </a>
          <a
            href="/privacy"
            className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium min-h-[44px] flex items-center">
            Privacidad
          </a>
        </div>
        <p className="text-slate-500 text-xs">
          © 2026 VERIFOX. Todos los derechos reservados.
        </p>
      </footer>
    </div>);

}