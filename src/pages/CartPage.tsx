import { useApp } from '../context/AppProvider';
import { getCourseById } from '../lib/courseCatalog';

export function CartPage() {
  const { cartIds, removeFromCart, openCourseDetail, startBookNow, navigateTo } = useApp();

  const courses = cartIds.map((id) => getCourseById(id)).filter(Boolean);

  return (
    <section className="section" style={{ background: 'var(--paper)' }}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>
            Home
          </button>
          <span className="sep">/</span>
          <span className="current" aria-current="page">
            Cart
          </span>
        </nav>
        <h1 className="page-title">My Cart</h1>
        <p className="page-lede">Review courses before you book.</p>

        {courses.length === 0 ? (
          <div className="empty-shelf">
            <i className="bi bi-cart3" aria-hidden />
            <h2>Your cart is empty</h2>
            <p>Add courses from the catalog to book them later.</p>
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
                      onClick={() => removeFromCart(course.id)}
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
