import { useRef, useCallback, useEffect } from "react";

/**
 * usePullToRefresh
 * Uses non-passive touch listeners (required to call preventDefault on Android).
 * onRefresh must return a Promise.
 */
export function usePullToRefresh(onRefresh) {
  const startY = useRef(null);
  const pulling = useRef(false);
  const indicatorRef = useRef(null);
  const containerRef = useRef(null);

  const setIndicator = (pct) => {
    if (!indicatorRef.current) return;
    if (pct === null) {
      indicatorRef.current.style.transform = "translateY(-100%)";
      indicatorRef.current.style.opacity = "0";
    } else {
      const clamped = Math.min(pct, 1);
      indicatorRef.current.style.transform = `translateY(${(clamped - 1) * 100}%)`;
      indicatorRef.current.style.opacity = String(clamped);
    }
  };

  const handleTouchStart = useCallback((e) => {
    const el = e.currentTarget;
    if (el.scrollTop !== 0) return;
    startY.current = e.touches[0].clientY;
    pulling.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY.current === null) return;
    const el = e.currentTarget;
    if (el.scrollTop !== 0) { startY.current = null; return; }
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) return;
    pulling.current = true;
    setIndicator(dy / 80);
    e.preventDefault(); // needs non-passive listener
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || startY.current === null) {
      startY.current = null;
      return;
    }
    startY.current = null;
    pulling.current = false;

    if (indicatorRef.current) {
      indicatorRef.current.style.transform = "translateY(0%)";
      indicatorRef.current.style.opacity = "1";
      const spinner = indicatorRef.current.querySelector("[data-spin]");
      if (spinner) spinner.classList.add("animate-spin");
    }

    await onRefresh();

    setIndicator(null);
    const spinner = indicatorRef.current?.querySelector("[data-spin]");
    if (spinner) spinner.classList.remove("animate-spin");
  }, [onRefresh]);

  // Register non-passive listeners via useEffect so preventDefault works on Android
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // scrollProps kept for backwards compat (no-op now that we use ref-based listeners)
  const scrollProps = {};

  return { scrollProps, indicatorRef, containerRef };
}