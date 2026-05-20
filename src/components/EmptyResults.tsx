type EmptyResultsProps = {
  iconClass?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyResults({
  iconClass = 'bi-search',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyResultsProps) {
  return (
    <div className="empty-results" role="status">
      <div className="empty-results-icon" aria-hidden>
        <i className={`bi ${iconClass}`} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
