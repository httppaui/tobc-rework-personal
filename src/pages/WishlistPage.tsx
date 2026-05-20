import { useApp } from '../context/AppProvider';
import { getCourseById } from '../lib/courseCatalog';

export function WishlistPage() {
  const {
    wishlistIds,
    removeFromWishlist,
    openCourseDetail,
    startBookNow,
    navigateTo,
  } = useApp();

  const courses = wishlistIds.map((id) => getCourseById(id)).filter(Boolean);

  return (
    <section className="section" style={{ background: 'var(--paper)' }}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>
            Home
          </button>
          <span className="sep">/</span>
          <span className="current" aria-current="page">
            Wishlist
          </span>
        </nav>
        <h1 className="page-title">My Wishlist</h1>
        <p className="page-lede">Courses you saved for later.</p>

        {courses.length === 0 ? (
          <div className="empty-shelf">
            <i className="bi bi-heart" aria-hidden />
            <h2>No saved courses yet</h2>
            <p>Browse courses and tap the heart icon to add them here.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigateTo('courses')}>
              Browse courses
            </button>
          </div>
        ) : (
          <div className="shelf-list">
            {courses.map((course) =>
              course ? (
                <article key={course.id} className="shelf-item">
                  <div>
                    <span className="badge badge-teal">{course.category}</span>
                    <h3>{course.title}</h3>
                    <p>{course.provider}</p>
                    <p className="shelf-meta">
                      {course.location} · {course.duration} · {course.price}
                    </p>
                  </div>
                  <div className="shelf-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn--sm"
                      onClick={() => openCourseDetail(course.id)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn--sm"
                      onClick={() => startBookNow(course.id)}
                    >
                      Book now
                    </button>
                    <button
                      type="button"
                      className="btn-ghost-inline"
                      onClick={() => {
                        removeFromWishlist(course.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ) : null,
            )}
          </div>
        )}
      </div>
    </section>
  );
}
