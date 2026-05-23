export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200/60 rounded-md ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-2 w-16 mt-3" />
    </div>
  );
}

export function FuelCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm pt-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/60 animate-pulse"></div>
      <div className="flex justify-between items-start mt-1 mb-4">
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-8 w-32 mb-5" />
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50/50">
        <Skeleton className="h-4 w-1/4 mr-4" />
        <Skeleton className="h-4 w-1/4 mr-4" />
        <Skeleton className="h-4 w-1/4 mr-4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex px-4 py-4 border-b border-slate-100 items-center">
          <Skeleton className="h-3 w-1/4 mr-4" />
          <Skeleton className="h-3 w-1/4 mr-4" />
          <Skeleton className="h-3 w-1/4 mr-4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}
