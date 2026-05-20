import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaqAccordion } from '../components/help/FaqAccordion';
import { useApp } from '../context/AppProvider';
import {
  HELP_CATEGORIES,
  HELP_CENTER_EMAIL,
  HELP_CENTER_HOURS,
  HELP_CENTER_PHONE,
  HELP_CENTER_PHONE_ALT,
  HELP_LANDING_FAQS,
  categoryMatchesQuery,
  filterCategoryQuestions,
} from '../data/helpCenter';

export function HelpCenterPage() {
  const { navigateTo, openLegalModal } = useApp();
  const location = useLocation();
  const [searchQ, setSearchQ] = useState('');
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [categoryFaqOpen, setCategoryFaqOpen] = useState<string | null>(null);
  const [landingFaqOpen, setLandingFaqOpen] = useState<string | null>(null);

  const filteredCategories = useMemo(
    () => HELP_CATEGORIES.filter((c) => categoryMatchesQuery(c, searchQ)),
    [searchQ],
  );

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  useEffect(() => {
    if (searchQ.trim() && filteredCategories.length === 1) {
      setOpenCategoryId(filteredCategories[0].id);
    }
  }, [searchQ, filteredCategories]);

  const toggleCategory = (id: string) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
    setCategoryFaqOpen(null);
  };

  return (
    <>
      <div className="help-center-hero">
        <div className="container">
          <nav className="breadcrumb breadcrumb--on-dark" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>
              Home
            </button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">
              Help Center
            </span>
          </nav>
          <h1>Need Help?</h1>
          <p className="help-center-hero-lede">
            Search topics, browse categories, or contact our maritime support team.
          </p>
          <div className="help-center-search-wrap">
            <i className="bi bi-search help-center-search-icon" aria-hidden />
            <input
              type="search"
              className="help-center-search"
              placeholder="Search topics (e.g. booking, refund, account, payment)…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              aria-label="Search help topics"
            />
            {searchQ.trim() ? (
              <button
                type="button"
                className="help-center-search-clear"
                onClick={() => setSearchQ('')}
                aria-label="Clear search"
              >
                <i className="bi bi-x-lg" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <section className="section help-center-section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Browse by topic</span>
            <h2>Help topics</h2>
            <p className="section-lede">
              Select a category to view common questions and answers.
            </p>
          </div>

          {filteredCategories.length === 0 ? (
            <p className="help-empty-hint help-empty-hint--block">
              No categories match &ldquo;{searchQ}&rdquo;. Try different keywords or browse all topics
              below.
            </p>
          ) : null}

          <div className="help-category-grid">
            {filteredCategories.map((category) => {
              const isOpen = openCategoryId === category.id;
              const questions = filterCategoryQuestions(category, searchQ);
              return (
                <article
                  key={category.id}
                  className={`help-category-card${isOpen ? ' is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="help-category-card-head"
                    aria-expanded={isOpen}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="help-category-card-icon" aria-hidden>
                      <i className={`bi ${category.icon}`} />
                    </span>
                    <span className="help-category-card-text">
                      <strong>{category.title}</strong>
                      <span>{category.description}</span>
                    </span>
                    <i className="bi bi-chevron-down help-category-chevron" aria-hidden />
                  </button>
                  {isOpen ? (
                    <div className="help-category-card-body">
                      <FaqAccordion
                        items={questions}
                        openId={categoryFaqOpen}
                        onToggle={(id) => setCategoryFaqOpen(id || null)}
                      />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="help-faq" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-eyebrow">Support</span>
            <h2>Frequently Asked Questions</h2>
            <p className="section-lede">Straight answers before you book — same as our home page FAQ.</p>
          </div>
          <FaqAccordion
            items={
              searchQ.trim()
                ? HELP_LANDING_FAQS.filter(
                    (item) =>
                      item.question.toLowerCase().includes(searchQ.toLowerCase()) ||
                      item.answer.toLowerCase().includes(searchQ.toLowerCase()),
                  )
                : HELP_LANDING_FAQS
            }
            openId={landingFaqOpen}
            onToggle={(id) => setLandingFaqOpen(id || null)}
          />
        </div>
      </section>

      <section className="section help-contact-section" id="help-contact">
        <div className="container">
          <div className="section-header center">
            <span className="section-eyebrow">Get in touch</span>
            <h2>Contact Us</h2>
            <p className="section-lede">
              We&apos;re here for seafarers, agencies, and training partners across the Philippines.
            </p>
          </div>
          <div className="help-contact-grid">
            <div className="help-contact-card">
              <div className="help-contact-card-icon">
                <i className="bi bi-chat-dots-fill" aria-hidden />
              </div>
              <h3>Live chat</h3>
              <p>Chat with support when signed in. Best for booking and schedule questions.</p>
              <button type="button" className="btn btn-primary" onClick={() => navigateTo('messages')}>
                Open Messages
              </button>
            </div>
            <div className="help-contact-card">
              <div className="help-contact-card-icon">
                <i className="bi bi-envelope-fill" aria-hidden />
              </div>
              <h3>Email</h3>
              <p>
                <a href={`mailto:${HELP_CENTER_EMAIL}`}>{HELP_CENTER_EMAIL}</a>
              </p>
              <p className="help-contact-meta">Include your confirmation ID for booking issues.</p>
            </div>
            <div className="help-contact-card">
              <div className="help-contact-card-icon">
                <i className="bi bi-telephone-fill" aria-hidden />
              </div>
              <h3>Phone</h3>
              <p>
                <a href="tel:+639178780320">{HELP_CENTER_PHONE}</a>
                <br />
                <a href="tel:+63253104815">{HELP_CENTER_PHONE_ALT}</a>
              </p>
              <p className="help-contact-meta">{HELP_CENTER_HOURS}</p>
            </div>
            <div className="help-contact-card">
              <div className="help-contact-card-icon">
                <i className="bi bi-file-text-fill" aria-hidden />
              </div>
              <h3>Policies</h3>
              <p>Terms, privacy, refunds, and partner information.</p>
              <div className="help-contact-links">
                <button type="button" className="btn btn-secondary btn--sm" onClick={() => openLegalModal('terms')}>
                  Terms
                </button>
                <button type="button" className="btn btn-secondary btn--sm" onClick={() => openLegalModal('privacy')}>
                  Privacy
                </button>
                <button type="button" className="btn btn-secondary btn--sm" onClick={() => openLegalModal('refund')}>
                  Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
