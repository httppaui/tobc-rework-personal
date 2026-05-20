import { useState } from 'react';
import { useApp } from '../context/AppProvider';

const ARTICLES = [
  { cat: 'company', title: 'TOBC & Nautilus Pacific Formalize Partnership Through MOA', date: 'Mar 2, 2026', grad: 'linear-gradient(135deg,#003d3b,#007a75)' },
  { cat: 'industry', title: 'New MARINA Regulations for 2026: What Seafarers Need to Know', date: 'Feb 28, 2026', grad: 'linear-gradient(135deg,#1e3438,#00706c)' },
  { cat: 'events', title: 'TOBC at the 2026 MARINA Annual Conference', date: 'Jan 15, 2026', grad: 'linear-gradient(135deg,#003d3b,#009d97)' },
];

export function NewsPage() {
  const { navigateTo } = useApp();
  const [tab, setTab] = useState('all');
  const list = tab === 'all' ? ARTICLES : ARTICLES.filter((a) => a.cat === tab);

  return (
    <>
      <div className="news-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>Home</button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">News</span>
          </nav>
          <h1>News &amp; Announcements</h1>
          <p>Company updates, maritime industry news, partner announcements, and maritime events.</p>
        </div>
      </div>
      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="news-category-tabs">
            {['all', 'company', 'industry', 'events'].map((t) => (
              <button key={t} type="button" className={`news-cat-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t === 'all' ? 'All News' : t === 'company' ? 'TOBC Company News' : t === 'industry' ? 'Maritime Industry Updates' : 'Maritime Events'}
              </button>
            ))}
          </div>
          <div className="news-full-grid">
            {list.map((a) => (
              <article key={a.title} className="news-full-card">
                <div className="nfc-img" style={{ background: a.grad }}>
                  <i className="bi bi-newspaper" aria-hidden />
                </div>
                <div className="nfc-body">
                  <div className="nfc-meta">
                    <span className="badge badge-teal">{a.cat}</span>
                    <span className="news-date">{a.date}</span>
                  </div>
                  <h3>{a.title}</h3>
                  <p>Read the latest update from TOBC and our maritime partners.</p>
                  <span className="read-more">Read More →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
