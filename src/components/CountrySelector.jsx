import { useState } from "react";
import { Globe } from "lucide-react";
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

export default function CountrySelector({ selectedCountry, countries, onChange }) {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleChange = (c) => {
    onChange(c);
    setSheetOpen(false);
  };

  const trigger = (
    <Button
      variant="ghost"
      className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 h-11 min-h-[44px] px-3 gap-2"
      onClick={isMobile ? () => setSheetOpen(true) : undefined}
    >
      <span className="text-base">{selectedCountry.flag}</span>
      <span className="text-sm hidden sm:block">{selectedCountry.name}</span>
      <Globe className="w-3.5 h-3.5 text-slate-400" />
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Seleccionar país"
        >
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => handleChange(c)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[44px] rounded-xl mb-1 transition-colors ${
                selectedCountry.code === c.code
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <span className="text-xl">{c.flag}</span>
              <span className="flex-1 text-left text-sm font-medium">{c.name}</span>
              <span className="text-slate-500 text-xs">{c.currency}</span>
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
        {countries.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => onChange(c)}
            className={`gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 min-h-[44px] ${
              selectedCountry.code === c.code ? "bg-blue-500/20 text-blue-300" : ""
            }`}
          >
            <span className="text-base">{c.flag}</span>
            <span>{c.name}</span>
            <span className="ml-auto text-slate-500 text-xs">{c.currency}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}