import type { Course } from '../data/courses';
import { getCourseById } from './courseCatalog';
import { DEFAULT_PAYMENT_METHOD_ID } from '../data/paymentMethods';
import type { BookingLineItem, BookingState } from '../types';

export function lineItemFromCourse(course: Course): BookingLineItem {
  return {
    courseId: course.id,
    course: course.title,
    price: course.price,
    priceNum: course.priceNum,
    provider: course.provider,
    location: course.location,
    dates: course.dates,
    duration: course.duration,
    category: course.category,
    scheduleDate: '',
    scheduleTime: '',
  };
}

export function lineItemsFromCourseIds(courseIds: string[]): BookingLineItem[] {
  return courseIds
    .map((id) => getCourseById(id))
    .filter((c): c is Course => Boolean(c))
    .map(lineItemFromCourse);
}

export function bookingTotalLabel(items: BookingLineItem[]): string {
  const total = items.reduce((sum, i) => sum + i.priceNum, 0);
  if (total <= 0) return 'FREE';
  return `₱${total.toLocaleString('en-PH')}`;
}

/** True when every line item is free — payment step is skipped. */
export function allBookingItemsFree(items: BookingLineItem[]): boolean {
  return items.length > 0 && items.every((i) => i.priceNum <= 0);
}

export function bookingTitleLabel(items: BookingLineItem[]): string {
  if (items.length === 0) return 'Selected courses';
  if (items.length === 1) return items[0].course;
  return `${items.length} courses`;
}

export function allSchedulesComplete(items: BookingLineItem[]): boolean {
  return items.length > 0 && items.every((i) => i.scheduleDate.trim() && i.scheduleTime.trim());
}

export function findScheduleDateConflicts(items: BookingLineItem[]): string[] {
  const warnings: string[] = [];
  const byDate = new Map<string, BookingLineItem[]>();
  for (const item of items) {
    if (!item.scheduleDate) continue;
    const list = byDate.get(item.scheduleDate) ?? [];
    list.push(item);
    byDate.set(item.scheduleDate, list);
  }
  for (const [, sameDay] of byDate) {
    if (sameDay.length > 1) {
      const names = sameDay.map((i) => i.course).join(', ');
      warnings.push(`Multiple courses on ${sameDay[0].scheduleDate}: ${names}. Confirm times do not overlap.`);
    }
  }
  return warnings;
}

export function patchBookingItem(
  items: BookingLineItem[],
  courseId: string,
  patch: Partial<BookingLineItem>,
): BookingLineItem[] {
  return items.map((item) => (item.courseId === courseId ? { ...item, ...patch } : item));
}

/** Local confirmation refs when sign-in or API is unavailable. */
export function guestConfirmationIds(items: BookingLineItem[]): string[] {
  const stamp = Date.now().toString(36).toUpperCase();
  return items.map((_, index) => `DEMO-${stamp}-${index + 1}`);
}

export function emptyBookingState(step: BookingState['step'] = 1): Omit<BookingState, 'open'> {
  return {
    items: [],
    step,
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    paymentMethodId: DEFAULT_PAYMENT_METHOD_ID,
    paymentProofName: '',
    paymentProofDataUrl: '',
    confirmationIds: [],
  };
}
