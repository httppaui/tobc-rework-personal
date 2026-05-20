import { type ChangeEvent, type ReactNode, useState } from 'react';
import { BookingSummary } from './BookingSummary';
import { useApp } from '../context/AppProvider';
import { createBooking } from '../lib/bookingsApi';
import type { BookingStep } from '../types';

const TIME_SLOTS = ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM', '06:00 PM'];

const BOOKING_STEPS: { num: BookingStep; icon: string; label: string }[] = [
  { num: 1, icon: 'bi-calendar2-check', label: 'Select Schedule' },
  { num: 2, icon: 'bi-person-vcard', label: 'Your Details' },
  { num: 3, icon: 'bi-credit-card', label: 'Review & Pay' },
  { num: 4, icon: 'bi-patch-check-fill', label: 'Confirmation' },
];

export function BookingModal() {
  const { booking, closeBooking, updateBooking, toast, navigateTo, isLoggedIn, openAuthModal } = useApp();
  const [submitting, setSubmitting] = useState(false);
  if (!booking.open) return null;

  const step = booking.step;

  const goStep = (next: BookingStep) => updateBooking({ step: next });

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!booking.scheduleDate || !booking.scheduleTime) {
        toast('Please select a date and time', 'error');
        return false;
      }
    }
    if (step === 2) {
      if (!booking.firstName.trim() || !booking.lastName.trim() || !booking.email.trim()) {
        toast('Please complete your contact details', 'error');
        return false;
      }
    }
    if (step === 3) {
      if (!booking.paymentProofDataUrl) {
        toast('Please upload a screenshot of your payment', 'error');
        return false;
      }
    }
    return true;
  };

  const onNext = async () => {
    if (!validateStep()) return;
    if (step === 3) {
      if (!isLoggedIn) {
        toast('Please log in to submit your booking', 'error');
        openAuthModal('login');
        return;
      }
      setSubmitting(true);
      const result = await createBooking({
        courseId: booking.courseId,
        courseTitle: booking.course,
        provider: booking.provider,
        location: booking.location,
        price: booking.price,
        category: booking.category,
        scheduleDate: booking.scheduleDate,
        scheduleTime: booking.scheduleTime,
        firstName: booking.firstName,
        lastName: booking.lastName,
        srb: booking.srb,
        mobile: booking.mobile,
        email: booking.email,
        paymentProofName: booking.paymentProofName,
        paymentProofDataUrl: booking.paymentProofDataUrl,
      });
      setSubmitting(false);
      if (!result.ok) {
        toast(result.error, 'error');
        return;
      }
      updateBooking({ confirmationId: result.booking.id, step: 4 });
      toast('Booking submitted!', 'success');
      return;
    }
    goStep((step + 1) as BookingStep);
  };

  const onBack = () => {
    if (step > 1) goStep((step - 1) as BookingStep);
  };

  const onPaymentFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image screenshot', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateBooking({
        paymentProofName: file.name,
        paymentProofDataUrl: String(reader.result),
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="booking-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBooking();
      }}
      role="presentation"
    >
      <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="bModalTitle">
        <div className="booking-modal-head">
          <div className="booking-modal-head-start">
            {step > 1 && step < 4 && (
              <button type="button" className="booking-modal-back" onClick={onBack} aria-label="Go back">
                <i className="bi bi-arrow-left" aria-hidden />
              </button>
            )}
            <h3 id="bModalTitle">Book Course</h3>
          </div>
          <button type="button" onClick={closeBooking} aria-label="Close booking">
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        {step < 4 && (
          <div className="booking-price-strip" aria-live="polite">
            <span className="booking-price-strip-course">{booking.course || 'Selected course'}</span>
            <strong className="booking-price-strip-amount">{booking.price || '—'}</strong>
          </div>
        )}
        <p className="booking-trust-strip" role="note">
          MARINA-accredited providers · Secure checkout
        </p>
        <nav className="booking-steps-bar" aria-label="Booking progress">
          <ol className="booking-steps-track">
            {BOOKING_STEPS.flatMap((s, i) => {
              const items: ReactNode[] = [];
              if (i > 0) {
                items.push(
                  <li
                    key={`conn-${s.num}`}
                    className={`bs-connector${step >= s.num ? ' done' : ''}`}
                    aria-hidden
                  />,
                );
              }
              items.push(
                <li
                  key={s.num}
                  className={`bs-step ${step === s.num ? 'active' : step > s.num ? 'done' : 'pending'}`}
                  aria-current={step === s.num ? 'step' : undefined}
                >
                  <span className="bs-step-num">
                    {step > s.num ? <i className="bi bi-check-lg" aria-hidden /> : s.num}
                  </span>
                  <span className="bs-step-icon" aria-hidden>
                    <i className={`bi ${s.icon}`} />
                  </span>
                  <span className="bs-step-label">{s.label}</span>
                </li>,
              );
              return items;
            })}
          </ol>
        </nav>

        <div className="booking-modal-body">
          <div className="booking-form-section">
            {step === 1 && (
              <>
                <h4>Step 1: Select schedule</h4>
                <div className="bf-grid">
                  <div className="bf-field bf-full">
                    <label htmlFor="bf-date">Training date</label>
                    <input
                      id="bf-date"
                      type="date"
                      value={booking.scheduleDate}
                      onChange={(e) => updateBooking({ scheduleDate: e.target.value })}
                    />
                  </div>
                  <div className="bf-field bf-full">
                    <label htmlFor="bf-time">Time slot</label>
                    <select
                      id="bf-time"
                      value={booking.scheduleTime}
                      onChange={(e) => updateBooking({ scheduleTime: e.target.value })}
                    >
                      <option value="">Select time…</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h4>Step 2: Your details</h4>
                <div className="bf-grid">
                  <div className="bf-field">
                    <label htmlFor="bf-first">First Name</label>
                    <input
                      id="bf-first"
                      type="text"
                      value={booking.firstName}
                      onChange={(e) => updateBooking({ firstName: e.target.value })}
                      placeholder="Juan"
                    />
                  </div>
                  <div className="bf-field">
                    <label htmlFor="bf-last">Last Name</label>
                    <input
                      id="bf-last"
                      type="text"
                      value={booking.lastName}
                      onChange={(e) => updateBooking({ lastName: e.target.value })}
                      placeholder="dela Cruz"
                    />
                  </div>
                  <div className="bf-field">
                    <label htmlFor="bf-srb">SRB / Seaman&apos;s Book No.</label>
                    <input
                      id="bf-srb"
                      type="text"
                      value={booking.srb}
                      onChange={(e) => updateBooking({ srb: e.target.value })}
                      placeholder="SRB-XXXXXXX"
                    />
                  </div>
                  <div className="bf-field">
                    <label htmlFor="bf-mobile">Mobile Number</label>
                    <input
                      id="bf-mobile"
                      type="text"
                      value={booking.mobile}
                      onChange={(e) => updateBooking({ mobile: e.target.value })}
                      placeholder="+63 9XX XXX XXXX"
                    />
                  </div>
                  <div className="bf-field bf-full">
                    <label htmlFor="bf-email">Email Address</label>
                    <input
                      id="bf-email"
                      type="email"
                      value={booking.email}
                      onChange={(e) => updateBooking({ email: e.target.value })}
                      placeholder="juan@email.com"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h4>Step 3: Review &amp; payment</h4>
                <p className="booking-pay-instructions">
                  Transfer the total amount to our account, then upload a screenshot of your payment
                  transaction. Booking is confirmed after verification.
                </p>
                <div className="bf-field bf-full">
                  <label htmlFor="bf-payment-proof">Payment screenshot (required)</label>
                  <input
                    id="bf-payment-proof"
                    type="file"
                    accept="image/*"
                    onChange={onPaymentFile}
                  />
                  {booking.paymentProofName && (
                    <p className="payment-proof-name">
                      <i className="bi bi-check-circle-fill" aria-hidden /> {booking.paymentProofName}
                    </p>
                  )}
                  {booking.paymentProofDataUrl && (
                    <img
                      src={booking.paymentProofDataUrl}
                      alt="Payment proof preview"
                      className="payment-proof-preview"
                    />
                  )}
                </div>
              </>
            )}

            {step === 4 && (
              <div className="booking-confirmation">
                <div className="booking-confirmation-icon">
                  <i className="bi bi-check-circle-fill" aria-hidden />
                </div>
                <h4>Booking confirmed</h4>
                <p>Thank you! Your booking request has been received.</p>
                <p className="booking-ref">
                  Reference: <strong>{booking.confirmationId}</strong>
                </p>
                <p className="booking-confirmation-note">
                  We will email you at {booking.email} once the training center verifies your payment.
                </p>
              </div>
            )}
          </div>

          {step < 4 && <BookingSummary booking={booking} showSchedule={step >= 2} />}
        </div>

        <div className="booking-modal-footer">
          {step === 4 ? (
            <>
              <span />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeBooking();
                  navigateTo('courses');
                }}
              >
                Back to courses
              </button>
            </>
          ) : (
            <>
              <div className="booking-footer-left">
                <button type="button" className="btn btn-secondary" onClick={closeBooking}>
                  Cancel
                </button>
                {step > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={onBack}>
                    <i className="bi bi-arrow-left" aria-hidden /> Back
                  </button>
                )}
              </div>
              <button type="button" className="btn btn-primary" onClick={() => void onNext()} disabled={submitting}>
                {step === 3 ? 'Submit booking' : 'Next'}{' '}
                <i className="bi bi-arrow-right" aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
