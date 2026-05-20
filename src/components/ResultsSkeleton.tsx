type SkeletonVariant = 'courses-grid' | 'courses-list' | 'partners' | 'partners-list';

type ResultsSkeletonProps = {
  variant: SkeletonVariant;
  count?: number;
};

export function ResultsSkeleton({ variant, count = 6 }: ResultsSkeletonProps) {
  if (variant === 'partners' || variant === 'partners-list') {
    const listClass = variant === 'partners-list' ? 'partners-list-view' : 'partners-grid';
    return (
      <div className={`${listClass} results-skeleton`} aria-busy="true" aria-label="Loading partners">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`skeleton-partner-card${variant === 'partners-list' ? ' skeleton-partner-card--list' : ''}`}
          />
        ))}
      </div>
    );
  }

  const gridClass =
    variant === 'courses-list'
      ? 'courses-list-view results-skeleton'
      : 'courses-grid-view results-skeleton';

  return (
    <div className={gridClass} aria-busy="true" aria-label="Loading courses">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`skeleton-course-card${variant === 'courses-list' ? ' skeleton-course-card--list' : ''}`}
        />
      ))}
    </div>
  );
}
