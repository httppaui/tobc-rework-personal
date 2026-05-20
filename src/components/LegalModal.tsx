import { useEffect } from 'react';
import { LEGAL_DOCUMENTS } from '../data/legalContent';
import { useApp } from '../context/AppProvider';

export function LegalModal() {
  const { legalModal, closeLegalModal } = useApp();

  useEffect(() => {
    if (!legalModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      closeLegalModal();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [legalModal, closeLegalModal]);

  if (!legalModal) return null;

  const doc = LEGAL_DOCUMENTS[legalModal];

  return (
    <div
      className="legal-modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legalModalTitle"
      onClick={closeLegalModal}
    >
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-accent" aria-hidden />
        <div className="legal-modal-head">
          <div>
            <h2 id="legalModalTitle">{doc.title}</h2>
            <p className="legal-modal-updated">Last updated: {doc.updated}</p>
          </div>
          <button type="button" className="legal-modal-close" onClick={closeLegalModal} aria-label="Close">
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div className="legal-modal-body">
          <p className="legal-modal-intro">{doc.intro}</p>
          {doc.sections.map((section) => (
            <section key={section.title} className="legal-modal-section">
              <h3>{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <div className="legal-modal-foot">
          <button type="button" className="btn btn-primary" onClick={closeLegalModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
