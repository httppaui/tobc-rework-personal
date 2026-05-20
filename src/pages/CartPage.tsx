import { useEffect, useMemo, useState } from 'react';
import type { Course } from '../data/courses';
import { CartOrderSummary } from '../components/cart/CartOrderSummary';
import { useApp } from '../context/AppProvider';
import { getCourseById } from '../lib/courseCatalog';

function matchesCartSearch(course: Course, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    course.title.toLowerCase().includes(q) ||
    course.provider.toLowerCase().includes(q) ||
    course.category.toLowerCase().includes(q) ||
    course.location.toLowerCase().includes(q)
  );
}

export function CartPage() {
  const { cartIds, removeFromCart, openCourseDetail, startBookNow, navigateTo, toast } = useApp();
  const [searchQ, setSearchQ] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const courses = useMemo(
    () => cartIds.map((id) => getCourseById(id)).filter((c): c is Course => Boolean(c)),
    [cartIds],
  );

  useEffect(() => {
    setSelectedIds((prev) => {
      const kept = prev.filter((id) => cartIds.includes(id));
      const added = cartIds.filter((id) => !kept.includes(id));
      if (kept.length === 0 && cartIds.length > 0) return [...cartIds];
      return [...kept, ...added];
    });
  }, [cartIds]);

  const filteredCourses = useMemo(
    () => courses.filter((c) => matchesCartSearch(c, searchQ)),
    [courses, searchQ],
  );

  const selectedCourses = useMemo(
    () => courses.filter((c) => selectedIds.includes(c.id)),
    [courses, selectedIds],
  );

  const total = useMemo(
    () => selectedCourses.reduce((sum, c) => sum + c.priceNum, 0),
    [selectedCourses],
  );

  const allFilteredSelected =
    filteredCourses.length > 0 && filteredCourses.every((c) => selectedIds.includes(c.id));

  const toggleCourse = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredSet = new Set(filteredCourses.map((c) => c.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      const ids = filteredCourses.map((c) => c.id);
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const handleBookNow = () => {
    const ids = selectedIds.filter((id) => cartIds.includes(id));
    if (ids.length === 0) {
      toast('Select at least one course to book', 'error');
      return;
    }
    if (ids.length > 1) {
      toast('Starting checkout for your first selected course', 'info');
    }
    startBookNow(ids[0]);
  };

  return (
    <section className="section cart-page">
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
        <p className="page-lede">Select courses to book, then review your order summary.</p>

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
          <>
            <div className="cart-toolbar">
              <div className="cart-search-wrap">
                <i className="bi bi-search cart-search-icon" aria-hidden />
                <input
                  type="search"
                  className="cart-search"
                  placeholder="Search your cart by course, provider, or location…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  aria-label="Search cart"
                />
              </div>
              <label className="cart-select-all">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAllFiltered}
                  disabled={filteredCourses.length === 0}
                />
                <span>Select all{searchQ.trim() ? ' shown' : ''}</span>
              </label>
            </div>

            <div className="cart-layout">
              <div className="cart-items-panel">
                {filteredCourses.length === 0 ? (
                  <p className="cart-no-results">No cart items match &ldquo;{searchQ}&rdquo;.</p>
                ) : (
                  <ul className="cart-item-list">
                    {filteredCourses.map((course) => {
                      const selected = selectedIds.includes(course.id);
                      return (
                        <li key={course.id}>
                          <article className={`cart-item${selected ? ' is-selected' : ''}`}>
                            <label className="cart-item-check">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleCourse(course.id)}
                                aria-label={`Select ${course.title}`}
                              />
                            </label>
                            <div className="cart-item-body">
                              <span className="badge badge-teal">{course.category}</span>
                              <h3>{course.title}</h3>
                              <p>{course.provider}</p>
                              <p className="cart-item-meta">
                                {course.location} · {course.duration} · <strong>{course.price}</strong>
                              </p>
                            </div>
                            <div className="cart-item-actions">
                              <button
                                type="button"
                                className="btn btn-secondary btn--sm"
                                onClick={() => openCourseDetail(course.id)}
                              >
                                View
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
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <CartOrderSummary
                courses={selectedCourses}
                total={total}
                selectedCount={selectedCourses.length}
                onBookNow={handleBookNow}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
