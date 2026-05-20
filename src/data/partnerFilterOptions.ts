export { COUNTRIES_BY_CONTINENT, type CountryContinent } from './countriesByContinent';
export { PHILIPPINES_REGIONS } from './philippinesRegions';

export const PARTNER_PROFESSIONS = [{ id: 'maritime', label: 'Maritime' }] as const;

export const PARTNER_CATEGORIES = [
  { id: 'business', label: 'Business Partners' },
  { id: 'industry', label: 'Industry Partners' },
] as const;

export const PARTNER_BUSINESS_TYPES = [
  { id: 'training', label: 'Training Center' },
  { id: 'assessment', label: 'Assessment Center' },
  { id: 'pdos', label: 'PDOS Provider' },
  { id: 'review', label: 'Review Center' },
  { id: 'school', label: 'School' },
  { id: 'others', label: 'Others' },
] as const;

/** @deprecated Use PARTNER_BUSINESS_TYPES for business partner sub-types */
export const PARTNER_TYPES = PARTNER_BUSINESS_TYPES;

export const PARTNER_CITIES = [
  { id: 'metro-manila', label: 'Metro Manila' },
  { id: 'metro-cebu', label: 'Metro Cebu' },
  { id: 'metro-davao', label: 'Metro Davao' },
] as const;
