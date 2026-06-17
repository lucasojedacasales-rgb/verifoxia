const stores = [
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", bg: "bg-[#FF9900]/10", border: "border-[#FF9900]/20" },
  { name: "MediaMarkt", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/MediaMarkt_Logo.svg", bg: "bg-red-500/10", border: "border-red-500/20" },
  { name: "El Corte Inglés", logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Logo_El_Corte_Ingl%C3%A9s_2021.svg", bg: "bg-green-500/10", border: "border-green-500/20" },
  { name: "PCComponentes", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/PcComponentes_logo.svg", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { name: "Fnac", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Fnac_Logo.svg", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { name: "Carrefour", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Carrefour_logo.svg", bg: "bg-blue-500/10", border: "border-blue-500/20" },
];

export default function StoreStrip() {
  return (
    <section className="px-4 sm:px-6 py-4 max-w-5xl mx-auto">
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
        Comparamos precios en más de 200 tiendas, incluyendo
      </p>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        {stores.map(({ name, logo, bg, border }) => (
          <div
            key={name}
            className={`flex items-center justify-center shrink-0 h-10 px-4 rounded-xl border ${bg} ${border}`}
            title={name}
          >
            <img
              src={logo}
              alt={name}
              className="h-5 w-auto max-w-[80px] object-contain"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
            />
            <span className="text-slate-300 text-xs font-medium hidden">{name}</span>
          </div>
        ))}
        <div className="flex items-center justify-center shrink-0 h-10 px-4 rounded-xl border border-white/10 bg-white/5">
          <span className="text-slate-400 text-xs font-medium whitespace-nowrap">+200 más →</span>
        </div>
      </div>
    </section>
  );
}