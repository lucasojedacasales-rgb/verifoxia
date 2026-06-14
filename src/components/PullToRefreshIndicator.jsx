import { forwardRef } from "react";
import { RefreshCw } from "lucide-react";

const PullToRefreshIndicator = forwardRef(function PullToRefreshIndicator(_, ref) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute top-0 left-0 right-0 z-40 flex justify-center pt-3"
      style={{ transform: "translateY(-100%)", opacity: 0, transition: "none" }}
    >
      <div className="bg-slate-800 border border-white/10 rounded-full p-2 shadow-lg">
        <RefreshCw data-spin className="w-5 h-5 text-blue-400" />
      </div>
    </div>
  );
});

export default PullToRefreshIndicator;