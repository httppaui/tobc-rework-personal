import type { Course } from '../data/courses';

export type SidebarFilters = {
  professions: string[];
  categories: string[];
  providers: string[];
  locations: string[];
  priceRange: string;
  dateFrom: string;
  dateTo: string;
};

export const DEFAULT_SIDEBAR_FILTERS: SidebarFilters = {
  professions: ['maritime'],
  categories: [],
  providers: [],
  locations: [],
  priceRange: '',
  dateFrom: '',
  dateTo: '',
};

const PROVIDER_MATCH: Record<string, (p: string) => boolean> = {
  'far-east': (p) => p.includes('Far East Maritime'),
  msat: (p) => p.includes('MSAT Philippines'),
  nautilus: (p) => p.includes('Nautilus Pacific'),
  compass: (p) => p.includes('Compass Training Center'),
  sti: (p) => p.includes('STI Maritime'),
  mariana: (p) => p.includes('Mariana Academy'),
  united: (p) => p.includes('United Marine'),
};

const LOCATION_LOCS: Record<string, string[]> = {
  'metro-manila': ['manila', 'pasay'],
  cebu: ['cebu'],
  davao: ['davao'],
  bataan: ['bataan'],
  cavite: ['cavite'],
  online: ['online'],
};

function matchesPriceRange(priceNum: number, range: string): boolean {
  if (!range) return true;
  if (range === 'free') return priceNum === 0;
  if (range === '0-3000') return priceNum > 0 && priceNum <= 3000;
  if (range === '3000-8000') return priceNum > 3000 && priceNum <= 8000;
  if (range === '8000-20000') return priceNum > 8000 && priceNum <= 20000;
  if (range === '20000+') return priceNum > 20000;
  return true;
}

function matchesCategory(course: Course, cat: string): boolean {
  if (cat === 'others') {
    return !['stcw', 'non-stcw', 'assessment', 'tesda'].includes(course.cat);
  }
  return course.cat === cat;
}

export type CourseFilterParams = {
  searchQ: string;
  toolbarCategory: string;
  toolbarLocation: string;
  sidebar: SidebarFilters;
};

export function filterCourses(courses: Course[], params: CourseFilterParams): Course[] {
  const q = params.searchQ.trim().toLowerCase();
  const { sidebar, toolbarCategory, toolbarLocation } = params;

  const activeCategories =
    sidebar.categories.length > 0
      ? sidebar.categories
      : toolbarCategory
        ? [toolbarCategory]
        : [];

  const activeLocations =
    sidebar.locations.length > 0
      ? sidebar.locations
      : toolbarLocation
        ? [toolbarLocation]
        : [];

  return courses.filter((course) => {
    if (q) {
      const hay = `${course.title} ${course.provider} ${course.location}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (sidebar.professions.length > 0) {
      const tags = course.professions ?? ['maritime'];
      if (!sidebar.professions.some((p) => tags.includes(p))) return false;
    }

    if (activeCategories.length > 0) {
      if (!activeCategories.some((cat) => matchesCategory(course, cat))) return false;
    }

    if (sidebar.providers.length > 0) {
      const match = sidebar.providers.some((key) => PROVIDER_MATCH[key]?.(course.provider));
      if (!match) return false;
    }

    if (activeLocations.length > 0) {
      const match = activeLocations.some((key) => {
        const locs = LOCATION_LOCS[key];
        if (locs) return locs.includes(course.loc);
        return course.loc === key;
      });
      if (!match) return false;
    }

    if (!matchesPriceRange(course.priceNum, sidebar.priceRange)) return false;

    return true;
  });
}

export function toggleInList(list: string[], value: string, checked: boolean): string[] {
  if (checked) return list.includes(value) ? list : [...list, value];
  return list.filter((v) => v !== value);
}
