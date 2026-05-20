import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { PAGE_PATHS } from '../lib/routes';
import { HERO_VALUE_PROPS } from '../data/rolePaths';
import type { RoleId } from '../types';
import { CourseCard } from '../components/CourseCard';
import { COURSES } from '../data/courses';

function HeroCTAs({
  role,
  onPrimary,
  onSecondary,
}: {
  role: RoleId;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  if (role === 'agency') {
    return (
      <>
        <button type="button" className="btn btn-primary btn--lg" onClick={onPrimary}>
          <i className="bi bi-people-fill" aria-hidden /> Bulk-book for my crew
        </button>
        <button type="button" className="btn btn-secondary btn--lg" onClick={onSecondary}>
          Agency dashboard →
        </button>
      </>
    );
  }
  if (role === 'center') {
    return (
      <>
        <button type="button" className="btn btn-primary btn--lg" onClick={onPrimary}>
          <i className="bi bi-mortarboard-fill" aria-hidden /> Publish courses on TOBC
        </button>
        <button type="button" className="btn btn-secondary btn--lg" onClick={onSecondary}>
          Provider console →
        </button>
      </>
    );
  }
  return (
    <>
      <button type="button" className="btn btn-primary btn--lg" onClick={onPrimary}>
        <i className="bi bi-search" aria-hidden /> Find a course &amp; schedule
      </button>
      <button type="button" className="btn btn-secondary btn--lg" onClick={onSecondary}>
        Create account
      </button>
    </>
  );
}

export function HomePage() {
  const { role, navigateTo, openCourseDetail, openAuthModal } = useApp();
  const navigate = useNavigate();
  const [homeQ, setHomeQ] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const run = () => {
      animateNum('s1', 12400);
      animateNum('s2', 84);
      animateNum('s3', 320);
      animateNum('s4', 98, '%');
    };
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    const el = document.getElementById('stats-bar');
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const runHomeSearch = () => {
    const q = homeQ.trim();
    navigate(q ? `${PAGE_PATHS.courses}?q=${encodeURIComponent(q)}` : PAGE_PATHS.courses);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="hero-content">
            <div>
              <div className="hero-eyebrow">
                <i className="bi bi-anchor" aria-hidden /> Maritime Training Platform · Philippines
              </div>
              <p className="hero-value-prop" id="heroValueProp">
                {HERO_VALUE_PROPS[role]}
              </p>
              <h1>
                Book your next certificate.
                <br />
                <em>Minutes, not paperwork.</em>
              </h1>
              <div className="hero-social-proof">
                <span className="hero-stars" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className="bi bi-star-fill" />
                  ))}
                </span>
                <p className="hero-rating-text">
                  <strong>4.8 / 5</strong> from 2,400+ verified reviews · <strong>84</strong> accredited partners
                </p>
              </div>
              <p className="hero-sub">
                Compare schedules, see seat availability, pay securely, and get instant confirmation — built for
                seafarers, manning agencies, and training providers.
              </p>
              <div className="hero-ctas" id="heroCTAs">
                <HeroCTAs
                  role={role}
                  onPrimary={() => navigateTo('courses')}
                  onSecondary={() => openAuthModal('register')}
                />
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-visual-label">
                <i className="bi bi-lightning-charge-fill" aria-hidden /> Popular right now
              </div>
              {COURSES.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="mini-course-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => openCourseDetail(c.id)}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
                >
                  <div className="mini-card-img">
                    <div className="mini-card-img-bg" style={{ background: c.gradient }} />
                    <div className="mini-card-emoji">
                      <i className={`bi ${c.icon}`} aria-hidden />
                    </div>
                    <div className="mini-card-badges">
                      <span />
                      <span className="badge badge-white" style={{ fontSize: 9 }}>
                        {c.category}
                      </span>
                    </div>
                  </div>
                  <div className="mini-card-body">
                    <div className="mini-card-title">{c.title}</div>
                    <div className="mini-card-provider">{c.provider}</div>
                    <div className="mini-card-foot">
                      <div className="mini-price">{c.price}</div>
                      <div className="mini-seats">
                        <div className={`sdot${c.seats <= 3 ? ' low' : ''}`} />
                        {c.seats} seats · {c.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
                onClick={() => navigateTo('courses')}
              >
                View All Courses →
              </button>
            </div>
          </div>

          <div className="search-card hero-search-card">
            <div className="search-card-label">
              <i className="bi bi-search" aria-hidden /> Find a Maritime Training Course
            </div>
            <div className="search-fields">
              <div className="sf">
                <label htmlFor="homeSearchQ">Course / Keyword</label>
                <input
                  id="homeSearchQ"
                  type="text"
                  placeholder="e.g. Basic Safety Training…"
                  value={homeQ}
                  onChange={(e) => setHomeQ(e.target.value)}
                />
              </div>
              <div className="sf">
                <label>Training Provider</label>
                <input type="text" placeholder="e.g. Far East Maritime…" />
              </div>
              <div className="sf">
                <label>Category</label>
                <select>
                  <option>All Categories</option>
                  <option>STCW</option>
                  <option>Non-STCW</option>
                </select>
              </div>
              <div className="sf">
                <label>Schedule Date</label>
                <input type="date" />
              </div>
              <div className="search-fields-action">
                <button type="button" className="btn btn-primary search-fields-btn" onClick={runHomeSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-bar" id="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-num" id="s1">
                0
              </span>
              <div className="stat-label">Seafarers Enrolled</div>
            </div>
            <div className="stat-item">
              <span className="stat-num" id="s2">
                0
              </span>
              <div className="stat-label">Training Centers</div>
            </div>
            <div className="stat-item">
              <span className="stat-num" id="s3">
                0
              </span>
              <div className="stat-label">Courses Available</div>
            </div>
            <div className="stat-item">
              <span className="stat-num" id="s4">
                0%
              </span>
              <div className="stat-label">Booking Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <section className="testimonial-strip" aria-label="What seafarers say">
        <div className="container">
          <div className="section-header center" style={{ marginBottom: 32 }}>
            <span className="section-eyebrow">Reviews</span>
            <h2>Trusted by crews &amp; agencies</h2>
            <p className="section-lede">Recent feedback from bookings placed through TOBC.</p>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="cc-stars" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="bi bi-star-fill" />
                ))}
              </div>
              <p className="testimonial-quote">
                &ldquo;Found BST in Manila with open seats the same week. Paid online and got SMS confirmation — clearer
                than calling around.&rdquo;
              </p>
              <div className="testimonial-meta">
                <div className="testimonial-avatar">
                  <i className="bi bi-person-fill" aria-hidden />
                </div>
                <div>
                  <div className="testimonial-name">Michael R.</div>
                  <div className="testimonial-role">Third Officer · Manila</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-eyebrow">Simple Process</span>
            <h2>Book in 4 Easy Steps</h2>
            <p className="section-lede">From search to certification — TOBC keeps maritime training booking straightforward.</p>
          </div>
          <div className="steps-grid">
            {[
              ['1', 'bi-search', 'Search Courses', 'Browse MARINA-accredited courses by name, date, or location.'],
              ['2', 'bi-calendar2-check', 'Choose a Schedule', 'Pick from available slots. See live seat counts and session dates.'],
              ['3', 'bi-credit-card', 'Book & Pay', 'Secure your slot with our trusted payment gateway. Instant confirmation.'],
              ['4', 'bi-patch-check-fill', 'Get Certified', 'Attend your course and track all your certificates in your dashboard.'],
            ].map(([num, icon, title, text]) => (
              <div key={num} className="step-card">
                <div className="step-num">{num}</div>
                <div className="step-icon">
                  <i className={`bi ${icon}`} aria-hidden />
                </div>
                <h3>{title}</h3>
                <p style={{ fontSize: 13.5 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <span className="section-eyebrow">Courses</span>
              <h2>Featured Maritime Courses</h2>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => navigateTo('courses')}>
              View All 320+ →
            </button>
          </div>
          <div className="courses-grid-view" style={{ marginBottom: 0 }}>
            {COURSES.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header center">
            <span className="section-eyebrow">Why TOBC</span>
            <h2>Built for the Maritime Industry</h2>
            <p style={{ color: 'rgba(255,255,255,.5)', margin: '0 auto' }}>Everything you need — in one integrated platform.</p>
          </div>
          <div className="why-grid">
            <div className="why-card"><div className="why-icon"><i className="bi bi-mortarboard-fill" aria-hidden /></div><h3>Diverse Course Selection</h3><p>320+ STCW, Non-STCW, TESDA, and PDOS courses.</p></div>
            <div className="why-card"><div className="why-icon"><i className="bi bi-award-fill" aria-hidden /></div><h3>MARINA-Accredited Partners</h3><p>Verified centers only.</p></div>
            <div className="why-card"><div className="why-icon"><i className="bi bi-lightning-charge-fill" aria-hidden /></div><h3>Book in Minutes</h3><p>Instant confirmation online.</p></div>
            <div className="why-card"><div className="why-icon"><i className="bi bi-bar-chart-line-fill" aria-hidden /></div><h3>Real-Time Availability</h3><p>Live seat counts and dates.</p></div>
            <div className="why-card"><div className="why-icon"><i className="bi bi-lock-fill" aria-hidden /></div><h3>Secure Payment Gateway</h3><p>PCI-compliant payments.</p></div>
            <div className="why-card"><div className="why-icon"><i className="bi bi-phone-fill" aria-hidden /></div><h3>Mobile-First Platform</h3><p>Book from any device.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }} id="faq-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-eyebrow">Support</span>
            <h2>Frequently Asked Questions</h2>
            <p className="section-lede">Straight answers before you book.</p>
          </div>
          <div className="faq-grid">
            {[
              ['What documents do I need to book?', 'Typically a valid Seaman\'s Book (SRB), government-issued ID, and any prerequisite certificates.'],
              ['How do I get a refund if I cancel?', 'Cancellations 7+ days before: full refund. 3–6 days: 50% refund. Within 48 hours: no refund.'],
            ].map(([q, a], i) => (
              <div
                key={q}
                className={`faq-item${openFaq === i ? ' open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                onKeyDown={(e) => e.key === 'Enter' && setOpenFaq(openFaq === i ? null : i)}
                role="button"
                tabIndex={0}
              >
                <div className="faq-q">
                  {q}
                  <i className="bi bi-chevron-down faq-chevron" aria-hidden />
                </div>
                <div className="faq-a">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-banner">
        <div className="container">
          <span className="section-eyebrow" style={{ color: 'var(--teal-200)' }}>
            Get Started Today
          </span>
          <h2 style={{ color: '#fff', marginBottom: 12 }}>Ready to Book Your Maritime Training?</h2>
          <p style={{ color: 'rgba(255,255,255,.88)', maxWidth: 480, margin: '0 auto 28px' }}>
            Join 12,400+ seafarers who trust TOBC. Register free and find your next course in minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary btn--lg" onClick={() => openAuthModal('register')}>
              Create Free Account →
            </button>
            <button type="button" className="btn btn-secondary btn--lg" onClick={() => navigateTo('courses')}>
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function animateNum(id: string, target: number, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  let v = 0;
  const step = target / (1800 / 16);
  const run = () => {
    v = Math.min(v + step, target);
    el.textContent = (target > 100 ? Math.floor(v).toLocaleString() : Math.floor(v)) + suffix;
    if (v < target) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
