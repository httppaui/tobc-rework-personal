import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { fetchBookings } from '../lib/bookingsApi';
import type { BookingRecord } from '../types';

function formatBookedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function matchesBookingSearch(booking: BookingRecord, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    booking.courseTitle.toLowerCase().includes(q) ||
    booking.provider.toLowerCase().includes(q) ||
    booking.location.toLowerCase().includes(q) ||
    booking.id.toLowerCase().includes(q) ||
    booking.status.toLowerCase().includes(q)
  );
}

export function BookedCoursesPage() {
  const { navigateTo, isLoggedIn, openAuthModal, authSessionReady, openCourseDetail } = useApp();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    if (!authSessionReady) return;
    if (!isLoggedIn) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void fetchBookings().then((rows) => {
      setBookings(rows);
      setLoading(false);
    });
  }, [authSessionReady, isLoggedIn]);

  const filtered = useMemo(
    () => bookings.filter((b) => matchesBookingSearch(b, searchQ)),
    [bookings, searchQ],
  );

  return (
    <section className="section booked-courses-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>
            Home
          </button>
          <span className="sep">/</span>
          <span className="current" aria-current="page">
            Booked Courses
          </span>
        </nav>
        <h1 className="page-title">Booked Courses</h1>
        <p className="page-lede">
          Courses you have booked through TOBC. Confirmation references and schedules appear after checkout.
        </p>

        {!authSessionReady || loading ? (
          <p className="page-lede">Loading your courses…</p>
        ) : !isLoggedIn ? (
          <div className="empty-shelf">
            <i className="bi bi-journal-check" aria-hidden />
            <h2>Sign in to view booked courses</h2>
            <p>Complete a booking while logged in and your courses will show up here.</p>
            <button type="button" className="btn btn-primary" onClick={() => openAuthModal('login')}>
              Log in
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-shelf">
            <i className="bi bi-journal-check" aria-hidden />
            <h2>No booked courses yet</h2>
            <p>When you finish booking a course, it will be listed here with your confirmation reference.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigateTo('courses')}>
              Browse courses
            </button>
          </div>
        ) : (
          <>
            <div className="booked-courses-toolbar">
              <div className="cart-search-wrap">
                <i className="bi bi-search cart-search-icon" aria-hidden />
                <input
                  type="search"
                  className="cart-search"
                  placeholder="Search by course, provider, or confirmation ID…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  aria-label="Search booked courses"
                />
              </div>
              <span className="booked-courses-count">
                {filtered.length} of {bookings.length} booking{bookings.length === 1 ? '' : 's'}
              </span>
            </div>

            {filtered.length === 0 ? (
              <p className="cart-no-results">No bookings match &ldquo;{searchQ}&rdquo;.</p>
            ) : (
              <ul className="booked-courses-list">
                {filtered.map((b) => (
                  <li key={b.id}>
                    <article className="booked-course-card">
                      <div className="booked-course-card-main">
                        <div className="booked-course-card-head">
                          <span className="badge badge-teal">{b.status}</span>
                          <span className="booked-course-date">Booked {formatBookedDate(b.createdAt)}</span>
                        </div>
                        <h2>{b.courseTitle}</h2>
                        <p className="booked-course-provider">{b.provider}</p>
                        <dl className="booked-course-meta">
                          <div>
                            <dt>Schedule</dt>
                            <dd>
                              {b.scheduleDate} · {b.scheduleTime}
                            </dd>
                          </div>
                          <div>
                            <dt>Location</dt>
                            <dd>{b.location}</dd>
                          </div>
                          <div>
                            <dt>Category</dt>
                            <dd>{b.category}</dd>
                          </div>
                          <div>
                            <dt>Confirmation</dt>
                            <dd>
                              <strong>{b.id}</strong>
                            </dd>
                          </div>
                          <div>
                            <dt>Course fee</dt>
                            <dd>
                              <strong>{b.price}</strong>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      {b.courseId ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn--sm"
                          onClick={() => openCourseDetail(b.courseId)}
                        >
                          View course
                        </button>
                      ) : null}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
