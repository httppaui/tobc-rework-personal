import { useApp } from '../context/AppProvider';
import { getCourseById, getCourseDescription } from '../lib/courseCatalog';

export function CourseDetailModal() {
  const {
    courseDetailId,
    closeCourseDetail,
    addToWishlist,
    addToCart,
    startBookNow,
    isInWishlist,
    isInCart,
    navigateTo,
  } = useApp();

  if (!courseDetailId) return null;
  const course = getCourseById(courseDetailId);
  if (!course) return null;

  const inWishlist = isInWishlist(course.id);
  const inCart = isInCart(course.id);

  return (
    <div
      className="course-detail-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCourseDetail();
      }}
      role="presentation"
    >
      <div className="course-detail-modal" role="dialog" aria-modal="true" aria-labelledby="courseDetailTitle">
        <div className="course-detail-head">
          <div>
            <span className={`badge ${course.category === 'STCW' ? 'badge-teal' : 'badge-amber'}`}>
              {course.category}
            </span>
            <h2 id="courseDetailTitle">{course.title}</h2>
            <p className="course-detail-provider">{course.provider}</p>
          </div>
          <button type="button" onClick={closeCourseDetail} aria-label="Close">
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div className="course-detail-body">
          <div
            className="course-detail-hero"
            style={{ background: course.gradient }}
          >
            <i className={`bi ${course.icon}`} aria-hidden />
          </div>
          <div className="course-detail-meta">
            <span>
              <i className="bi bi-geo-alt" aria-hidden /> {course.location}
            </span>
            <span>
              <i className="bi bi-clock" aria-hidden /> {course.duration}
            </span>
            <span>
              <i className="bi bi-calendar3" aria-hidden /> {course.dates}
            </span>
            <span className="course-detail-price">{course.price}</span>
          </div>
          <h3>About this course</h3>
          <p className="course-detail-desc">{getCourseDescription(course)}</p>
        </div>
        <div className="course-detail-footer">
          <button
            type="button"
            className={`course-detail-btn course-detail-btn--outline${inWishlist ? ' is-active' : ''}`}
            onClick={() => {
              if (inWishlist) navigateTo('wishlist');
              else addToWishlist(course.id);
            }}
          >
            <i className={`bi ${inWishlist ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden />
            <span>{inWishlist ? 'View wishlist' : 'Add to wishlist'}</span>
          </button>
          <button
            type="button"
            className={`course-detail-btn course-detail-btn--outline${inCart ? ' is-active' : ''}`}
            onClick={() => {
              if (inCart) navigateTo('cart');
              else addToCart(course.id);
            }}
          >
            <i className="bi bi-cart3" aria-hidden />
            <span>{inCart ? 'View cart' : 'Add to cart'}</span>
          </button>
          <button
            type="button"
            className="course-detail-btn course-detail-btn--primary"
            onClick={() => startBookNow(course.id)}
          >
            <i className="bi bi-calendar-check" aria-hidden />
            <span>Book now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
