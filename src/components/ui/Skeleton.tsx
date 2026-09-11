type SkeletonProps = {
  className?: string
}

function SkeletonBox({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-md)] bg-line/70 ${className}`}
    />
  )
}

function SkeletonText({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`h-3 animate-pulse rounded-full bg-line/70 ${className}`}
    />
  )
}

function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-[var(--radius-xl)] border border-line bg-surface-elevated p-6 shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="h-12 w-12 animate-pulse rounded-[var(--radius-md)] bg-line/70" />
      <div className="mt-5 h-3 w-16 animate-pulse rounded-full bg-line/70" />
      <div className="mt-3 h-5 w-3/4 animate-pulse rounded-full bg-line/70" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded-full bg-line/60" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-line/60" />
      </div>
      <div className="mt-8 h-3 w-24 animate-pulse rounded-full bg-line/70" />
    </div>
  )
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

function SkeletonContent() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface-elevated shadow-[var(--shadow-card)]">
      <div className="aspect-video w-full animate-pulse bg-line/70" />
      <div className="p-6 sm:p-8">
        <div className="h-6 w-24 animate-pulse rounded-full bg-line/70" />
        <div className="mt-4 h-6 w-2/3 animate-pulse rounded-full bg-line/70" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-line/60" />
          <div className="h-3 w-11/12 animate-pulse rounded-full bg-line/60" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-line/60" />
        </div>
      </div>
      <div className="border-t border-line px-6 py-4 sm:px-8">
        <div className="h-11 w-52 animate-pulse rounded-full bg-line/70" />
      </div>
    </div>
  )
}

const Skeleton = {
  Box: SkeletonBox,
  Text: SkeletonText,
  Card: SkeletonCard,
  Grid: SkeletonGrid,
  Content: SkeletonContent,
}

export default Skeleton
