import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.15, ease: "easeInOut" }}
        style={{ backgroundColor: "#020617" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}