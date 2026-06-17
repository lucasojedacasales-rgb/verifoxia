import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Globe, ChevronDown, LogIn, LogOut, User, Pencil, Heart, Check, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/hooks/useLanguage";
import { base44 } from "@/api/base44Client";
import EditProfileModal from "@/components/EditProfileModal";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCountry, changeCountry, countries } = useCountry();
  const { lang, changeLanguage, languages } = useLanguage();

  // Menus
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const prefsRef = useRef(null);
  const profileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (prefsRef.current && !prefsRef.current.contains(e.target)) setPrefsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menus on route change
  useEffect(() => { setPrefsOpen(false); setProfileOpen(false); }, [location.pathname]);

  const rootPages = ["/", "/compare", "/settings", "/favorites"];
  const isRootPage = rootPages.includes(location.pathname);
  const showBackButton = !isRootPage;

  const handleLogout = async () => {
    setProfileOpen(false);
    await base44.auth.logout();
  };

  return (
    <header
      className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 shrink-0"
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 0.75rem)",
        paddingBottom: "0.75rem",
        "--header-height": "calc(max(env(safe-area-inset-top, 0px), 0.75rem) + 0.75rem + 40px)",
      }}
      role="banner"
    >
      <div className="max-w-6xl mx-auto flex items-center gap-2">
        {/* Left: back or logo */}
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
          <button onClick={() => navigate("/")} className="flex items-center gap-2 shrink-0" aria-label="Ir al inicio">
            <img
              src="https://media.base44.com/images/public/6a2e1f2e45b60383a960c225/d049c4265_UseAIImageJun16202600_47_52.png"
              alt="Verifox logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-black text-base tracking-tight uppercase">
              <span className="text-white">VERI</span><span className="text-orange-500">FOX</span>
            </span>
          </button>
        )}

        {location.pathname === "/settings" && (
          <h1 className="text-white font-semibold text-base">Ajustes</h1>
        )}

        <div className="flex-1" />

        {/* Right buttons */}
        <div className="flex items-center gap-1.5">

          {/* Preferences menu */}
          <div className="relative" ref={prefsRef}>
            <button
              onClick={() => { setPrefsOpen((v) => !v); setProfileOpen(false); }}
              className="flex items-center gap-1 bg-white/8 hover:bg-white/15 border border-white/15 rounded-xl px-2.5 py-2 transition-all min-h-[40px]"
              aria-expanded={prefsOpen}
              aria-label="Preferencias de región e idioma"
            >
              <Globe className="w-4 h-4 text-slate-300" />
              <span className="text-slate-300 text-xs font-medium hidden sm:block">
                {selectedCountry.flag} {selectedCountry.code}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${prefsOpen ? "rotate-180" : ""}`} />
            </button>

            {prefsOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                  <p className="text-white text-sm font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-400" /> Preferencias regionales
                  </p>
                </div>

                {/* Country */}
                <div className="px-4 pt-3 pb-2">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">País / Moneda</p>
                  <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1" style={{ WebkitOverflowScrolling: "touch" }}>
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { changeCountry(c); setPrefsOpen(false); }}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all text-left ${
                          selectedCountry.code === c.code
                            ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                            : "bg-white/5 border border-transparent text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                        {selectedCountry.code === c.code && <Check className="w-3 h-3 ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="px-4 pt-2 pb-4">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Languages className="w-3 h-3" /> Idioma
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { changeLanguage(l); setPrefsOpen(false); }}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all text-left ${
                          lang.code === l.code
                            ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                            : "bg-white/5 border border-transparent text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span className="truncate">{l.nativeName}</span>
                        {lang.code === l.code && <Check className="w-3 h-3 ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Favorites button */}
          <button
            onClick={() => navigate("/favorites")}
            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${
              location.pathname === "/favorites"
                ? "bg-pink-500/20 border-pink-500/40 text-pink-400"
                : "bg-white/8 hover:bg-white/15 border-white/15 text-slate-300 hover:text-pink-400"
            }`}
            aria-label="Favoritos"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Profile / Login button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                if (!user) { navigate("/login"); return; }
                setProfileOpen((v) => !v);
                setPrefsOpen(false);
              }}
              className="flex items-center gap-1.5 bg-white/8 hover:bg-white/15 border border-white/15 rounded-xl px-2.5 py-2 transition-all min-h-[40px]"
              aria-expanded={profileOpen}
              aria-label={user ? "Mi perfil" : "Iniciar sesión"}
            >
              <User className="w-4 h-4 text-slate-300" />
              <span className="text-slate-300 text-xs font-medium hidden sm:block">
                {user ? (user.display_name || user.full_name?.split(" ")[0] || "Perfil") : "Entrar"}
              </span>
              {user && <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />}
            </button>

            {profileOpen && user && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {user.display_name || user.full_name || "Usuario"}
                      </p>
                      <p className="text-slate-400 text-xs truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setShowEditProfile(true); setProfileOpen(false); }}
                      className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                      aria-label="Editar perfil"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Logout */}
                <div className="px-4 py-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditProfile && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSaved={(newName) => {
            setUser((prev) => prev ? { ...prev, display_name: newName } : prev);
          }}
        />
      )}
    </header>
  );
}