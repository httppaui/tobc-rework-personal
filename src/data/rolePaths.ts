import type { RoleId } from '../types';

export const ROLE_PATHS: Record<
  RoleId,
  { label: string; links: { label: string; action: string }[] }
> = {
  seafarer: {
    label: 'Seafarer',
    links: [
      { label: 'Browse courses', action: 'courses' },
      { label: 'My bookings', action: 'bookings' },
      { label: 'Certificates', action: 'certificates' },
      { label: 'FAQ & help', action: 'faq' },
    ],
  },
  agency: {
    label: 'Manning agency',
    links: [
      { label: 'Book for crew', action: 'agency-book' },
      { label: 'Compliance tracker', action: 'compliance' },
      { label: 'Partner centers', action: 'partners-training' },
      { label: 'Invoices & billing', action: 'billing' },
    ],
  },
  center: {
    label: 'Training center',
    links: [
      { label: 'Provider dashboard', action: 'provider' },
      { label: 'List schedules', action: 'schedules' },
      { label: 'Payouts', action: 'payouts' },
      { label: 'Partner support', action: 'support' },
    ],
  },
};

export const HERO_VALUE_PROPS: Record<RoleId, string> = {
  seafarer:
    'The Philippines’ trusted marketplace for MARINA-accredited STCW and maritime courses — search real schedules, live seats, and verified centers in one place.',
  agency:
    'One workspace to book crew training, track STCW compliance, and invoice in bulk — tied to MARINA-accredited centers you already trust.',
  center:
    'Fill classes faster: list accredited schedules, sync seat counts, and get paid online — with visibility to 12,400+ active seafarers.',
};
