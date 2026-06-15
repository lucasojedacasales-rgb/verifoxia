import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResultsSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* ProductCard + VerdictBanner */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* ProductCard skeleton */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex gap-4">
            <Skeleton className="w-24 h-24 rounded-xl bg-white/10 shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-2/3 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16 rounded-lg bg-white/10" />
            <Skeleton className="h-16 rounded-lg bg-white/10" />
            <Skeleton className="h-16 rounded-lg bg-white/10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-5/6 bg-white/10" />
          </div>
        </div>

        {/* VerdictBanner skeleton */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 flex-1">
            <Skeleton className="h-8 w-1/2 mx-auto bg-white/10 rounded-full" />
            <Skeleton className="h-14 w-full bg-white/10 rounded-xl" />
            <Skeleton className="h-4 w-3/4 mx-auto bg-white/10" />
            <Skeleton className="h-4 w-1/2 mx-auto bg-white/10" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
        </div>
      </div>

      {/* StoreComparison skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-44 bg-white/10" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
            <Skeleton className="h-5 w-28 bg-white/10" />
            <Skeleton className="h-5 w-20 bg-white/10 ml-auto" />
            <Skeleton className="h-5 w-16 bg-white/10" />
            <Skeleton className="h-9 w-24 bg-white/10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}