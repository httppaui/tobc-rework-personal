import { useEffect, useMemo, useState } from 'react';
import type { Course } from '../data/courses';
import { CartOrderSummary } from '../components/cart/CartOrderSummary';
import { ShelfPageHero } from '../components/layout/ShelfPageHero';
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
  const {
    cartIds,
    removeFromCart,
    openCourseDetail,
    startCheckout,
    navigateTo,
    toast,
    isLoggedIn,
    authSessionReady,
    authEnabled,
    openAuthModal,
  } = useApp();
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

  const selectedCount = selectedIds.filter((id) => cartIds.includes(id)).length;

  const handleBookNow = () => {
    const ids = selectedIds.filter((id) => cartIds.includes(id));
    if (ids.length === 0) {
      toast('Select at least one course to book', 'error');
      return;
    }
    startCheckout(ids);
  };

  const handleRemoveSelected = () => {
    const ids = selectedIds.filter((id) => cartIds.includes(id));
    if (ids.length === 0) {
      toast('Select at least one course to remove', 'error');
      return;
    }
    ids.forEach((id) => removeFromCart(id));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    toast(ids.length === 1 ? 'Removed from cart' : `Removed ${ids.length} courses from cart`, 'success');
  };

  const cartStatus =
    courses.length > 0 ? (
      <div className="chat-status-pill" role="status">
        <span className="chat-status-dot" aria-hidden />
        {courses.length} course{courses.length === 1 ? '' : 's'} in cart
        {selectedCount > 0 ? ` · ${selectedCount} selected` : ''}
      </div>
    ) : undefined;

  return (
    <div className="cart-page">
      <ShelfPageHero
        breadcrumbLabel="Cart"
        title="My Cart"
        description="Select courses to book, then review your order summary."
        status={cartStatus}
      />
      <div className="shelf-page-body">
        <div className="container">
        {!authSessionReady ? (
          <p className="page-lede">Loading…</p>
        ) : !isLoggedIn ? (
          <div className="empty-shelf">
            <i className="bi bi-cart3" aria-hidden />
            <h2>{authEnabled ? 'Sign in to use your cart' : 'Cart & booking coming soon'}</h2>
            <p>
              {authEnabled
                ? 'Add courses from the catalog and book them when you are ready.'
                : 'Account sign-in is paused while we finish setup. Browse courses in the meantime.'}
            </p>
            {authEnabled ? (
              <button type="button" className="btn btn-primary" onClick={() => openAuthModal('login')}>
                Log in
              </button>
            ) : null}
          </div>
        ) : courses.length === 0 ? (
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
              <div className="cart-toolbar-actions">
                <label className="cart-select-all">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                    disabled={filteredCourses.length === 0}
                  />
                  <span>Select all{searchQ.trim() ? ' shown' : ''}</span>
                </label>
                <div className="cart-bulk-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn--sm"
                    onClick={handleRemoveSelected}
                    disabled={selectedCount === 0}
                  >
                    Remove selected
                    {selectedCount > 0 ? ` (${selectedCount})` : ''}
                  </button>
                </div>
              </div>
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
      </div>
    </div>
  );
}
