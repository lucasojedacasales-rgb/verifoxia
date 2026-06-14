import { useRef, useCallback } from "react";

/**
 * usePullToRefresh
 * Attach the returned ref to a scrollable container.
 * onRefresh must return a Promise.
 */
export function usePullToRefresh(onRefresh) {
  const startY = useRef(null);
  const pulling = useRef(false);
  const indicatorRef = useRef(null);

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

  const onTouchStart = useCallback((e) => {
    // Only pull from the top
    const el = e.currentTarget;
    if (el.scrollTop !== 0) return;
    startY.current = e.touches[0].clientY;
    pulling.current = false;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (startY.current === null) return;
    const el = e.currentTarget;
    if (el.scrollTop !== 0) { startY.current = null; return; }
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) return;
    pulling.current = true;
    setIndicator(dy / 80);
    // Prevent the default browser pull-to-refresh on Android
    e.preventDefault();
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current || startY.current === null) {
      startY.current = null;
      return;
    }
    startY.current = null;
    pulling.current = false;

    // Show spinning state
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = "translateY(0%)";
      indicatorRef.current.style.opacity = "1";
      const spinner = indicatorRef.current.querySelector("[data-spin]");
      if (spinner) spinner.classList.add("animate-spin");
    }

    await onRefresh();

    // Hide
    setIndicator(null);
    const spinner = indicatorRef.current?.querySelector("[data-spin]");
    if (spinner) spinner.classList.remove("animate-spin");
  }, [onRefresh]);

  const scrollProps = { onTouchStart, onTouchMove, onTouchEnd };

  return { scrollProps, indicatorRef };
}