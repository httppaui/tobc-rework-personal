import { type ReactNode, useEffect, useState } from 'react';
import { BookingSummary } from './BookingSummary';
import { useApp } from '../context/AppProvider';
import { mergeBookingContactFromUser } from '../lib/userName';
import {
  allBookingItemsFree,
  allSchedulesComplete,
  bookingTitleLabel,
  bookingTotalLabel,
  findScheduleDateConflicts,
} from '../lib/booking';
import { BookingPaymentStep } from './BookingPaymentStep';
import { createBookingsBatch } from '../lib/bookingsApi';
import { DEFAULT_PAYMENT_METHOD_ID } from '../data/paymentMethods';
import type { BookingStep, PaymentMethodId } from '../types';

function RequiredMark() {
  return (
    <span className="bf-required" aria-hidden="true">
      {' '}
      *
    </span>
  );
}

const TIME_SLOTS = ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM', '06:00 PM'];

const BOOKING_STEPS: { num: BookingStep; icon: string; label: string }[] = [
  { num: 1, icon: 'bi-list-check', label: 'Review' },
  { num: 2, icon: 'bi-person-vcard', label: 'Your Details' },
  { num: 3, icon: 'bi-calendar2-check', label: 'Schedules' },
  { num: 4, icon: 'bi-credit-card', label: 'Payment' },
  { num: 5, icon: 'bi-patch-check-fill', label: 'Confirmation' },
];

export function BookingModal() {
  const {
    booking,
    closeBooking,
    updateBooking,
    updateBookingItem,
    toast,
    navigateTo,
    isLoggedIn,
    openAuthModal,
    addNotification,
    removeFromCart,
    user,
  } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const open = booking.open;
  const { items, step } = booking;
  const allFree = allBookingItemsFree(items);

  useEffect(() => {
    if (!open || step !== 2 || !user) return;
    const contact = mergeBookingContactFromUser(booking, user);
    if (
      contact.firstName === booking.firstName &&
      contact.lastName === booking.lastName &&
      contact.email === booking.email
    ) {
      return;
    }
    updateBooking(contact);
  }, [open, step, user, booking.firstName, booking.lastName, booking.email, updateBooking]);

  useEffect(() => {
    if (!open || !allFree || step !== 4) return;
    updateBooking({ step: 5 });
  }, [open, allFree, step, updateBooking]);

  if (!open) return null;

  if (items.length === 0) {
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
            <h3 id="bModalTitle">Checkout</h3>
            <button type="button" onClick={closeBooking} aria-label="Close booking">
              <i className="bi bi-x-lg" aria-hidden />
            </button>
          </div>
          <div className="booking-modal-body booking-modal-body--empty">
            <p>No courses in this checkout. Add courses to your cart and try again.</p>
            <button type="button" className="btn btn-primary" onClick={() => { closeBooking(); navigateTo('cart'); }}>
              Back to cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  const multi = items.length > 1;
  const confirmationComplete = step === 5 && booking.confirmationIds.length > 0;
  const scheduleWarnings = step === 3 ? findScheduleDateConflicts(items) : [];

  const goStep = (next: BookingStep) => updateBooking({ step: next });

  const nextStepAfter = (current: BookingStep): BookingStep => {
    if (current === 3 && allFree) return 5;
    if (current === 4) return 5;
    return (current + 1) as BookingStep;
  };

  const prevStepBefore = (current: BookingStep): BookingStep => {
    if (current === 5 && allFree) return 3;
    return (current - 1) as BookingStep;
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (items.length === 0) {
        toast('No courses selected', 'error');
        return false;
      }
    }
    if (step === 2) {
      if (
        !booking.firstName.trim() ||
        !booking.lastName.trim() ||
        !booking.mobile.trim() ||
        !booking.email.trim()
      ) {
        toast('Please complete all required fields', 'error');
        return false;
      }
    }
    if (step === 3) {
      if (!allSchedulesComplete(items)) {
        toast('Please select a date and time for each course', 'error');
        return false;
      }
    }
    if (step === 4 && !allFree) {
      if (!booking.paymentMethodId) {
        toast('Please select a payment method', 'error');
        return false;
      }
      if (!booking.paymentProofDataUrl) {
        toast('Please upload a screenshot of your payment', 'error');
        return false;
      }
    }
    return true;
  };

  const onNext = async () => {
    if (!validateStep()) return;
    const advancingToConfirm = step === 4 || (step === 3 && allFree);
    if (advancingToConfirm) {
      if (!isLoggedIn) {
        toast('Please log in to submit your booking', 'error');
        openAuthModal('login');
        return;
      }
      goStep(5);
      return;
    }
    goStep(nextStepAfter(step));
  };

  const onConfirmBooking = async () => {
    if (!isLoggedIn) {
      toast('Please log in to confirm your booking', 'error');
      openAuthModal('login');
      return;
    }
    setSubmitting(true);
    const result = await createBookingsBatch(
      {
        firstName: booking.firstName,
        lastName: booking.lastName,
        mobile: booking.mobile,
        email: booking.email,
        paymentProofName: booking.paymentProofName,
        paymentProofDataUrl: booking.paymentProofDataUrl,
      },
      items,
    );
    setSubmitting(false);
    if (!result.ok) {
      if (result.bookings.length) {
        toast(
          `${result.bookings.length} of ${items.length} bookings submitted. ${result.error}`,
          'error',
        );
      } else {
        toast(result.error, 'error');
      }
      return;
    }
    const ids = result.bookings.map((b) => b.id);
    updateBooking({ confirmationIds: ids, step: 5 });
    items.forEach((item) => removeFromCart(item.courseId));
    const summary =
      items.length === 1
        ? `${items[0].course} · Ref ${ids[0]}`
        : `${items.length} courses booked · Refs ${ids.join(', ')}`;
    addNotification('Booking confirmed', `${summary}. We will email you once centers verify payment.`);
    toast(items.length === 1 ? 'Booking confirmed!' : `${items.length} bookings confirmed!`, 'success');
  };

  const onBack = () => {
    if (step > 1) goStep(prevStepBefore(step));
  };

  const onPaymentFile = (file: File) => {
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

  const onPaymentMethodChange = (id: PaymentMethodId) => {
    updateBooking({ paymentMethodId: id });
  };

  const showPriceStrip = step !== 5 || !confirmationComplete;
  const modalTitle = multi ? `Checkout (${items.length} courses)` : 'Book Course';

  return (
    <div
      className={`booking-overlay open${multi ? ' booking-overlay--multi' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBooking();
      }}
      role="presentation"
    >
      <div
        className={`booking-modal${multi ? ' booking-modal--multi' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bModalTitle"
      >
        <div className="booking-modal-head">
          <div className="booking-modal-head-start">
            {step > 1 && !(step === 5 && confirmationComplete) && (
              <button type="button" className="booking-modal-back" onClick={onBack} aria-label="Go back">
                <i className="bi bi-arrow-left" aria-hidden />
              </button>
            )}
            <h3 id="bModalTitle">{modalTitle}</h3>
          </div>
          <button type="button" onClick={closeBooking} aria-label="Close booking">
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        {showPriceStrip && (
          <div className="booking-price-strip" aria-live="polite">
            <span className="booking-price-strip-course">{bookingTitleLabel(items)}</span>
            <strong className="booking-price-strip-amount">{bookingTotalLabel(items)}</strong>
          </div>
        )}
        <p className="booking-trust-strip" role="note">
          MARINA-accredited providers · Secure checkout
        </p>
        <nav
          className={`booking-steps-bar${allFree ? ' booking-steps-bar--no-payment' : ''}`}
          aria-label="Booking progress"
        >
          <ol className="booking-steps-track">
            {BOOKING_STEPS.flatMap((s, i) => {
              const paymentSkipped = allFree && s.num === 4;
              const stepDone =
                confirmationComplete && s.num === 5
                  ? true
                  : paymentSkipped
                    ? step >= 5
                    : step > s.num;
              const stepActive = !stepDone && !paymentSkipped && step === s.num;
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
                  className={`bs-step ${stepActive ? 'active' : stepDone ? 'done' : 'pending'}${
                    paymentSkipped ? ' skipped' : ''
                  }`}
                  aria-current={stepActive ? 'step' : undefined}
                  title={paymentSkipped ? 'Not required for free courses' : undefined}
                >
                  <span className="bs-step-num">
                    {stepDone ? (
                      paymentSkipped ? (
                        <i className="bi bi-dash-lg" aria-hidden />
                      ) : (
                        <i className="bi bi-check-lg" aria-hidden />
                      )
                    ) : (
                      s.num
                    )}
                  </span>
                  <span className="bs-step-icon" aria-hidden>
                    <i className={`bi ${s.icon}`} />
                  </span>
                  <span className="bs-step-label">{paymentSkipped ? 'No payment' : s.label}</span>
                </li>,
              );
              return items;
            })}
          </ol>
        </nav>

        <div
          className={`booking-modal-body${confirmationComplete ? ' booking-modal-body--confirmation-success' : ''}${
            step === 5 && !confirmationComplete ? ' booking-modal-body--confirm-review' : ''
          }${step === 3 ? ' booking-modal-body--schedules' : ''}`}
        >
          <div className="booking-form-section">
            {step === 1 && (
              <>
                <h4>Step 1: Review your selection</h4>
                <p className="booking-step-lede">
                  {multi
                    ? 'You are booking the following courses. Contact details and schedules are collected in the next steps.'
                    : 'Confirm the course below, then enter your details and preferred schedule.'}
                </p>
                <ul className="booking-review-list">
                  {items.map((item, index) => (
                    <li key={item.courseId} className="booking-review-card">
                      <div className="booking-review-card-head">
                        <span className="booking-review-index">{index + 1}</span>
                        <div>
                          <strong>{item.course}</strong>
                          <p>{item.provider}</p>
                        </div>
                        <span className="booking-review-price">{item.price}</span>
                      </div>
                      <div className="booking-review-meta">
                        <span>
                          <i className="bi bi-geo-alt" aria-hidden /> {item.location}
                        </span>
                        <span>
                          <i className="bi bi-clock" aria-hidden /> {item.duration}
                        </span>
                        <span>
                          <i className="bi bi-calendar3" aria-hidden /> {item.dates}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {step === 2 && (
              <>
                <h4>Step 2: Your details</h4>
                <p className="booking-step-lede">Used for all courses in this checkout.</p>
                <div className="bf-grid">
                  <div className="bf-field">
                    <label htmlFor="bf-first">
                      First Name
                      <RequiredMark />
                    </label>
                    <input
                      id="bf-first"
                      type="text"
                      required
                      autoComplete="given-name"
                      value={booking.firstName}
                      onChange={(e) => updateBooking({ firstName: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                  <div className="bf-field">
                    <label htmlFor="bf-last">
                      Last Name
                      <RequiredMark />
                    </label>
                    <input
                      id="bf-last"
                      type="text"
                      required
                      autoComplete="family-name"
                      value={booking.lastName}
                      onChange={(e) => updateBooking({ lastName: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="bf-field bf-full">
                    <label htmlFor="bf-mobile">
                      Mobile Number
                      <RequiredMark />
                    </label>
                    <input
                      id="bf-mobile"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={booking.mobile}
                      onChange={(e) => updateBooking({ mobile: e.target.value })}
                      placeholder="+63 9XX XXX XXXX"
                    />
                  </div>
                  <div className="bf-field bf-full">
                    <label htmlFor="bf-email">
                      Email Address
                      <RequiredMark />
                    </label>
                    <input
                      id="bf-email"
                      type="email"
                      required
                      autoComplete="email"
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
                <h4>Step 3: Course schedules</h4>
                <p className="booking-step-lede">
                  Choose a training date and time for each course ({items.filter((i) => i.scheduleDate && i.scheduleTime).length}{' '}
                  of {items.length} complete).
                </p>
                {scheduleWarnings.map((msg) => (
                  <p key={msg} className="booking-schedule-warning" role="status">
                    <i className="bi bi-exclamation-triangle" aria-hidden /> {msg}
                  </p>
                ))}
                <div className="booking-schedule-list">
                  {items.map((item, index) => {
                    const done = Boolean(item.scheduleDate && item.scheduleTime);
                    return (
                      <article
                        key={item.courseId}
                        className={`booking-schedule-card${done ? ' is-complete' : ''}`}
                      >
                        <header className="booking-schedule-card-head">
                          <span className="booking-schedule-card-num">
                            {done ? <i className="bi bi-check-lg" aria-hidden /> : index + 1}
                          </span>
                          <div>
                            <h5>{item.course}</h5>
                            <p>
                              {item.provider} · {item.location}
                            </p>
                            <p className="booking-schedule-card-dates">
                              Listed dates: {item.dates} · {item.duration}
                            </p>
                          </div>
                        </header>
                        <div className="bf-grid">
                          <div className="bf-field">
                            <label htmlFor={`bf-date-${item.courseId}`}>
                              Training date
                              <RequiredMark />
                            </label>
                            <input
                              id={`bf-date-${item.courseId}`}
                              type="date"
                              required
                              value={item.scheduleDate}
                              onChange={(e) =>
                                updateBookingItem(item.courseId, { scheduleDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="bf-field">
                            <label htmlFor={`bf-time-${item.courseId}`}>
                              Time slot
                              <RequiredMark />
                            </label>
                            <select
                              id={`bf-time-${item.courseId}`}
                              required
                              value={item.scheduleTime}
                              onChange={(e) =>
                                updateBookingItem(item.courseId, { scheduleTime: e.target.value })
                              }
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
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            {step === 4 && (
              <BookingPaymentStep
                totalLabel={bookingTotalLabel(items)}
                courseCount={items.length}
                paymentMethodId={booking.paymentMethodId || DEFAULT_PAYMENT_METHOD_ID}
                onPaymentMethodChange={onPaymentMethodChange}
                paymentProofName={booking.paymentProofName}
                paymentProofDataUrl={booking.paymentProofDataUrl}
                onPaymentFile={onPaymentFile}
              />
            )}

            {step === 5 && !confirmationComplete && (
              <div className="booking-confirm-review">
                <h4>Confirm your booking</h4>
                <p className="booking-confirm-review-lede">
                  {allFree ? (
                    <>
                      No payment is required — {items.length === 1 ? 'this course is' : 'these courses are'} free.
                      Submit {items.length === 1 ? 'your booking request' : `${items.length} booking requests`} to the
                      training {items.length === 1 ? 'center' : 'centers'}.
                    </>
                  ) : (
                    <>
                      Submit {items.length === 1 ? 'this booking request' : `${items.length} booking requests`} to the
                      training {items.length === 1 ? 'center' : 'centers'}.
                    </>
                  )}
                </p>
              </div>
            )}

            {step === 5 && confirmationComplete && (
              <div className="booking-confirmation">
                <div className="booking-confirmation-icon">
                  <i className="bi bi-check-circle-fill" aria-hidden />
                </div>
                <h4>{items.length === 1 ? 'Booking confirmed' : 'Bookings confirmed'}</h4>
                <p>Thank you! Your booking {items.length === 1 ? 'request has' : 'requests have'} been received.</p>
                <ul className="booking-refs-list">
                  {items.map((item, i) => (
                    <li key={item.courseId}>
                      <span className="booking-refs-course">{item.course}</span>
                      <strong>{booking.confirmationIds[i]}</strong>
                    </li>
                  ))}
                </ul>
                <p className="booking-confirmation-note">
                  We will email you at {booking.email} once each training center verifies your payment.
                </p>
              </div>
            )}
          </div>

          {step < 5 || !confirmationComplete ? (
            <BookingSummary
              booking={booking}
              showSchedule={step >= 3}
              variant={step === 5 && !confirmationComplete ? 'confirmReview' : 'sidebar'}
            />
          ) : null}
        </div>

        <div className="booking-modal-footer">
          {step === 5 && confirmationComplete ? (
            <>
              <span />
              <div className="booking-footer-confirm-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    closeBooking();
                    navigateTo('courses');
                  }}
                >
                  Browse courses
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    closeBooking();
                    navigateTo('booked-courses');
                  }}
                >
                  View booked courses
                </button>
              </div>
            </>
          ) : step === 5 && !confirmationComplete ? (
            <>
              <div className="booking-footer-left">
                <button type="button" className="btn btn-secondary" onClick={closeBooking}>
                  Cancel
                </button>
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                  <i className="bi bi-arrow-left" aria-hidden /> Back
                </button>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void onConfirmBooking()}
                disabled={submitting}
              >
                {multi ? `Confirm ${items.length} bookings` : 'Confirm booking'}
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
                {step === 4 ? 'Continue' : step === 3 && allFree ? 'Continue to confirmation' : 'Next'}{' '}
                <i className="bi bi-arrow-right" aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
