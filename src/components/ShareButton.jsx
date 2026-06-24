import { useState } from "react";
import { Share2, Twitter, MessageCircle, Link, Check } from "lucide-react";

const verdictEmoji = { comprar: "✅", esperar: "⏳", no_comprar: "❌" };
const verdictLabel = { comprar: "COMPRAR", esperar: "ESPERAR", no_comprar: "NO COMPRAR" };

export default function ShareButton({ product }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const url = window.location.href;
  const emoji = verdictEmoji[product.verdict] || "🔍";
  const verdict = verdictLabel[product.verdict] || "";
  const score = product.ai_score ? ` · ${product.ai_score}/100` : "";
  const text = `${emoji} ${product.name} — Veredicto IA: ${verdict}${score}\nComparé precios en VERIFOX:`;

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      color: "text-green-400",
      href: `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`,
    },
    {
      label: "Twitter / X",
      icon: <Twitter className="w-4 h-4" />,
      color: "text-sky-400",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, text, url }).catch(() => {});
    } else {
      setOpen((o) => !o);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg sm:rounded-xl text-purple-400 hover:text-purple-300 font-medium transition-all text-sm sm:text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Compartir resultado"
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        Compartir
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-2 right-0 z-50 bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-2 w-48 space-y-1">
            {shareOptions.map(({ label, icon, color, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors ${color} text-sm font-medium min-h-[44px]`}
              >
                {icon}
                {label}
              </a>
            ))}
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-slate-300 text-sm font-medium w-full min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link className="w-4 h-4" />}
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}