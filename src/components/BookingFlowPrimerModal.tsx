import { useEffect } from 'react';
import { useApp } from '../context/AppProvider';

const STEPS = [
  { title: 'Choose your course', detail: 'Pick a MARINA-accredited course from search or browse.' },
  { title: 'Pick date & time', detail: 'Select a schedule that fits your availability.' },
  { title: 'Upload payment proof', detail: 'Complete payment to the training center, then add your screenshot.' },
  { title: 'Confirmation', detail: 'Submit your booking request; the center will verify and confirm.' },
];

export function BookingFlowPrimerModal() {
  const { bookingPrimerOpen, dismissBookingPrimer } = useApp();

  useEffect(() => {
    if (!bookingPrimerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      dismissBookingPrimer();
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
    };
  }, [bookingPrimerOpen, dismissBookingPrimer]);

  if (!bookingPrimerOpen) return null;

  return (
    <div
      className="legal-modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookingPrimerTitle"
      onClick={dismissBookingPrimer}
    >
      <div className="legal-modal booking-primer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-accent" aria-hidden />
        <div className="booking-primer-head">
          <h2 id="bookingPrimerTitle">How booking works</h2>
          <p className="booking-primer-lede">A quick overview before you continue (shown once).</p>
        </div>
        <ol className="booking-primer-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="booking-primer-step-num" aria-hidden>
                {i + 1}
              </span>
              <div>
                <strong>{s.title}</strong>
                <span className="booking-primer-step-desc">{s.detail}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="booking-primer-foot">
          <button type="button" className="btn btn-primary" onClick={dismissBookingPrimer}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
