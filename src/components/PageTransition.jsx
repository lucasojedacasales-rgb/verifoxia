import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigationType } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  const navType = useNavigationType(); // "PUSH" | "POP" | "REPLACE"
  const isBack = navType === "POP";

  const variants = {
    initial: { x: isBack ? "-100%" : "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit:    { x: isBack ? "100%" : "-100%", opacity: 0 },
  };

  return (
    // Clip only horizontally so vertical scroll is never blocked
    <div style={{ overflowX: "clip", position: "relative" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={location.pathname + location.search}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          style={{ backgroundColor: "#020617" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}