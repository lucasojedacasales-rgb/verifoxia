/**
 * TrustScore™ — Indicador de confianza propio de Trustify.
 * Muestra una puntuación circular con gradiente de color y etiqueta de nivel.
 */

const getScoreConfig = (score) => {
  if (score >= 80) return { label: "Excelente", color: "#22c55e", glow: "shadow-green-500/30", textColor: "text-green-400", bg: "from-green-500/10 to-green-500/5", border: "border-green-500/20" };
  if (score >= 60) return { label: "Bueno",     color: "#3b82f6", glow: "shadow-blue-500/30",  textColor: "text-blue-400",  bg: "from-blue-500/10 to-blue-500/5",  border: "border-blue-500/20"  };
  if (score >= 40) return { label: "Regular",   color: "#eab308", glow: "shadow-yellow-500/30",textColor: "text-yellow-400",bg: "from-yellow-500/10 to-yellow-500/5",border: "border-yellow-500/20"};
  return               { label: "Bajo",       color: "#ef4444", glow: "shadow-red-500/30",   textColor: "text-red-400",   bg: "from-red-500/10 to-red-500/5",    border: "border-red-500/20"   };
};

export default function TrustScore({ score = 50, size = "lg" }) {
  const s = Math.min(100, Math.max(0, score));
  const cfg = getScoreConfig(s);

  // SVG circle params
  const r = size === "lg" ? 54 : 40;
  const cx = size === "lg" ? 64 : 48;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (s / 100) * circumference;
  const viewBox = size === "lg" ? "0 0 128 128" : "0 0 96 96";
  const svgSize = size === "lg" ? 128 : 96;
  const numSize = size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className={`inline-flex flex-col items-center gap-2`}>
      {/* Circular gauge */}
      <div className={`relative shadow-lg ${cfg.glow}`} style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} viewBox={viewBox}>
          {/* Track */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${cx} ${cx})`}
            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 6px ${cfg.color}88)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${numSize} font-black leading-none ${cfg.textColor}`}>{s}</span>
          <span className="text-slate-500 text-[9px] font-semibold tracking-widest uppercase mt-0.5">/100</span>
        </div>
      </div>

      {/* Badge */}
      <div className={`flex flex-col items-center`}>
        <span className={`text-xs font-black tracking-widest uppercase ${cfg.textColor}`}>
          TrustScore™
        </span>
        <span className={`text-xs font-semibold ${cfg.textColor} opacity-80`}>{cfg.label}</span>
      </div>
    </div>
  );
}