import { useEffect, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { fetchBookings } from '../lib/bookingsApi';
import type { BookingRecord } from '../types';

export function BookingsPage() {
  const { navigateTo, isLoggedIn, openAuthModal, authSessionReady } = useApp();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authSessionReady) return;
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void fetchBookings().then((rows) => {
      setBookings(rows);
      setLoading(false);
    });
  }, [authSessionReady, isLoggedIn]);

  return (
    <section className="section" style={{ background: 'var(--paper)' }}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>
            Home
          </button>
          <span className="sep">/</span>
          <span className="current" aria-current="page">
            My Bookings
          </span>
        </nav>
        <h1 className="page-title">My Bookings</h1>
        <p className="page-lede">Course reservations linked to your account.</p>

        {!authSessionReady || loading ? (
          <p className="page-lede">Loading bookings…</p>
        ) : !isLoggedIn ? (
          <div className="empty-shelf">
            <i className="bi bi-journal-check" aria-hidden />
            <h2>Sign in to view bookings</h2>
            <p>Your submitted bookings will appear here after you log in.</p>
            <button type="button" className="btn btn-primary" onClick={() => openAuthModal('login')}>
              Log in
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-shelf">
            <i className="bi bi-journal-check" aria-hidden />
            <h2>No bookings yet</h2>
            <p>Book a MARINA-accredited course to see confirmations here.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigateTo('courses')}>
              Browse courses
            </button>
          </div>
        ) : (
          <div className="shelf-list">
            {bookings.map((b) => (
              <article key={b.id} className="shelf-item">
                <div>
                  <span className="badge badge-teal">{b.status}</span>
                  <h3>{b.courseTitle}</h3>
                  <p>{b.provider}</p>
                  <p className="shelf-meta">
                    {b.scheduleDate} · {b.scheduleTime} · {b.location}
                  </p>
                  <p className="shelf-meta">
                    Confirmation <strong>{b.id}</strong> · {b.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
