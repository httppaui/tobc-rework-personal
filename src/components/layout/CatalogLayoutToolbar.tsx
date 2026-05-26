import type { ReactNode } from 'react';

type CatalogLayoutToolbarProps = {
  onClearFilters: () => void;
  resultsCount: ReactNode;
  viewToggle: ReactNode;
};

export function CatalogLayoutToolbar({
  onClearFilters,
  resultsCount,
  viewToggle,
}: CatalogLayoutToolbarProps) {
  return (
    <div className="courses-layout-toolbar">
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button type="button" className="clear-filters-btn" onClick={onClearFilters}>
          Clear All
        </button>
      </div>
      <div className="results-header">
        <div className="results-count">{resultsCount}</div>
        <div className="results-header-actions">{viewToggle}</div>
      </div>
    </div>
  );
}
