import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useCountry } from "@/hooks/useCountry";

// Static trending fallback (always shown, enriched with real data if available)
const staticTrending = [
  { query: "iPhone 16", emoji: "📱" },
  { query: "PS5 Pro", emoji: "🎮" },
  { query: "AirPods Pro 2", emoji: "🎧" },
  { query: "Samsung Galaxy S25", emoji: "📱" },
  { query: "MacBook Air M3", emoji: "💻" },
  { query: "Nike Air Max 2025", emoji: "👟" },
];

export default function TrendingSearches() {
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();
  const [trending, setTrending] = useState(staticTrending);

  useEffect(() => {
    // Try to enrich with real search history data
    base44.entities.SearchHistory.list("-created_date", 50)
      .then((history) => {
        if (!history?.length) return;
        // Count query frequency
        const freq = {};
        history.forEach(({ query }) => {
          if (!query) return;
          const key = query.trim().toLowerCase();
          freq[key] = (freq[key] || 0) + 1;
        });
        const top = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([query]) => ({
            query: query.charAt(0).toUpperCase() + query.slice(1),
            emoji: "🔥",
          }));
        if (top.length >= 3) setTrending(top);
      })
      .catch(() => {}); // silently keep static fallback
  }, []);

  return (
    <section className="px-4 sm:px-6 py-4 max-w-5xl mx-auto">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400" />
        Tendencias ahora
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {trending.map(({ query, emoji }) => (
          <button
            key={query}
            onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&country=${selectedCountry.code}`)}
            className="flex items-center gap-2 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/20 rounded-xl px-3 py-2.5 transition-all text-left group"
          >
            <span className="text-lg shrink-0">{emoji}</span>
            <span className="text-slate-300 group-hover:text-orange-300 text-xs font-medium truncate">{query}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
