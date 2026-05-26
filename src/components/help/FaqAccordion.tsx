import type { HelpFaqItem } from '../../data/helpCenter';

type FaqAccordionProps = {
  items: HelpFaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
  /** Single-column stack inside Help category cards; default 2-col grid elsewhere */
  layout?: 'grid' | 'stack';
};

export function FaqAccordion({ items, openId, onToggle, layout = 'grid' }: FaqAccordionProps) {
  if (items.length === 0) {
    return <p className="help-empty-hint">No topics match your search in this section.</p>;
  }

  const listClass =
    layout === 'stack'
      ? 'help-category-faq-list help-category-faq-list--overlay'
      : 'faq-grid help-faq-grid';

  return (
    <div className={listClass} role="list">
      {items.map((item, idx) => {
        const stableId = `${item.id}-${idx}`;
        const isOpen = openId === stableId;
        return (
          <div key={stableId} className={`faq-item${isOpen ? ' open' : ''}`} role="listitem">
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => onToggle(isOpen ? '' : stableId)}
            >
              {item.question}
              <i className="bi bi-chevron-down faq-chevron" aria-hidden />
            </button>
            <div className="faq-a" id={`faq-answer-${stableId}`}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
