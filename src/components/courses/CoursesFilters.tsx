import { useState, type ReactNode } from 'react';
import type { SidebarFilters } from '../../lib/courseFilters';
import { toggleInList } from '../../lib/courseFilters';

type FilterGroupProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function FilterGroup({ title, defaultOpen = false, children }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`filter-group${open ? ' open' : ''}`}>
      <button
        type="button"
        className="filter-group-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <i className="bi bi-chevron-down filter-group-chevron" aria-hidden />
      </button>
      <div className="filter-group-body">{children}</div>
    </div>
  );
}

type FilterCheckboxProps = {
  label: string;
  count?: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function FilterCheckbox({ label, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="filter-option">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="filter-option-text">{label}</span>
      {count !== undefined && <span className="filter-count">{count}</span>}
    </label>
  );
}

type CoursesFiltersProps = {
  filters: SidebarFilters;
  onFiltersChange: (next: SidebarFilters) => void;
  onClear: () => void;
};

export function CoursesFilters({ filters, onFiltersChange, onClear }: CoursesFiltersProps) {
  const patch = (partial: Partial<SidebarFilters>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-sticky">
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button type="button" className="clear-filters-btn" onClick={onClear}>
            Clear All
          </button>
        </div>

        <div className="active-filters" id="activeFilters" />

        <div className="sidebar-filters-scroll">
        <FilterGroup title="Profession" defaultOpen>
          <FilterCheckbox
            label="Maritime"
            count={312}
            checked={filters.professions.includes('maritime')}
            onChange={(checked) =>
              patch({ professions: toggleInList(filters.professions, 'maritime', checked) })
            }
          />
          <FilterCheckbox
            label="Offshore"
            count={24}
            checked={filters.professions.includes('offshore')}
            onChange={(checked) =>
              patch({ professions: toggleInList(filters.professions, 'offshore', checked) })
            }
          />
          <FilterCheckbox
            label="Cruise Industry"
            count={8}
            checked={filters.professions.includes('cruise')}
            onChange={(checked) =>
              patch({ professions: toggleInList(filters.professions, 'cruise', checked) })
            }
          />
        </FilterGroup>

        <FilterGroup title="Category" defaultOpen>
          <FilterCheckbox
            label="STCW"
            count={198}
            checked={filters.categories.includes('stcw')}
            onChange={(checked) =>
              patch({ categories: toggleInList(filters.categories, 'stcw', checked) })
            }
          />
          <FilterCheckbox
            label="Non-STCW"
            count={72}
            checked={filters.categories.includes('non-stcw')}
            onChange={(checked) =>
              patch({ categories: toggleInList(filters.categories, 'non-stcw', checked) })
            }
          />
          <FilterCheckbox
            label="Assessment"
            count={24}
            checked={filters.categories.includes('assessment')}
            onChange={(checked) =>
              patch({ categories: toggleInList(filters.categories, 'assessment', checked) })
            }
          />
          <FilterCheckbox
            label="TESDA"
            count={14}
            checked={filters.categories.includes('tesda')}
            onChange={(checked) =>
              patch({ categories: toggleInList(filters.categories, 'tesda', checked) })
            }
          />
          <FilterCheckbox
            label="Others"
            count={12}
            checked={filters.categories.includes('others')}
            onChange={(checked) =>
              patch({ categories: toggleInList(filters.categories, 'others', checked) })
            }
          />
        </FilterGroup>

        <FilterGroup title="Providers">
          {(
            [
              ['far-east', 'Far East Maritime Foundation', 48],
              ['msat', 'MSAT Philippines', 32],
              ['nautilus', 'Nautilus Pacific Maritime', 28],
              ['compass', 'Compass Training Center', 22],
              ['sti', 'STI Maritime Academy', 19],
              ['mariana', 'Mariana Academy', 15],
              ['united', 'United Marine Training', 14],
            ] as const
          ).map(([key, label, count]) => (
            <FilterCheckbox
              key={key}
              label={label}
              count={count}
              checked={filters.providers.includes(key)}
              onChange={(checked) =>
                patch({ providers: toggleInList(filters.providers, key, checked) })
              }
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Course Fee Range">
          <div className="price-range-wrap">
            {(
              [
                ['free', 'Free'],
                ['0-3000', '₱0 – ₱3,000'],
                ['3000-8000', '₱3,000 – ₱8,000'],
                ['8000-20000', '₱8,000 – ₱20,000'],
                ['20000+', '₱20,000+'],
                ['', 'Any Price'],
              ] as const
            ).map(([value, label]) => (
              <label key={value || 'any'} className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value={value}
                  checked={filters.priceRange === value}
                  onChange={() => patch({ priceRange: value })}
                />
                <span className="filter-option-text">{label}</span>
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Schedule Date">
          <div className="sf">
            <label style={{ fontSize: 12, color: 'var(--muted)' }}>From</label>
            <input
              type="date"
              className="price-input"
              value={filters.dateFrom}
              onChange={(e) => patch({ dateFrom: e.target.value })}
            />
          </div>
          <div className="sf" style={{ marginTop: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)' }}>To</label>
            <input
              type="date"
              className="price-input"
              value={filters.dateTo}
              onChange={(e) => patch({ dateTo: e.target.value })}
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Location">
          {(
            [
              ['metro-manila', 'Metro Manila', 148],
              ['cebu', 'Cebu City', 42],
              ['davao', 'Davao', 18],
              ['bataan', 'Bataan', 14],
              ['cavite', 'Cavite', 12],
              ['online', 'Online', 22],
            ] as const
          ).map(([key, label, count]) => (
            <FilterCheckbox
              key={key}
              label={label}
              count={count}
              checked={filters.locations.includes(key)}
              onChange={(checked) =>
                patch({ locations: toggleInList(filters.locations, key, checked) })
              }
            />
          ))}
        </FilterGroup>
        </div>
      </div>
    </aside>
  );
}
