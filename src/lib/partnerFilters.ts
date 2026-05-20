import type { Partner } from '../data/partners';

export type PartnerSidebarFilters = {
  professions: string[];
  types: string[];
  othersSpecify: string;
  countries: string[];
  regions: string[];
  cities: string[];
};

export const DEFAULT_PARTNER_FILTERS: PartnerSidebarFilters = {
  professions: [],
  types: [],
  othersSpecify: '',
  countries: [],
  regions: [],
  cities: [],
};

export function toggleInList(list: string[], value: string, checked: boolean): string[] {
  if (checked) return list.includes(value) ? list : [...list, value];
  return list.filter((v) => v !== value);
}

function matchesList(selected: string[], value: string): boolean {
  return selected.length === 0 || selected.includes(value);
}

export function filterPartners(
  partners: Partner[],
  opts: { searchQ: string; toolbarType: string; sidebar: PartnerSidebarFilters },
): Partner[] {
  const q = opts.searchQ.trim().toLowerCase();
  const { sidebar } = opts;

  return partners.filter((p) => {
    if (opts.toolbarType && opts.toolbarType !== 'all' && p.type !== opts.toolbarType) return false;
    if (!matchesList(sidebar.professions, p.profession)) return false;
    if (!matchesList(sidebar.types, p.type)) return false;
    if (!matchesList(sidebar.countries, p.country)) return false;
    if (!matchesList(sidebar.regions, p.region)) return false;
    if (!matchesList(sidebar.cities, p.city)) return false;

    if (sidebar.types.includes('others') && sidebar.othersSpecify.trim()) {
      const needle = sidebar.othersSpecify.trim().toLowerCase();
      const hay = `${p.othersSpecify ?? ''} ${p.typeLabel} ${p.name}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }

    if (q) {
      const hay = `${p.name} ${p.description} ${p.typeLabel}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });
}
