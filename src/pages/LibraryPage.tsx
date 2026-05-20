import { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { EmptyResults } from '../components/EmptyResults';

const RESOURCES = [
  { type: 'stcw', title: 'STCW 2010 Manila Amendments — Full Text', tags: [['STCW', 'teal'], ['PDF', 'outline']] },
  { type: 'imo', title: 'IMO SOLAS Convention — Latest Edition', tags: [['IMO', 'amber'], ['PDF', 'outline']] },
  { type: 'guides', title: "Philippine Seafarer's Guide to STCW Renewal", tags: [['Guide', 'green'], ['Free', 'outline']] },
];

export function LibraryPage() {
  const { navigateTo } = useApp();
  const [tab, setTab] = useState('all');
  const list = tab === 'all' ? RESOURCES : RESOURCES.filter((r) => r.type === tab);

  return (
    <>
      <div className="library-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>Home</button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">Library</span>
          </nav>
          <h1>Maritime Library</h1>
          <p>Free resources, regulations, guides, and reference materials for Filipino seafarers and maritime professionals.</p>
        </div>
      </div>
      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {['all', 'stcw', 'imo', 'guides'].map((t) => (
              <button key={t} type="button" className={`partner-type-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t === 'all' ? 'All Resources' : t.toUpperCase()}
              </button>
            ))}
          </div>
          {list.length === 0 ? (
            <EmptyResults
              iconClass="bi-journal-bookmark"
              title="No resources in this category"
              description="Browse all resources or try another filter."
              actionLabel="Show all resources"
              onAction={() => setTab('all')}
            />
          ) : (
          <div className="library-grid">
            {list.map((r) => (
              <article key={r.title} className="lib-card">
                <div className="lib-card-img">
                  <i className="bi bi-file-earmark-text-fill" aria-hidden />
                </div>
                <div className="lib-card-body">
                  <h3>{r.title}</h3>
                  <p>Downloadable reference for seafarers and maritime professionals.</p>
                  <div className="lib-tag-row">
                    {r.tags.map(([label, tone]) => (
                      <span key={label} className={`badge badge-${tone}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
