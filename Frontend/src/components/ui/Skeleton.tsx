// ─── Skeleton Base ────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-800 rounded-lg ${className}`} />
)

// ─── Skeleton للـ HomePage (Hero Section) ────────────────────────────────────
export const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-4xl mx-auto text-center space-y-8 w-full">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full bg-slate-800 animate-pulse" />
      </div>
      {/* Name */}
      <div className="space-y-3 flex flex-col items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-6 w-48" />
      </div>
      {/* Bio */}
      <div className="space-y-2 flex flex-col items-center">
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-4 w-64" />
      </div>
      {/* Button */}
      <div className="flex justify-center">
        <Skeleton className="h-12 w-36" />
      </div>
    </div>
  </div>
)

// ─── Skeleton للـ CompanyHeader ───────────────────────────────────────────────
export const CompanyHeaderSkeleton = () => (
  <div className="bg-slate-900 border-b border-slate-800">
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Photo */}
        <div className="w-28 h-28 rounded-2xl bg-slate-800 animate-pulse shrink-0" />
        {/* Info */}
        <div className="flex-1 space-y-3 w-full">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

// ─── Skeleton لبطاقات المشاريع ────────────────────────────────────────────────
export const ProjectsSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <Skeleton className="h-44 rounded-none" />
        <div className="p-5 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

// ─── Skeleton للـ Dashboard Stats ────────────────────────────────────────────
export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
)

export default Skeleton
