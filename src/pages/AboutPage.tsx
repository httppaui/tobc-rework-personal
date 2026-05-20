import { AboutPuzzle } from '../components/AboutPuzzle';
import { useApp } from '../context/AppProvider';

export function AboutPage() {
  const { navigateTo, toast } = useApp();

  return (
    <>
      <div className="about-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>
              Home
            </button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">
              About Us
            </span>
          </nav>
          <h1>About TOBC</h1>
          <p>
            The Online Booking Corp. — a maritime training marketplace empowering seafarers, agencies, and training
            providers across the Philippines.
          </p>
        </div>
      </div>

      <AboutPuzzle />

      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-eyebrow">What We Offer</span>
            <h2>The TOBC Marketplace</h2>
            <p>Connecting three key groups in the maritime training ecosystem.</p>
          </div>
          <div className="offer-grid">
            <div className="offer-card">
              <div className="offer-icon">
                <i className="bi bi-anchor" aria-hidden />
              </div>
              <h3>For Seafarers</h3>
              <p>Browse, compare, and book MARINA-accredited maritime training courses.</p>
              <button type="button" className="btn btn-primary btn--sm" style={{ marginTop: 12 }} onClick={() => navigateTo('courses')}>
                Browse Courses
              </button>
            </div>
            <div className="offer-card">
              <div className="offer-icon">
                <i className="bi bi-building" aria-hidden />
              </div>
              <h3>For Manning Agencies</h3>
              <p>Bulk-book courses for your crew and track compliance deadlines.</p>
              <button type="button" className="btn btn-primary btn--sm" style={{ marginTop: 12 }} onClick={() => toast('Opening Agency Portal…', 'info')}>
                Agency Portal
              </button>
            </div>
            <div className="offer-card">
              <div className="offer-icon">
                <i className="bi bi-mortarboard-fill" aria-hidden />
              </div>
              <h3>For Training Centers</h3>
              <p>List courses, manage schedules, and reach active seafarers.</p>
              <button type="button" className="btn btn-primary btn--sm" style={{ marginTop: 12 }} onClick={() => toast('Opening Provider Portal…', 'info')}>
                List Your Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="why-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header center">
            <span className="section-eyebrow">Why TOBC</span>
            <h2>Our Key Advantages</h2>
            <p style={{ color: 'rgba(255,255,255,.5)', margin: '0 auto' }}>
              What makes TOBC the preferred platform for maritime training.
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <i className="bi bi-lightning-charge-fill" aria-hidden />
              </div>
              <h3>Fast &amp; Simple Booking</h3>
              <p>Find, book, and confirm a maritime training course in under 5 minutes.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="bi bi-bar-chart-line-fill" aria-hidden />
              </div>
              <h3>Real-Time Availability</h3>
              <p>See live seat counts and upcoming schedule dates for every course.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="bi bi-award-fill" aria-hidden />
              </div>
              <h3>Accredited Partners Only</h3>
              <p>Every training center on TOBC is MARINA-verified.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
