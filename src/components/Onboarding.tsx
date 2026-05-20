import { useApp } from '../context/AppProvider';

export function Onboarding() {
  const { onboardingOpen, completeOnboarding, skipOnboarding } = useApp();

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
        <p>Here is a quick guide to booking MARINA-accredited training in a few minutes.</p>
        <ol className="onboard-steps">
          <li>Choose your role above — Seafarer, Agency, or Training Center — for tailored shortcuts.</li>
          <li>Use the search bar (always at the top) to find courses by name, place, or category.</li>
          <li>Open a course card to see schedule, seats, and price — then continue to secure checkout.</li>
        </ol>
        <div className="onboard-actions">
          <button type="button" className="btn btn-primary" onClick={completeOnboarding}>
            Start exploring
          </button>
          <button type="button" className="btn btn-secondary" onClick={skipOnboarding}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
