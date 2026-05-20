export type PageId =
  | 'home'
  | 'courses'
  | 'partners'
  | 'about'
  | 'news'
  | 'library'
  | 'wishlist'
  | 'cart'
  | 'messages'
  | 'bookings'
  | 'profile'
  | 'settings'
  | 'help';

export type RoleId = 'seafarer' | 'agency' | 'center';

export type PuzzleKey = 'platform' | 'mission' | 'story' | 'vision';

export interface PuzzlePiece {
  title: string;
  summary: string;
  accent: string;
  body: string;
  /** Google Material Symbols Outlined ligature name */
  icon: string;
}

export type AboutPuzzleData = Record<PuzzleKey, PuzzlePiece>;

export interface ToastItem {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

export type BookingStep = 1 | 2 | 3 | 4;

export interface BookingState {
  open: boolean;
  courseId: string;
  course: string;
  price: string;
  provider: string;
  location: string;
  dates: string;
  duration: string;
  category: string;
  step: BookingStep;
  scheduleDate: string;
  scheduleTime: string;
  firstName: string;
  lastName: string;
  srb: string;
  mobile: string;
  email: string;
  paymentProofName: string;
  paymentProofDataUrl: string;
  confirmationId: string;
}

export type AuthModalMode = 'login' | 'register' | 'book';

export type LegalDoc = 'terms' | 'privacy' | 'cookie' | 'disclaimer' | 'refund' | 'careers' | 'contact';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'email';
}

export interface BookingRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  provider: string;
  location: string;
  price: string;
  category: string;
  scheduleDate: string;
  scheduleTime: string;
  firstName: string;
  lastName: string;
  srb: string;
  mobile: string;
  email: string;
  paymentProofName: string;
  status: string;
  createdAt: string;
}
