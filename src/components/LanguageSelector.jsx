import { useState } from "react";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import BottomSheet from "@/components/BottomSheet";

function useIsMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export default function LanguageSelector({ lang, languages, onChange }) {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleChange = (l) => {
    onChange(l);
    setSheetOpen(false);
  };

  const trigger = (
    <Button
      variant="ghost"
      className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 h-11 min-h-[44px] px-3 gap-2"
      onClick={isMobile ? () => setSheetOpen(true) : undefined}
    >
      <span className="text-base">{lang.flag}</span>
      <span className="text-sm hidden sm:block">{lang.nativeName}</span>
      <Languages className="w-3.5 h-3.5 text-slate-400" />
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Seleccionar idioma"
        >
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleChange(l)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[44px] rounded-xl mb-1 transition-colors ${
                lang.code === l.code
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <span className="flex-1 text-left text-sm font-medium">{l.nativeName}</span>
              <span className="text-slate-500 text-xs uppercase">{l.code}</span>
            </button>
          ))}
        </BottomSheet>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-900 border-white/10 text-slate-200 max-h-72 overflow-y-auto"
      >
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onChange(l)}
            className={`gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 min-h-[44px] ${
              lang.code === l.code ? "bg-blue-500/20 text-blue-300" : ""
            }`}
          >
            <span className="text-base">{l.flag}</span>
            <span>{l.nativeName}</span>
            <span className="ml-auto text-slate-500 text-xs uppercase">{l.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}