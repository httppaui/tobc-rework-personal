import { apiRequest } from './api';
import type { BookingRecord } from '../types';

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
      srb: payload.srb,
      mobile: payload.mobile,
      email: payload.email,
      paymentProofName: payload.paymentProofName,
      paymentProofDataUrl: payload.paymentProofDataUrl,
    }),
  });
  return result.ok ? { ok: true, booking: result.data.booking } : { ok: false, error: result.error };
}
