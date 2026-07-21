function SkeletonCard({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[var(--radius-card)] border border-border bg-card ${className}`} />;
}

export default function ReportLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <SkeletonCard className="h-64" />
      <SkeletonCard className="h-56" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} className="h-32" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} className="h-20" />
      ))}
    </div>
  );
}
