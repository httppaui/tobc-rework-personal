import { apiRequest } from './api';
import type { BookingLineItem, BookingRecord } from '../types';

export type BookingContact = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  paymentProofName?: string;
  paymentProofDataUrl?: string;
};

export async function fetchBookings(): Promise<BookingRecord[]> {
  const result = await apiRequest<{ bookings: BookingRecord[] }>('/api/bookings');
  return result.ok ? result.data.bookings : [];
}

export async function createBooking(
  payload: Omit<BookingRecord, 'id' | 'status' | 'createdAt'> & {
    paymentProofDataUrl?: string;
  },
): Promise<{ ok: true; booking: BookingRecord } | { ok: false; error: string }> {
  const result = await apiRequest<{ booking: BookingRecord }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      courseId: payload.courseId,
      courseTitle: payload.courseTitle,
      provider: payload.provider,
      location: payload.location,
      price: payload.price,
      category: payload.category,
      scheduleDate: payload.scheduleDate,
      scheduleTime: payload.scheduleTime,
      firstName: payload.firstName,
      lastName: payload.lastName,
      mobile: payload.mobile,
      email: payload.email,
      paymentProofName: payload.paymentProofName,
      paymentProofDataUrl: payload.paymentProofDataUrl,
    }),
  });
  return result.ok ? { ok: true, booking: result.data.booking } : { ok: false, error: result.error };
}

export async function createBookingsBatch(
  contact: BookingContact,
  items: BookingLineItem[],
): Promise<
  | { ok: true; bookings: BookingRecord[] }
  | { ok: false; error: string; bookings: BookingRecord[] }
> {
  const created: BookingRecord[] = [];
  for (const item of items) {
    const result = await createBooking({
      courseId: item.courseId,
      courseTitle: item.course,
      provider: item.provider,
      location: item.location,
      price: item.price,
      category: item.category,
      scheduleDate: item.scheduleDate,
      scheduleTime: item.scheduleTime,
      firstName: contact.firstName,
      lastName: contact.lastName,
      mobile: contact.mobile,
      email: contact.email,
      paymentProofName: contact.paymentProofName ?? '',
      paymentProofDataUrl: contact.paymentProofDataUrl,
    });
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
        bookings: created,
      };
    }
    created.push(result.booking);
  }
  return { ok: true, bookings: created };
}
