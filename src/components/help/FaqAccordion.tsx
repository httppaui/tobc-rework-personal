import type { HelpFaqItem } from '../../data/helpCenter';

type FaqAccordionProps = {
  items: HelpFaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
};

export function FaqAccordion({ items, openId, onToggle }: FaqAccordionProps) {
  if (items.length === 0) {
    return <p className="help-empty-hint">No topics match your search in this section.</p>;
  }

  return (
    <div className="faq-grid help-faq-grid" role="list">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={`faq-item${isOpen ? ' open' : ''}`} role="listitem">
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => onToggle(isOpen ? '' : item.id)}
            >
              {item.question}
              <i className="bi bi-chevron-down faq-chevron" aria-hidden />
            </button>
            <div className="faq-a" id={`faq-answer-${item.id}`}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
