import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Brain, BarChart2, ShoppingCart } from "lucide-react";

const STEPS = [
  { icon: Search,       label: "Buscando producto en Google Shopping..." },
  { icon: Globe,        label: "Consultando precios en tiendas locales..." },
  { icon: Brain,        label: "Analizando con inteligencia artificial..." },
  { icon: BarChart2,    label: "Comparando precios y reseñas..." },
  { icon: ShoppingCart, label: "Preparando recomendación personalizada..." },
];

export default function SearchLoadingAnimation({ query }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-8">
      {/* Animated icon ring */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        {/* Inner pulsing ring */}
        <div className="absolute inset-2 rounded-full border-2 border-purple-500/30 border-b-purple-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        {/* Center icon */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center"
          >
            <Icon className="w-5 h-5 text-blue-400" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Query */}
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-1">Analizando</p>
        <p className="text-white font-bold text-xl">"{query}"</p>
      </div>

      {/* Step label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-blue-300 text-sm font-medium text-center max-w-xs"
        >
          {current.label}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full"
            animate={{
              width: i === step ? 24 : 6,
              backgroundColor: i === step ? "#3b82f6" : "#334155",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}