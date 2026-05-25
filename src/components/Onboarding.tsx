import { useApp } from '../context/AppProvider';
import { TOUR_WELCOME_CHECKLIST } from '../data/guidedTour';

export function Onboarding() {
  const { onboardingOpen, startGuidedTour, skipOnboarding } = useApp();

  return (
    <div
      id="onboardOverlay"
      className={`onboard-overlay${onboardingOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboardTitle"
    >
      <div className="onboard-modal">
        <h2 id="onboardTitle">Welcome to TOBC</h2>
        <p>
          New here? Take a two-minute tour with coach marks on the real interface, or skip and
          explore on your own.
        </p>
        <p className="onboard-checklist-label">You will learn how to:</p>
        <ul className="onboard-checklist">
          {TOUR_WELCOME_CHECKLIST.map((item) => (
            <li key={item}>
              <span className="onboard-check" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="onboard-actions">
          <button type="button" className="btn btn-primary" onClick={startGuidedTour}>
            Start guided tour
          </button>
          <button type="button" className="btn btn-secondary" onClick={skipOnboarding}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
