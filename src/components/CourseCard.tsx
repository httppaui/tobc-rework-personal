import type { MouseEvent } from 'react';
import type { Course } from '../data/courses';
import { useApp } from '../context/AppProvider';

function availabilityBadge(course: Course) {
  if (course.availability === 'critical' || course.seats <= 3) {
    return { className: 'badge badge-red', label: `${course.seats} left!` };
  }
  if (course.availability === 'low' || (course.seats <= 8 && course.seats > 3)) {
    return { className: 'badge badge-amber', label: `${course.seats} left` };
  }
  if (course.availability === 'open') {
    return { className: 'badge badge-purple', label: 'Others' };
  }
  return { className: 'badge badge-green', label: 'Available' };
}

function categoryBadgeClass(category: string) {
  return category === 'STCW' ? 'badge badge-white' : 'badge badge-amber';
}

export function CourseCard({ course, listMode }: { course: Course; listMode?: boolean }) {
  const {
    openCourseDetail,
    startBookNow,
    addToWishlist,
    removeFromWishlist,
    addToCart,
    removeFromCart,
    isInWishlist,
    isInCart,
  } = useApp();

  const inWishlist = isInWishlist(course.id);
  const inCart = isInCart(course.id);

  const openDetail = (e?: MouseEvent) => {
    e?.stopPropagation();
    openCourseDetail(course.id);
  };

  const book = (e?: MouseEvent) => {
    e?.stopPropagation();
    startBookNow(course.id);
  };

  const toggleWishlist = (e: MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) removeFromWishlist(course.id);
    else addToWishlist(course.id);
  };

  const toggleCart = (e: MouseEvent) => {
    e.stopPropagation();
    if (inCart) removeFromCart(course.id);
    else addToCart(course.id);
  };

  const seatsPct =
    course.availability === 'open'
      ? 95
      : course.seats <= 3
        ? 12
        : course.seats <= 6
          ? 22
          : course.seats <= 8
            ? 55
            : 76;
  const seatsCritical = course.seats <= 3;
  const seatsLow = course.seats > 3 && course.seats <= 8;
  const avail = availabilityBadge(course);
  const seatsLabel =
    course.availability === 'open' ? 'Open enrollment' : `${course.seats} seats left`;

  const statusBadges = (
    <>
      <div className="cc-badges-left">
        <span className={categoryBadgeClass(course.category)}>{course.category}</span>
        {course.id === 'achievers' && <span className="badge badge-amber">Non-STCW</span>}
      </div>
      <span className={avail.className}>{avail.label}</span>
    </>
  );

  return (
    <article
      className={`course-card${listMode ? ' list-mode' : ''}`}
      onClick={() => openDetail()}
      onKeyDown={(e) => e.key === 'Enter' && openDetail()}
      role="button"
      tabIndex={0}
    >
      <div className="course-card-img">
        <div className="cc-img-bg" style={{ background: course.gradient }} />
        <div className="cc-emoji">
          <i className={`bi ${course.icon}`} aria-hidden />
        </div>
        {!listMode ? <div className="cc-badges">{statusBadges}</div> : null}
        <button
          type="button"
          className={`cc-wishlist-btn${inWishlist ? ' is-active' : ''}`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={inWishlist}
          onClick={toggleWishlist}
        >
          <i className={`bi ${inWishlist ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden />
        </button>
      </div>
      <div className="course-card-body">
        {listMode ? (
          <>
            <div className="cc-list-row cc-list-row--head">
              <div className="cc-title">{course.title}</div>
              <div className="cc-badges cc-badges--list">{statusBadges}</div>
            </div>
            <div className="cc-list-row cc-list-row--sub">
              <div className="cc-provider">{course.provider}</div>
              <div className="cc-rating" aria-label="Rating 4.7 out of 5 from 186 reviews">
                <span className="cc-stars" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className="bi bi-star-fill" />
                  ))}
                </span>
                <span className="cc-rating-val">4.7</span>
                <span className="cc-rating-n">(186)</span>
              </div>
            </div>
            <div className="cc-list-row cc-list-row--meta">
              <div className="cc-toolbar">
                <button type="button" className="cc-desc-btn" onClick={openDetail}>
                  <i className="bi bi-card-text" aria-hidden />
                  View description
                </button>
              </div>
              <div className="cc-meta">
                <span className="cc-meta-item">
                  <i className="bi bi-clock cc-meta-ico" aria-hidden /> {course.duration}
                </span>
                <span className="cc-meta-item">
                  <i className="bi bi-geo-alt cc-meta-ico" aria-hidden /> {course.location}
                </span>
                <span className="cc-meta-item">
                  <i className="bi bi-calendar3 cc-meta-ico" aria-hidden />{' '}
                  {course.dates.split('–')[0]?.trim() ?? course.dates}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="cc-title">{course.title}</div>
            <div className="cc-provider">{course.provider}</div>
            <div className="cc-rating" aria-label="Rating 4.7 out of 5 from 186 reviews">
              <span className="cc-stars" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="bi bi-star-fill" />
                ))}
              </span>
              <span className="cc-rating-val">4.7</span>
              <span className="cc-rating-n">(186)</span>
            </div>
            <div className="cc-toolbar">
              <button type="button" className="cc-desc-btn" onClick={openDetail}>
                <i className="bi bi-card-text" aria-hidden />
                View description
              </button>
            </div>
            <div className="cc-meta">
              <span className="cc-meta-item">
                <i className="bi bi-clock cc-meta-ico" aria-hidden /> {course.duration}
              </span>
              <span className="cc-meta-item">
                <i className="bi bi-geo-alt cc-meta-ico" aria-hidden /> {course.location}
              </span>
              <span className="cc-meta-item">
                <i className="bi bi-calendar3 cc-meta-ico" aria-hidden />{' '}
                {course.dates.split('–')[0]?.trim() ?? course.dates}
              </span>
            </div>
          </>
        )}
        <div className="seats-bar">
          <div className="seats-track">
            <div
              className={`seats-fill${seatsCritical ? ' critical' : seatsLow ? ' low' : ''}`}
              style={{ width: `${seatsPct}%` }}
            />
          </div>
          <span
            className="seats-lbl"
            style={
              seatsCritical
                ? { color: 'var(--red)' }
                : seatsLow
                  ? { color: 'var(--amber)' }
                  : undefined
            }
          >
            {seatsLabel}
          </span>
        </div>
        <div className="cc-footer">
          <div className="cc-price">
            {course.price}
            <span className="cc-price-sub"> /person</span>
          </div>
          <div className="cc-footer-actions">
            <button
              type="button"
              className={`cc-cart-btn${inCart ? ' is-active' : ''}`}
              aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
              aria-pressed={inCart}
              onClick={toggleCart}
            >
              <i className={`bi ${inCart ? 'bi-cart-check-fill' : 'bi-cart-plus'}`} aria-hidden />
            </button>
            <button
              type="button"
              className="cc-book-btn"
              style={
                course.price === 'FREE'
                  ? { background: 'var(--amber)', color: 'var(--ink)' }
                  : undefined
              }
              onClick={book}
            >
              <span className="cc-cta-line1">Book now</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
