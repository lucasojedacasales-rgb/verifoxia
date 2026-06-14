import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function CountrySelector({ selectedCountry, countries, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 h-9 px-3 gap-2"
        >
          <span className="text-base">{selectedCountry.flag}</span>
          <span className="text-sm hidden sm:block">{selectedCountry.name}</span>
          <Globe className="w-3.5 h-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-900 border-white/10 text-slate-200 max-h-72 overflow-y-auto"
      >
        {countries.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => onChange(c)}
            className={`gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 ${
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