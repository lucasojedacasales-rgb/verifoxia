import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // Root pages that show logo/title instead of back button
  const rootPages = ["/", "/compare", "/settings"];
  const isRootPage = rootPages.includes(location.pathname);

  // Check if we should show back button (child pages)
  const showBackButton = !isRootPage;

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
            className="text-slate-400 hover:text-white shrink-0 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 shrink-0" role="img" aria-label="Trustify">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            </div>
            <span className="text-white font-bold">Trustify</span>
          </div>
        )}

        {/* Show "Ajustes" label on Settings page */}
        {location.pathname === "/settings" && (
          <h1 className="text-white font-semibold text-base">Ajustes</h1>
        )}

        <div className="flex-1" />
      </div>
    </header>
  );
}