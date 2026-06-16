import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigationType } from "react-router-dom";

const SLIDE_DISTANCE = "100%";

export default function PageTransition({ children }) {
  const location = useLocation();
  const navType = useNavigationType(); // "PUSH" | "POP" | "REPLACE"

  const isBack = navType === "POP";

  const variants = {
    initial: {
      x: isBack ? `-${SLIDE_DISTANCE}` : SLIDE_DISTANCE,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: isBack ? SLIDE_DISTANCE : `-${SLIDE_DISTANCE}`,
      opacity: 0,
    },
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <AnimatePresence mode="popLayout" initial={false} custom={isBack}>
        <motion.div
          key={location.pathname + location.search}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          style={{ backgroundColor: "#020617", willChange: "transform, opacity" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}