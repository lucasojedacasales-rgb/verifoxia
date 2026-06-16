import { useState, useRef, useEffect } from "react";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const POPULAR = [
  "iPhone 15", "Samsung Galaxy S24", "MacBook Air", "AirPods Pro",
  "PlayStation 5", "Nike Air Max", "iPad Pro", "Kindle", "Samsung 4K TV",
  "Nintendo Switch", "Dyson V15", "Apple Watch", "Sony WH-1000XM5",
];

export default function SearchAutocomplete({ value, onChange, onSearch, placeholder, className }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Load local history
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("verifox_search_history") || "[]");
      setHistory(stored.slice(0, 8));
    } catch (_) {}
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const query = value.trim().toLowerCase();

  // Filter suggestions
  const historySuggestions = history.filter(
    (h) => !query || h.toLowerCase().includes(query)
  ).slice(0, 4);

  const popularSuggestions = POPULAR.filter(
    (p) => p.toLowerCase().includes(query) &&
      !historySuggestions.some((h) => h.toLowerCase() === p.toLowerCase())
  ).slice(0, query ? 5 : 4);

  const hasSuggestions = historySuggestions.length > 0 || popularSuggestions.length > 0;

  const handleSelect = (term) => {
    onChange(term);
    setOpen(false);
    saveToHistory(term);
    onSearch(term);
  };

  const saveToHistory = (term) => {
    try {
      const stored = JSON.parse(localStorage.getItem("verifox_search_history") || "[]");
      const updated = [term, ...stored.filter((h) => h.toLowerCase() !== term.toLowerCase())].slice(0, 12);
      localStorage.setItem("verifox_search_history", JSON.stringify(updated));
    } catch (_) {}
  };

  const removeHistory = (e, term) => {
    e.stopPropagation();
    const updated = history.filter((h) => h !== term);
    setHistory(updated);
    localStorage.setItem("verifox_search_history", JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    saveToHistory(value.trim());
    setOpen(false);
    onSearch(value.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const first = containerRef.current?.querySelector("[data-suggestion]");
      if (first) first.focus();
    }
  };

  const handleSuggestionKeyDown = (e, term) => {
    if (e.key === "Enter") handleSelect(term);
    if (e.key === "Escape") { setOpen(false); inputRef.current?.focus(); }
    if (e.key === "ArrowDown") { e.preventDefault(); e.target.nextElementSibling?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); e.target.previousElementSibling?.focus() || inputRef.current?.focus(); }
  };

  return (
    <div ref={containerRef} className={`relative flex-1 ${className || ""}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10 pointer-events-none" aria-hidden="true" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Buscar producto"
        aria-autocomplete="list"
        aria-expanded={open && hasSuggestions}
        className="pl-12 h-12 sm:h-14 text-base bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 pr-4"
      />

      {open && hasSuggestions && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
        >
          {historySuggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Recientes</span>
              </div>
              {historySuggestions.map((term) => (
                <div
                  key={term}
                  role="option"
                  data-suggestion
                  tabIndex={0}
                  onClick={() => handleSelect(term)}
                  onKeyDown={(e) => handleSuggestionKeyDown(e, term)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 cursor-pointer group transition-colors outline-none focus:bg-white/5 min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-200 text-sm">{term}</span>
                  </div>
                  <button
                    onClick={(e) => removeHistory(e, term)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-all"
                    aria-label={`Eliminar ${term} del historial`}
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {popularSuggestions.length > 0 && (
            <div>
              <div className={`flex items-center gap-2 px-4 pb-1 ${historySuggestions.length > 0 ? "pt-2 border-t border-white/5" : "pt-3"}`}>
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  {query ? "Sugerencias" : "Popular ahora"}
                </span>
              </div>
              {popularSuggestions.map((term) => (
                <div
                  key={term}
                  role="option"
                  data-suggestion
                  tabIndex={0}
                  onClick={() => handleSelect(term)}
                  onKeyDown={(e) => handleSuggestionKeyDown(e, term)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors outline-none focus:bg-white/5 min-h-[44px]"
                >
                  <TrendingUp className="w-4 h-4 text-blue-500/60 shrink-0" />
                  <span className="text-slate-200 text-sm">
                    {query
                      ? highlightMatch(term, value)
                      : term}
                  </span>
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