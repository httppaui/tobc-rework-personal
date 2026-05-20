import type { BookingState } from '../types';

type BookingSummaryProps = {
  booking: BookingState;
  showSchedule?: boolean;
  /** Step 4 review: centered card in modal (see `.booking-modal-body--confirm-review`) */
  variant?: 'sidebar' | 'confirmReview';
};

export function BookingSummary({ booking, showSchedule = true, variant = 'sidebar' }: BookingSummaryProps) {
  const schedule =
    booking.scheduleDate && booking.scheduleTime
      ? `${booking.scheduleDate} · ${booking.scheduleTime}`
      : booking.scheduleDate || '—';

  return (
    <aside
      className={`booking-summary${variant === 'confirmReview' ? ' booking-summary--confirm-review' : ''}`}
    >
      <div className="bs-label">Booking Summary</div>
      <div className="bs-course-name">{booking.course}</div>
      <div className="bs-row">
        <span>Training Center</span>
        <span>{booking.provider}</span>
      </div>
      <div className="bs-row">
        <span>Location</span>
        <span>{booking.location}</span>
      </div>
      {showSchedule && (
        <div className="bs-row">
          <span>Schedule</span>
          <span>{schedule}</span>
        </div>
      )}
      <div className="bs-row">
        <span>Duration</span>
        <span>{booking.duration}</span>
      </div>
      <div className="bs-row">
        <span>Category</span>
        <span>{booking.category}</span>
      </div>
      <div className="bs-total">
        <span>Total</span>
        <span>{booking.price}</span>
      </div>
    </aside>
  );
}
