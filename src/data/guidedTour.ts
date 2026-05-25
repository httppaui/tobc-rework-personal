import type { PageId } from '../types';

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourStep {
  id: string;
  /** `data-tour` value on desktop */
  target: string;
  /** Optional `data-tour` when target is hidden on small screens */
  targetMobile?: string;
  title: string;
  body: string;
  placement: TourPlacement;
  /** Open this page when the step becomes active */
  page?: PageId;
  /** Scroll the target into view before measuring the spotlight */
  scrollIntoView?: boolean;
  /** Allow clicking/typing inside the highlighted target (e.g. form fields) */
  interactive?: boolean;
}

/** Checklist shown on the welcome screen before the spotlight tour */
export const TOUR_WELCOME_CHECKLIST = [
  'Pick your role for tailored shortcuts and copy',
  'Search from the header or home hero by keyword, provider, and date',
  'Save favorites, add to cart, and book in a few steps',
  'Use Help anytime for FAQ, chat, and contact options',
] as const;

export const GUIDED_TOUR_STEPS: TourStep[] = [
  {
    id: 'role',
    target: 'role-tabs',
    targetMobile: 'mobile-nav',
    title: 'Choose your role',
    body: 'Switch between Seafarer, Manning Agency, or Training Center. Home shortcuts and messaging adapt to the role you pick.',
    placement: 'bottom',
  },
  {
    id: 'search',
    target: 'search',
    title: 'Search every course',
    body: 'This bar is always available. Type a course name, port, or category, then press Enter or Search to jump to matching results.',
    placement: 'bottom',
  },
  {
    id: 'courses',
    target: 'courses-nav',
    targetMobile: 'mobile-courses',
    title: 'Browse by category',
    body: 'Open Courses for STCW, assessments, TESDA/PDOS, and more. Partners lists accredited training centers you can compare.',
    placement: 'bottom',
  },
  {
    id: 'wishlist',
    target: 'wishlist',
    title: 'Save to wishlist',
    body: 'Heart a course to revisit it later. Your wishlist stays on this device until you sign in and sync an account.',
    placement: 'bottom',
  },
  {
    id: 'cart',
    target: 'cart',
    title: 'Cart & checkout',
    body: 'Add courses to your cart, then review schedules, seats, and payment in the guided booking flow.',
    placement: 'bottom',
  },
  {
    id: 'help',
    target: 'help-fab',
    title: 'Help is one tap away',
    body: 'Open the orange help button for the Help Center, FAQ, live chat hours, email, and phone support.',
    placement: 'left',
  },
  {
    id: 'hero-search',
    target: 'hero-search',
    page: 'home',
    scrollIntoView: true,
    interactive: true,
    title: 'Detailed home search',
    body: 'Try the filters here — course or keyword, training provider, category, and schedule date. Press Search to jump to matching courses on the Courses page.',
    placement: 'top',
  },
];

export function resolveTourTarget(step: TourStep): HTMLElement | null {
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  const key = mobile && step.targetMobile ? step.targetMobile : step.target;
  return document.querySelector<HTMLElement>(`[data-tour="${key}"]`);
}
