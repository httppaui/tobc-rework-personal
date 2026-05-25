import { useCallback, useRef } from 'react';
import { useApp } from '../context/AppProvider';
import {
  HELP_CENTER_EMAIL,
  HELP_CENTER_PHONE,
} from '../data/helpCenter';

const CLOSE_DELAY_MS = 160;

export function HelpFab() {
  const { helpOpen, setHelpOpen, navigateTo, startGuidedTour } = useApp();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPanel = useCallback(() => {
    clearCloseTimer();
    setHelpOpen(true);
  }, [clearCloseTimer, setHelpOpen]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setHelpOpen(false), CLOSE_DELAY_MS);
  }, [clearCloseTimer, setHelpOpen]);

  const closePanel = useCallback(() => {
    clearCloseTimer();
    setHelpOpen(false);
  }, [clearCloseTimer, setHelpOpen]);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const goHelpCenter = () => {
    closePanel();
    navigateTo('help');
  };

  const goFaq = () => {
    closePanel();
    navigateTo('home');
    window.setTimeout(() => {
      document.getElementById('faq-section')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }, 300);
  };

  const togglePanel = () => setHelpOpen(!helpOpen);

  return (
    <div className="help-fab">
      <button
        type="button"
        className="scroll-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <i className="bi bi-chevron-up" aria-hidden />
      </button>
      <div
        className="help-fab-trigger"
        onMouseEnter={openPanel}
        onMouseLeave={scheduleClose}
      >
        <div
          className={`help-panel${helpOpen ? ' open' : ''}`}
        id="helpPanel"
        role="dialog"
        aria-label="Quick help"
        onMouseEnter={openPanel}
        onMouseLeave={scheduleClose}
      >
        <div className="help-panel-head">
          <h4>Need Help?</h4>
          <p>We&apos;re here for you</p>
        </div>
        <div className="help-panel-body">
          <button
            type="button"
            className="help-item"
            onClick={() => {
              closePanel();
              startGuidedTour();
            }}
          >
            <div className="help-item-icon">
              <i className="bi bi-signpost-split-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Site tour</strong>
              <span>Walkthrough with coach marks</span>
            </div>
          </button>
          <button type="button" className="help-item" onClick={goHelpCenter}>
            <div className="help-item-icon">
              <i className="bi bi-life-preserver" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Help Center</strong>
              <span>Topics, FAQ &amp; contact</span>
            </div>
          </button>
          <button type="button" className="help-item" onClick={goFaq}>
            <div className="help-item-icon">
              <i className="bi bi-question-circle-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>FAQ</strong>
              <span>Quick answers</span>
            </div>
          </button>
          <button
            type="button"
            className="help-item"
            onClick={() => {
              closePanel();
              navigateTo('messages');
            }}
          >
            <div className="help-item-icon">
              <i className="bi bi-chat-dots-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Live Chat</strong>
              <span>Mon–Sat, 8am–8pm</span>
            </div>
          </button>
          <a className="help-item" href={`mailto:${HELP_CENTER_EMAIL}`} onClick={closePanel}>
            <div className="help-item-icon">
              <i className="bi bi-envelope-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Email Support</strong>
              <span>{HELP_CENTER_EMAIL}</span>
            </div>
          </a>
          <a className="help-item" href={`tel:+639178780320`} onClick={closePanel}>
            <div className="help-item-icon">
              <i className="bi bi-telephone-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Call Us</strong>
              <span>{HELP_CENTER_PHONE}</span>
            </div>
          </a>
        </div>
        </div>
        <button
          type="button"
          className="help-fab-btn"
          data-tour="help-fab"
          onClick={togglePanel}
          aria-label="Help"
          aria-expanded={helpOpen}
          title="Need help?"
        >
          <i className="bi bi-question-circle-fill" aria-hidden />
        </button>
      </div>
    </div>
  );
}
