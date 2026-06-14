import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Shield, Star, Zap, SplitSquareHorizontal, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchHistory from "@/components/SearchHistory";
import CountrySelector from "@/components/CountrySelector";
import ImageSearchButton from "@/components/ImageSearchButton";
import { useCountry } from "@/hooks/useCountry";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { selectedCountry, changeCountry, countries } = useCountry();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}&country=${selectedCountry.code}`);
  };

  const features = [
    { icon: TrendingUp, title: "Compara precios", desc: "Encuentra el mejor precio entre múltiples tiendas online" },
    { icon: Star, title: "Analiza reseñas", desc: "Evaluamos miles de opiniones para darte un resumen honesto" },
    { icon: Shield, title: "Verifica fiabilidad", desc: "Comprobamos la reputación del vendedor y la calidad del producto" },
    { icon: Zap, title: "Predictor de precio IA", desc: "Predice si el precio subirá o bajará y cuándo es mejor comprar" },
  ];

  const popular = ["iPhone 15", "Samsung 4K TV", "Nike Air Max", "AirPods Pro", "Kindle", "PS5"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Trustify</span>
        </div>
        <CountrySelector
          selectedCountry={selectedCountry}
          countries={countries}
          onChange={changeCountry}
        />
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Comparación inteligente con IA</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          ¿Vale la pena <br />
          <span className="text-blue-400">comprarlo?</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10">
          Compara precios, reseñas y fiabilidad de cualquier producto. Nuestra IA te dice si conviene comprarlo ahora.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca un producto... ej: iPhone 15 Pro"
              className="pl-12 h-14 text-base bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
            />
          </div>
          <ImageSearchButton />
          <Button
            type="submit"
            className="h-14 px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base"
          >
            Analizar
          </Button>
        </form>

        {/* Compare CTA */}
        <button
          onClick={() => navigate("/compare")}
          className="mt-4 flex items-center gap-2 text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-full px-5 py-2 transition-all text-sm font-medium"
        >
          <SplitSquareHorizontal className="w-4 h-4" />
          Comparar dos productos cara a cara
        </button>

        {/* Popular searches */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          <span className="text-slate-500 text-sm">Populares:</span>
          {popular.map((p) => (
            <button
              key={p}
              onClick={() => navigate(`/search?q=${encodeURIComponent(p)}&country=${selectedCountry.code}`)}
              className="text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full px-3 py-1 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search History */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <SearchHistory />
      </section>
    </div>
  );
}