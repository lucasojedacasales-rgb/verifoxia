import { useNavigate, useLocation } from "react-router-dom";
import { Home, Clock, SplitSquareHorizontal, Settings } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Clock, label: "Búsquedas" },
  { to: "/compare", icon: SplitSquareHorizontal, label: "Comparar" },
  { to: "/settings", icon: Settings, label: "Ajustes" },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (tab) => {
    if (tab.to === "/") return location.pathname === "/";
    return location.pathname.startsWith(tab.to);
  };

  const handleTabPress = (tab) => {
    if (isActive(tab)) {
      // Already on this tab — reset to root
      navigate(tab.to, { replace: true });
    } else {
      navigate(tab.to);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur border-t border-white/10 flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab);
        const Icon = tab.icon;
        return (
          <button
            key={tab.to}
            onClick={() => handleTabPress(tab)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[44px] text-xs transition-colors select-none ${
              active ? "text-blue-400" : "text-slate-500"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}