import { useApp } from '../context/AppProvider';

export function HelpFab() {
  const { helpOpen, setHelpOpen, navigateTo, toast } = useApp();

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const goFaq = () => {
    setHelpOpen(false);
    navigateTo('home');
    setTimeout(() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  return (
    <div className="help-fab">
      <div className={`help-panel${helpOpen ? ' open' : ''}`} id="helpPanel">
        <div className="help-panel-head">
          <h4>Need Help?</h4>
          <p>We&apos;re here for you</p>
        </div>
        <div className="help-panel-body">
          <button type="button" className="help-item" onClick={goFaq}>
            <div className="help-item-icon">
              <i className="bi bi-question-circle-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>FAQ</strong>
              <span>Quick answers</span>
            </div>
          </button>
          <button type="button" className="help-item" onClick={() => toast('Opening live chat…', 'info')}>
            <div className="help-item-icon">
              <i className="bi bi-chat-dots-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Live Chat</strong>
              <span>Mon–Sat, 8am–8pm</span>
            </div>
          </button>
          <a className="help-item" href="mailto:admin@theonlinebookingcorp.com">
            <div className="help-item-icon">
              <i className="bi bi-envelope-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Email Support</strong>
              <span>admin@theonlinebookingcorp.com</span>
            </div>
          </a>
          <a className="help-item" href="tel:+639178780320">
            <div className="help-item-icon">
              <i className="bi bi-telephone-fill" aria-hidden />
            </div>
            <div className="help-item-text">
              <strong>Call Us</strong>
              <span>+63 917 878 0320</span>
            </div>
          </a>
        </div>
      </div>
      <div className="help-fab-actions">
        <button
          type="button"
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Back to top"
        >
          <i className="bi bi-chevron-up" aria-hidden />
        </button>
        <button
          type="button"
          className="help-fab-btn"
          onClick={() => setHelpOpen(!helpOpen)}
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
