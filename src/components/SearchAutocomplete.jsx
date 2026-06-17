import { useState, useRef, useEffect, useCallback } from "react";
import { Search, TrendingUp, Clock, X, Link, Zap } from "lucide-react";

function isUrl(str) {
  try { new URL(str); return str.startsWith("http"); } catch { return false; }
}

// Banco amplio de sugerencias populares categorizadas
const POPULAR_BY_CATEGORY = {
  "📱 Móviles": ["iPhone 16 Pro", "iPhone 15", "Samsung Galaxy S25", "Samsung Galaxy S24", "Xiaomi 14 Pro", "Google Pixel 9", "OnePlus 13", "Motorola Edge 50"],
  "💻 Portátiles": ["MacBook Air M3", "MacBook Pro M4", "Dell XPS 15", "ASUS ROG Zephyrus", "Lenovo ThinkPad X1", "HP Spectre x360", "Surface Laptop 5"],
  "🎮 Gaming": ["PlayStation 5", "Nintendo Switch 2", "Xbox Series X", "Steam Deck OLED", "DualSense PS5", "Nintendo Switch OLED"],
  "🎧 Audio": ["AirPods Pro 2", "Sony WH-1000XM5", "Bose QC45", "Galaxy Buds Pro", "Jabra Evolve2", "JBL Charge 5"],
  "📺 TV y Hogar": ["Samsung 4K TV 65\"", "LG OLED 55\"", "Dyson V15", "Roomba j9+", "Apple TV 4K", "Chromecast 4K"],
  "⌚ Wearables": ["Apple Watch Series 10", "Samsung Galaxy Watch 7", "Garmin Fenix 8", "Fitbit Charge 6"],
  "📸 Fotografía": ["Sony Alpha A7C", "Canon EOS R50", "GoPro Hero 13", "DJI Osmo 6"],
};

const ALL_POPULAR = Object.values(POPULAR_BY_CATEGORY).flat();

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem("verifox_search_history") || "[]").slice(0, 12);
  } catch { return []; }
}

function saveToHistory(term) {
  try {
    const stored = loadHistory();
    const updated = [term, ...stored.filter((h) => h.toLowerCase() !== term.toLowerCase())].slice(0, 12);
    localStorage.setItem("verifox_search_history", JSON.stringify(updated));
  } catch {}
}

// Devuelve el texto de autocompletado inline (el sufijo que falta)
function getInlineCompletion(query, history) {
  if (!query || query.length < 2) return "";
  const q = query.toLowerCase();
  const allTerms = [...history, ...ALL_POPULAR];
  const match = allTerms.find(
    (t) => t.toLowerCase().startsWith(q) && t.toLowerCase() !== q
  );
  return match ? match.slice(query.length) : "";
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-blue-400 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchAutocomplete({ value, onChange, onSearch, placeholder, className }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const query = value;
  const queryLower = query.trim().toLowerCase();

  // Filtrar historial
  const historySuggestions = history.filter(
    (h) => !queryLower || h.toLowerCase().includes(queryLower)
  ).slice(0, 4);

  // Filtrar populares (excluir las que ya están en historial)
  const popularSuggestions = ALL_POPULAR.filter(
    (p) => p.toLowerCase().includes(queryLower) &&
      !historySuggestions.some((h) => h.toLowerCase() === p.toLowerCase())
  ).slice(0, queryLower ? 6 : 5);

  const allSuggestions = [...historySuggestions, ...popularSuggestions];
  const hasSuggestions = allSuggestions.length > 0;

  // Inline ghost completion
  const inlineCompletion = getInlineCompletion(query, history);

  const handleSelect = useCallback((term) => {
    onChange(term);
    setOpen(false);
    setActiveIdx(-1);
    saveToHistory(term);
    setHistory(loadHistory());
    onSearch(term);
  }, [onChange, onSearch]);

  const removeHistory = (e, term) => {
    e.stopPropagation();
    const updated = history.filter((h) => h !== term);
    setHistory(updated);
    localStorage.setItem("verifox_search_history", JSON.stringify(updated));
  };

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    saveToHistory(query.trim());
    setHistory(loadHistory());
    setOpen(false);
    setActiveIdx(-1);
    onSearch(query.trim());
  }, [query, onSearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && inlineCompletion && open) {
      e.preventDefault();
      const completed = query + inlineCompletion;
      onChange(completed);
      return;
    }
    if (e.key === "ArrowRight" && inlineCompletion && open && inputRef.current?.selectionStart === query.length) {
      e.preventDefault();
      onChange(query + inlineCompletion);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && allSuggestions[activeIdx]) {
        handleSelect(allSuggestions[activeIdx]);
      } else {
        handleSubmit();
      }
      return;
    }
    if (e.key === "Escape") { setOpen(false); setActiveIdx(-1); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, allSuggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
      return;
    }
  };

  // Mostrar categorías populares cuando no hay query
  const showCategories = !queryLower && !historySuggestions.length;
  const categoryEntries = Object.entries(POPULAR_BY_CATEGORY).slice(0, 3);

  return (
    <div ref={containerRef} className={`relative flex-1 ${className || ""}`}>
      {/* Icono izquierdo */}
      {isUrl(value)
        ? <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 z-10 pointer-events-none" />
        : <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10 pointer-events-none" />
      }

      {/* Ghost text de autocompletado inline */}
      {inlineCompletion && open && !isUrl(value) && (
        <div
          aria-hidden="true"
          className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center text-base"
          style={{ paddingRight: "1rem" }}
        >
          <span className="text-white opacity-0 whitespace-pre">{query}</span>
          <span className="text-slate-500 whitespace-pre">{inlineCompletion}</span>
        </div>
      )}

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Buscar producto"
        aria-autocomplete="list"
        aria-expanded={open && hasSuggestions}
        className={`
          flex w-full border rounded-xl px-3 py-1 shadow-sm transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          disabled:cursor-not-allowed disabled:opacity-50
          pl-12 h-12 sm:h-14 text-base bg-white/10 border-white/20 text-white 
          placeholder:text-slate-400 pr-4
        `}
      />

      {/* Hint de Tab cuando hay ghost text */}
      {inlineCompletion && open && !isUrl(value) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <span className="text-xs text-slate-600 bg-slate-800/80 border border-white/10 px-1.5 py-0.5 rounded font-mono">Tab</span>
        </div>
      )}

      {/* Panel URL */}
      {open && isUrl(value) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-blue-500/30 rounded-xl shadow-2xl shadow-black/40 z-50 px-4 py-3 flex items-center gap-3">
          <Link className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <p className="text-white text-sm font-medium">Analizar producto desde enlace</p>
            <p className="text-slate-400 text-xs">Pulsa Buscar y la IA extraerá el artículo y calculará el VERIFOX Score</p>
          </div>
        </div>
      )}

      {/* Panel de sugerencias */}
      {open && !isUrl(value) && (hasSuggestions || showCategories) && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
        >
          {/* Historial */}
          {historySuggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Recientes</span>
              </div>
              {historySuggestions.map((term, i) => (
                <SuggestionRow
                  key={term}
                  term={term}
                  query={queryLower}
                  icon={<Clock className="w-4 h-4 text-slate-500 shrink-0" />}
                  active={activeIdx === i}
                  onSelect={() => handleSelect(term)}
                  onRemove={(e) => removeHistory(e, term)}
                />
              ))}
            </div>
          )}

          {/* Sugerencias populares filtradas */}
          {popularSuggestions.length > 0 && (
            <div>
              <div className={`flex items-center gap-2 px-4 pb-1 ${historySuggestions.length > 0 ? "pt-2 border-t border-white/5" : "pt-3"}`}>
                <TrendingUp className="w-3.5 h-3.5 text-blue-500/70" />
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  {queryLower ? "Sugerencias" : "Trending"}
                </span>
              </div>
              {popularSuggestions.map((term, i) => (
                <SuggestionRow
                  key={term}
                  term={term}
                  query={queryLower}
                  icon={<TrendingUp className="w-4 h-4 text-blue-500/50 shrink-0" />}
                  active={activeIdx === historySuggestions.length + i}
                  onSelect={() => handleSelect(term)}
                  highlight
                />
              ))}
            </div>
          )}

          {/* Categorías cuando no hay query ni historial */}
          {showCategories && (
            <div className="pt-3 pb-2">
              <div className="flex items-center gap-2 px-4 pb-2">
                <Zap className="w-3.5 h-3.5 text-yellow-500/70" />
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Explora por categoría</span>
              </div>
              {categoryEntries.map(([cat, items]) => (
                <div key={cat} className="px-4 py-1.5">
                  <p className="text-slate-500 text-xs mb-1">{cat}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.slice(0, 3).map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelect(term)}
                        className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="h-1" />
        </div>
      )}
    </div>
  );
}

function SuggestionRow({ term, query, icon, active, onSelect, onRemove, highlight }) {
  return (
    <div
      role="option"
      aria-selected={active}
      tabIndex={0}
      onClick={onSelect}
      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors outline-none group min-h-[44px] ${active ? "bg-white/10" : "hover:bg-white/5 focus:bg-white/5"}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon}
        <span className="text-slate-200 text-sm truncate">
          {highlight && query ? highlightMatch(term, query) : term}
        </span>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-all shrink-0 ml-2"
          aria-label={`Eliminar ${term}`}
        >
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
}