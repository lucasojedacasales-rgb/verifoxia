import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Globe, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/hooks/useLanguage";
import { base44 } from "@/api/base44Client";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCountry, changeCountry, countries } = useCountry();
  const { lang, changeLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const rootPages = ["/", "/compare", "/settings"];
  const isRootPage = rootPages.includes(location.pathname);
  const showBackButton = !isRootPage;

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <header
      className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3 shrink-0"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      role="banner"
    >
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white shrink-0 min-h-[44px]"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 shrink-0" aria-label="Verifox">
            <div className="w-8 h-8 shrink-0">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Orejas */}
                <polygon points="20,55 10,10 40,40" fill="#e85d04"/>
                <polygon points="80,55 90,10 60,40" fill="#e85d04"/>
                <polygon points="23,52 15,18 38,42" fill="#ff6b00"/>
                <polygon points="77,52 85,18 62,42" fill="#ff6b00"/>
                {/* Cara */}
                <ellipse cx="50" cy="60" rx="30" ry="26" fill="#ff6b00"/>
                {/* Mejillas blancas */}
                <ellipse cx="30" cy="68" rx="14" ry="10" fill="#f0f0f0"/>
                <ellipse cx="70" cy="68" rx="14" ry="10" fill="#f0f0f0"/>
                {/* Nariz */}
                <ellipse cx="50" cy="76" rx="5" ry="3.5" fill="#1a1a2e"/>
                {/* Ojos cyan con scanner */}
                <ellipse cx="37" cy="58" rx="7" ry="6" fill="#0ea5e9"/>
                <ellipse cx="63" cy="58" rx="7" ry="6" fill="#0ea5e9"/>
                <ellipse cx="37" cy="58" rx="3.5" ry="3" fill="#0284c7"/>
                <ellipse cx="63" cy="58" rx="3.5" ry="3" fill="#0284c7"/>
                {/* Scanner brackets */}
                <path d="M30,51 L30,54 L33,54" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M44,51 L44,54 L41,54" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M30,65 L30,62 L33,62" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M44,65 L44,62 L41,62" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M56,51 L56,54 L59,54" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M70,51 L70,54 L67,54" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M56,65 L56,62 L59,62" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M70,65 L70,62 L67,62" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-black text-base tracking-tight uppercase">
              <span className="text-white">VERI</span><span className="text-orange-500">FOX</span>
            </span>
          </div>
        )}

        {location.pathname === "/settings" && (
          <h1 className="text-white font-semibold text-base">Ajustes</h1>
        )}

        <div className="flex-1" />

        {/* Expandable menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3 py-2 transition-all min-h-[40px]"
            aria-expanded={open}
            aria-label="Mi perfil"
          >
            <User className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-300 text-xs font-medium hidden sm:block">Mi perfil</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              {/* User greeting */}
              <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                {user ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-500/30 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        👋 Hola, {user.full_name?.split(" ")[0] || "usuario"}
                      </p>
                      <p className="text-slate-400 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Bienvenido a Trustify</p>
                )}
              </div>

              {/* Country */}
              <div className="px-4 pt-3 pb-2">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> País / Moneda
                </p>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => changeCountry(c)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all text-left ${
                        selectedCountry.code === c.code
                          ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                          : "bg-white/5 border border-transparent text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                      <span className="ml-auto text-slate-500">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="px-4 pt-2 pb-3 border-b border-white/10">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Idioma</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all text-left ${
                        lang.code === l.code
                          ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                          : "bg-white/5 border border-transparent text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span className="truncate">{l.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth action */}
              <div className="px-4 py-3">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                ) : (
                  <button
                    onClick={() => { navigate("/login"); setOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 text-sm font-medium transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}