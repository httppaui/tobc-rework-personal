import type { PageId } from '../types';

export const PAGE_PATHS: Record<PageId, string> = {
  home: '/home',
  courses: '/courses',
  partners: '/partners',
  about: '/about',
  news: '/news',
  library: '/library',
  wishlist: '/wishlist',
  cart: '/cart',
  messages: '/messages',
  bookings: '/bookings',
  'booked-courses': '/booked-courses',
  profile: '/profile',
  settings: '/settings',
  help: '/help',
};

export function pageFromPath(pathname: string): PageId {
  const segment = pathname.replace(/^\//, '').split('/')[0] || 'home';
  if (segment in PAGE_PATHS) return segment as PageId;
  return 'home';
}
