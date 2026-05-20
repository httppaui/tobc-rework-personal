export { COUNTRIES_BY_CONTINENT, type CountryContinent } from './countriesByContinent';
export { PHILIPPINES_REGIONS } from './philippinesRegions';

export const PARTNER_PROFESSIONS = [{ id: 'maritime', label: 'Maritime' }] as const;

export const PARTNER_TYPES = [
  { id: 'training', label: 'Training Center' },
  { id: 'school', label: 'School' },
  { id: 'assessment', label: 'Assessment Center' },
  { id: 'pdos', label: 'PDOS Reviewer' },
  { id: 'others', label: 'Others (specify)' },
] as const;

export const PARTNER_CITIES = [
  { id: 'metro-manila', label: 'Metro Manila' },
  { id: 'metro-cebu', label: 'Metro Cebu' },
  { id: 'metro-davao', label: 'Metro Davao' },
] as const;
