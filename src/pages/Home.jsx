import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Shield, Star, Zap, SplitSquareHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchHistory from "@/components/SearchHistory";
import ImageSearchButton from "@/components/ImageSearchButton";
import AdBanner from "@/components/AdBanner";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/hooks/useLanguage";
// hooks used for selectedCountry (search URL) and translations
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import { base44 } from "@/api/base44Client";

export default function Home() {
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();
  const { t } = useLanguage();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const onRefresh = useCallback(() => new Promise((res) => {
    setRefreshKey((k) => k + 1);
    // End WebView native pull-to-refresh if available
    if (window.__TRUSTIFY_NATIVE__ && window.__TRUSTIFY_NATIVE__.endRefresh) {
      window.__TRUSTIFY_NATIVE__.endRefresh();
    }
    setTimeout(res, 600);
  }), []);
  const { scrollProps, indicatorRef } = usePullToRefresh(onRefresh);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}&country=${selectedCountry.code}`);
  };

  const featureIcons = [TrendingUp, Star, Shield, Zap];
  const features = t.features.map((f, i) => ({ ...f, icon: featureIcons[i] }));

  const popular = ["iPhone 15", "Samsung 4K TV", "Nike Air Max", "AirPods Pro", "Kindle", "PS5"];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-y-auto relative"
      style={{ overscrollBehaviorY: "none" }}
      {...scrollProps}>
      
      <PullToRefreshIndicator ref={indicatorRef} />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        {user?.full_name &&
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4 animate-fade-in hidden">
            
          </div>
        }

        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">{t.intro_badge}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight uppercase tracking-tight">
          <span className="text-white">VERI</span><span className="text-orange-500">FOX</span><br />
          <span className="text-blue-400 normal-case font-bold text-3xl md:text-5xl">{t.hero_title_2}</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10">
          {t.hero_sub}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-3" role="search">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search_placeholder}
              className="pl-12 h-14 text-base bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500"
              aria-label="Buscar producto" />
            
          </div>
          <ImageSearchButton />
          <Button
            type="submit"
            className="h-14 px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base min-h-[44px] focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            
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
        </button>

        {/* Popular searches */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          <span className="text-slate-500 text-sm" aria-label="Búsquedas populares">{t.popular}</span>
          {popular.map((p) =>
          <button
            key={p}
            onClick={() => navigate(`/search?q=${encodeURIComponent(p)}&country=${selectedCountry.code}`)}
            className="text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full px-3 py-1.5 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Buscar ${p}`}>
            
              {p}
            </button>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) =>
          <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          )}
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
        </div>
        <p className="text-slate-500 text-xs">
          © 2026 VERIFOX. Todos los derechos reservados.
        </p>
      </footer>
    </div>);

}