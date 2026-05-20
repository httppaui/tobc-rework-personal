import { PARTNERS, type Partner } from './partners';

/** Plural labels for the Partners nav business submenu */
export const PARTNER_BUSINESS_NAV = [
  { type: 'training', label: 'Training Centers' },
  { type: 'assessment', label: 'Assessment Centers' },
  { type: 'review', label: 'Review Centers' },
  { type: 'school', label: 'Schools' },
  { type: 'pdos', label: 'PDOS Providers' },
  { type: 'others', label: 'Others' },
] as const;

export const INDUSTRY_PARTNERS_NAV = PARTNERS.filter((p) => p.category === 'industry');

export function partnerNavLabel(partner: Pick<Partner, 'name'>): string {
  const acronym = partner.name.match(/^\(([^)]+)\)/);
  if (acronym) return acronym[1];
  if (partner.name.length <= 42) return partner.name;
  return `${partner.name.slice(0, 39)}…`;
}
