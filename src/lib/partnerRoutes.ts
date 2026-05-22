import { PARTNERS } from '../data/partners';
import { PAGE_PATHS } from './routes';
import { DEFAULT_PARTNER_FILTERS, type PartnerSidebarFilters } from './partnerFilters';

export type PartnerCategoryFilter = 'business' | 'industry';

export type PartnerFiltersFromUrl = {
  toolbarCategory: string;
  toolbarType: string;
  sidebar: PartnerSidebarFilters;
};

function normalizePartnerType(type: string): string {
  if (type === 'review') return 'review';
  return type;
}

/** Build a Partners page path with optional category / type / partner filters. */
export function partnersUrl(opts?: {
  category?: PartnerCategoryFilter;
  type?: string;
  partner?: string;
}): string {
  const q = new URLSearchParams();
  if (opts?.category) q.set('category', opts.category);
  if (opts?.type) q.set('type', opts.type);
  if (opts?.partner) q.set('partner', opts.partner);
  const search = q.toString();
  return search ? `${PAGE_PATHS.partners}?${search}` : PAGE_PATHS.partners;
}

/** Map `?category=`, `?type=`, and `?partner=` to toolbar + sidebar filter state. */
export function partnerFiltersFromSearchParams(params: URLSearchParams): PartnerFiltersFromUrl {
  const partnerId = params.get('partner');
  const rawType = params.get('type');
  const cat = params.get('category');

  if (partnerId && PARTNERS.some((p) => p.id === partnerId)) {
    return {
      toolbarCategory: 'industry',
      toolbarType: 'all',
      sidebar: {
        ...DEFAULT_PARTNER_FILTERS,
        categories: ['industry'],
        types: [],
      },
    };
  }

  if (rawType) {
    const type = normalizePartnerType(rawType);
    return {
      toolbarCategory: 'business',
      toolbarType: type,
      sidebar: {
        ...DEFAULT_PARTNER_FILTERS,
        categories: ['business'],
        types: [type],
        othersSpecify: '',
      },
    };
  }

  if (cat === 'business' || cat === 'industry') {
    return {
      toolbarCategory: cat,
      toolbarType: 'all',
      sidebar: {
        ...DEFAULT_PARTNER_FILTERS,
        categories: [cat],
        types: [],
        othersSpecify: '',
      },
    };
  }

  return {
    toolbarCategory: 'all',
    toolbarType: 'all',
    sidebar: { ...DEFAULT_PARTNER_FILTERS },
  };
}
