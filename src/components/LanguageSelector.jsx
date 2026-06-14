import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LanguageSelector({ lang, languages, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 h-9 px-3 gap-2"
        >
          <span className="text-base">{lang.flag}</span>
          <span className="text-sm hidden sm:block">{lang.nativeName}</span>
          <Languages className="w-3.5 h-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-900 border-white/10 text-slate-200 max-h-72 overflow-y-auto"
      >
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onChange(l)}
            className={`gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 ${
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