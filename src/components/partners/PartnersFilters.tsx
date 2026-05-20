import { useState, type ReactNode } from 'react';
import {
  COUNTRIES_BY_CONTINENT,
  PARTNER_BUSINESS_TYPES,
  PARTNER_CATEGORIES,
  PARTNER_CITIES,
  PARTNER_PROFESSIONS,
  PHILIPPINES_REGIONS,
} from '../../data/partnerFilterOptions';
import { PARTNERS } from '../../data/partners';
import type { PartnerSidebarFilters } from '../../lib/partnerFilters';
import { toggleInList } from '../../lib/partnerFilters';

type FilterGroupProps = {
  title: string;
  defaultOpen?: boolean;
  scroll?: 'sm' | 'lg';
  children: ReactNode;
};

function FilterGroup({ title, defaultOpen = false, scroll, children }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const scrollClass = scroll ? ` filter-group-body--scroll-${scroll}` : '';

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
      <div className={`filter-group-body${scrollClass}`}>{children}</div>
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

function countByCategory(value: string): number {
  return PARTNERS.filter((p) => p.category === value).length;
}

function countByBusinessType(value: string): number {
  return PARTNERS.filter((p) => p.category === 'business' && p.type === value).length;
}

function countBy(key: 'profession' | 'country' | 'region' | 'city', value: string): number {
  return PARTNERS.filter((p) => p[key] === value).length;
}

type PartnersFiltersProps = {
  filters: PartnerSidebarFilters;
  onFiltersChange: (next: PartnerSidebarFilters) => void;
  onClear: () => void;
};

export function PartnersFilters({ filters, onFiltersChange, onClear }: PartnersFiltersProps) {
  const patch = (partial: Partial<PartnerSidebarFilters>) => {
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

        <div className="sidebar-filters-scroll">
          <FilterGroup title="Partner Category" defaultOpen>
            {PARTNER_CATEGORIES.map(({ id, label }) => (
              <FilterCheckbox
                key={id}
                label={label}
                count={countByCategory(id)}
                checked={filters.categories.includes(id)}
                onChange={(checked) =>
                  patch({ categories: toggleInList(filters.categories, id, checked) })
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Business Partner Type" defaultOpen>
            {PARTNER_BUSINESS_TYPES.map(({ id, label }) => (
              <FilterCheckbox
                key={id}
                label={label}
                count={countByBusinessType(id) || undefined}
                checked={filters.types.includes(id)}
                onChange={(checked) =>
                  patch({ types: toggleInList(filters.types, id, checked) })
                }
              />
            ))}
            {filters.types.includes('others') && (
              <div className="filter-others-specify">
                <label className="visually-hidden" htmlFor="partnerOthersSpecify">
                  Specify other business partner type
                </label>
                <input
                  id="partnerOthersSpecify"
                  type="text"
                  className="price-input"
                  placeholder="Specify other type…"
                  value={filters.othersSpecify}
                  onChange={(e) => patch({ othersSpecify: e.target.value })}
                />
              </div>
            )}
          </FilterGroup>

          <FilterGroup title="Profession">
            {PARTNER_PROFESSIONS.map(({ id, label }) => (
              <FilterCheckbox
                key={id}
                label={label}
                count={countBy('profession', id)}
                checked={filters.professions.includes(id)}
                onChange={(checked) =>
                  patch({ professions: toggleInList(filters.professions, id, checked) })
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Country" scroll="lg">
            {COUNTRIES_BY_CONTINENT.map((continent) => (
              <div key={continent.id} className="filter-continent-block">
                <div className="filter-continent-label">{continent.label}</div>
                {continent.countries.map((country) => (
                  <FilterCheckbox
                    key={country.id}
                    label={country.label}
                    count={countBy('country', country.id) || undefined}
                    checked={filters.countries.includes(country.id)}
                    onChange={(checked) =>
                      patch({ countries: toggleInList(filters.countries, country.id, checked) })
                    }
                  />
                ))}
              </div>
            ))}
          </FilterGroup>

          <FilterGroup title="Region" scroll="sm">
            {PHILIPPINES_REGIONS.map(({ id, label }) => (
              <FilterCheckbox
                key={id}
                label={label}
                count={countBy('region', id) || undefined}
                checked={filters.regions.includes(id)}
                onChange={(checked) =>
                  patch({ regions: toggleInList(filters.regions, id, checked) })
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="City">
            {PARTNER_CITIES.map(({ id, label }) => (
              <FilterCheckbox
                key={id}
                label={label}
                count={countBy('city', id)}
                checked={filters.cities.includes(id)}
                onChange={(checked) =>
                  patch({ cities: toggleInList(filters.cities, id, checked) })
                }
              />
            ))}
          </FilterGroup>
        </div>
      </div>
    </aside>
  );
}
