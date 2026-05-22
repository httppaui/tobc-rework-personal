import { bookingTotalLabel } from '../lib/booking';
import type { BookingState } from '../types';

type BookingSummaryProps = {
  booking: BookingState;
  showSchedule?: boolean;
  variant?: 'sidebar' | 'confirmReview';
};

export function BookingSummary({ booking, showSchedule = true, variant = 'sidebar' }: BookingSummaryProps) {
  const { items } = booking;
  const collapsible = items.length > 1;
  const compact = collapsible && !showSchedule;

  return (
    <aside
      className={`booking-summary${variant === 'confirmReview' ? ' booking-summary--confirm-review' : ''}${
        collapsible ? ' booking-summary--collapsible' : ''
      }${compact ? ' booking-summary--compact' : ''}`}
    >
      <div className="bs-label">Booking Summary</div>

      {compact ? (
        <ul className="bs-item-list bs-item-list--compact">
          {items.map((item) => (
            <li key={item.courseId} className="bs-item-compact">
              <span className="bs-item-compact-title">{item.course}</span>
              <span className="bs-item-compact-price">{item.price}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="bs-item-list">
          {items.map((item, index) => {
            const schedule =
              item.scheduleDate && item.scheduleTime
                ? `${item.scheduleDate} · ${item.scheduleTime}`
                : showSchedule
                  ? 'Schedule pending'
                  : item.dates;
            const defaultOpen = !collapsible || index === 0;

            const body = (
              <div className="bs-item-body">
                <div className="bs-row">
                  <span>Center</span>
                  <span>{item.provider}</span>
                </div>
                <div className="bs-row">
                  <span>Location</span>
                  <span>{item.location}</span>
                </div>
                {showSchedule && (
                  <div className="bs-row">
                    <span>Schedule</span>
                    <span>{schedule}</span>
                  </div>
                )}
                <div className="bs-row bs-row--price">
                  <span>Fee</span>
                  <span>{item.price}</span>
                </div>
              </div>
            );

            if (!collapsible) {
              return (
                <li key={item.courseId} className="bs-item">
                  <div className="bs-item-title">{item.course}</div>
                  {body}
                </li>
              );
            }

            return (
              <li key={item.courseId} className="bs-item">
                <details className="bs-item-details" open={defaultOpen}>
                  <summary className="bs-item-summary">
                    <span className="bs-item-summary-text">
                      <span className="bs-item-title">{item.course}</span>
                      <span className="bs-item-summary-hint">
                        {showSchedule ? schedule : item.location}
                      </span>
                    </span>
                    <span className="bs-item-summary-price">{item.price}</span>
                    <i className="bi bi-chevron-down bs-item-chevron" aria-hidden />
                  </summary>
                  {body}
                </details>
              </li>
            );
          })}
        </ul>
      )}

      {items.length > 1 && (
        <div className="bs-meta-row">
          <span>Courses</span>
          <span>{items.length}</span>
        </div>
      )}
      <div className="bs-total">
        <span>Total</span>
        <span>{bookingTotalLabel(items)}</span>
      </div>
    </aside>
  );
}
