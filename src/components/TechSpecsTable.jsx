import { Cpu, Monitor, Battery, Camera, HardDrive, Wifi, Weight, Package } from "lucide-react";

// Map spec label keywords to icons
const getSpecIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("procesador") || l.includes("cpu") || l.includes("chip") || l.includes("soc")) return Cpu;
  if (l.includes("pantalla") || l.includes("display") || l.includes("resolución") || l.includes("hz") || l.includes("screen")) return Monitor;
  if (l.includes("batería") || l.includes("bateria") || l.includes("mah") || l.includes("carga") || l.includes("battery")) return Battery;
  if (l.includes("cámara") || l.includes("camara") || l.includes("foto") || l.includes("mp") || l.includes("video") || l.includes("camera")) return Camera;
  if (l.includes("ram") || l.includes("almacenamiento") || l.includes("storage") || l.includes("rom") || l.includes("ssd") || l.includes("hdd")) return HardDrive;
  if (l.includes("wifi") || l.includes("5g") || l.includes("bluetooth") || l.includes("nfc") || l.includes("conectividad") || l.includes("usb")) return Wifi;
  if (l.includes("peso") || l.includes("weight") || l.includes("dimensiones") || l.includes("grosor")) return Weight;
  return Package;
};

// Spec groups for collapsible sections
const SPEC_GROUPS = [
  { id: "rendimiento", label: "Rendimiento", keywords: ["procesador", "cpu", "chip", "soc", "ram", "gpu", "núcleos", "frecuencia", "velocidad"] },
  { id: "pantalla", label: "Pantalla", keywords: ["pantalla", "display", "resolución", "hz", "nits", "oled", "lcd", "amoled", "tamaño de pantalla", "ppi"] },
  { id: "camara", label: "Cámara", keywords: ["cámara", "camara", "foto", "mp", "megapixel", "apertura", "video", "zoom", "lente", "sensor"] },
  { id: "bateria", label: "Batería", keywords: ["batería", "bateria", "mah", "carga", "autonomía", "wireless", "magsafe"] },
  { id: "almacenamiento", label: "Almacenamiento", keywords: ["almacenamiento", "storage", "rom", "ssd", "hdd", "microsd", "disco"] },
  { id: "conectividad", label: "Conectividad", keywords: ["wifi", "5g", "4g", "bluetooth", "nfc", "usb", "sim", "gps", "lte", "conectividad"] },
  { id: "diseno", label: "Diseño y construcción", keywords: ["peso", "dimensiones", "grosor", "material", "colores", "certificación", "ip", "agua"] },
  { id: "software", label: "Software y SO", keywords: ["sistema operativo", "android", "ios", "windows", "macos", "versión", "actualizaciones"] },
];

function groupSpecs(specs) {
  const grouped = {};
  const used = new Set();

  SPEC_GROUPS.forEach((group) => {
    const matched = specs.filter((s) => {
      const l = s.label.toLowerCase();
      return group.keywords.some((k) => l.includes(k));
    });
    if (matched.length > 0) {
      grouped[group.id] = { ...group, specs: matched };
      matched.forEach((s) => used.add(s.label));
    }
  });

  // Remaining ungrouped specs
  const other = specs.filter((s) => !used.has(s.label));
  if (other.length > 0) {
    grouped["otros"] = { id: "otros", label: "Otros", specs: other };
  }

  return Object.values(grouped);
}

export default function TechSpecsTable({ productA, productB }) {
  const specsA = productA?.tech_specs || [];
  const specsB = productB?.tech_specs || [];

  const allLabels = [...new Set([...specsA.map((s) => s.label), ...specsB.map((s) => s.label)])];
  const mapA = Object.fromEntries(specsA.map((s) => [s.label, s.value]));
  const mapB = Object.fromEntries(specsB.map((s) => [s.label, s.value]));

  // Build unified spec list
  const allSpecs = allLabels.map((label) => ({ label, valueA: mapA[label] || null, valueB: mapB[label] || null }));
  const groups = groupSpecs(allSpecs.map((s) => ({ label: s.label })));

  const nameA = productA?.name?.split(" ").slice(0, 3).join(" ") || "Producto A";
  const nameB = productB?.name?.split(" ").slice(0, 3).join(" ") || "Producto B";

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/60 border-b border-white/10 px-5 py-4 flex items-center gap-2">
        <span className="text-xl">🔧</span>
        <h3 className="text-white font-bold text-base">Especificaciones técnicas</h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_1fr_1fr] bg-slate-900/40 border-b border-white/10">
        <div className="px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Especificación</div>
        <div className="px-4 py-3 border-l border-white/5">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider truncate block">{nameA}</span>
        </div>
        <div className="px-4 py-3 border-l border-white/5">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider truncate block">{nameB}</span>
        </div>
      </div>

      {/* Groups */}
      {groups.map((group) => (
        <div key={group.id}>
          {/* Group label */}
          <div className="px-4 py-2 bg-white/[0.03] border-b border-white/5">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{group.label}</span>
          </div>
          {/* Spec rows */}
          {group.specs.map((spec, i) => {
            const vA = mapA[spec.label];
            const vB = mapB[spec.label];
            const Icon = getSpecIcon(spec.label);
            return (
              <div
                key={spec.label}
                className={`grid grid-cols-[1fr_1fr_1fr] border-b border-white/5 hover:bg-white/[0.04] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}
              >
                {/* Label */}
                <div className="px-4 py-3 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="text-slate-400 text-sm">{spec.label}</span>
                </div>
                {/* Value A */}
                <div className="px-4 py-3 border-l border-white/5 flex items-center">
                  <span className={`text-sm leading-snug ${vA ? "text-slate-200" : "text-slate-600"}`}>
                    {vA || "—"}
                  </span>
                </div>
                {/* Value B */}
                <div className="px-4 py-3 border-l border-white/5 flex items-center">
                  <span className={`text-sm leading-snug ${vB ? "text-slate-200" : "text-slate-600"}`}>
                    {vB || "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}