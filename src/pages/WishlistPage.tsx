import { useEffect, useMemo, useState } from 'react';
import type { Course } from '../data/courses';
import { ShelfPageHero } from '../components/layout/ShelfPageHero';
import { useApp } from '../context/AppProvider';
import { getCourseById } from '../lib/courseCatalog';

function matchesSearch(course: Course, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    course.title.toLowerCase().includes(q) ||
    course.provider.toLowerCase().includes(q) ||
    course.category.toLowerCase().includes(q) ||
    course.location.toLowerCase().includes(q)
  );
}

export function WishlistPage() {
  const {
    wishlistIds,
    removeFromWishlist,
    openCourseDetail,
    startBookNow,
    navigateTo,
    toast,
  } = useApp();

  const [searchQ, setSearchQ] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const courses = useMemo(
    () => wishlistIds.map((id) => getCourseById(id)).filter((c): c is Course => Boolean(c)),
    [wishlistIds],
  );

  useEffect(() => {
    setSelectedIds((prev) => {
      const kept = prev.filter((id) => wishlistIds.includes(id));
      const added = wishlistIds.filter((id) => !kept.includes(id));
      if (kept.length === 0 && wishlistIds.length > 0) return [...wishlistIds];
      return [...kept, ...added];
    });
  }, [wishlistIds]);

  const filteredCourses = useMemo(
    () => courses.filter((c) => matchesSearch(c, searchQ)),
    [courses, searchQ],
  );

  const allFilteredSelected =
    filteredCourses.length > 0 && filteredCourses.every((c) => selectedIds.includes(c.id));

  const selectedCount = selectedIds.filter((id) => wishlistIds.includes(id)).length;

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
    const ids = selectedIds.filter((id) => wishlistIds.includes(id));
    if (ids.length === 0) {
      toast('Select at least one course to book', 'error');
      return;
    }
    if (ids.length > 1) {
      toast('Starting checkout for your first selected course', 'info');
    }
    startBookNow(ids[0]);
  };

  const handleRemoveSelected = () => {
    const ids = selectedIds.filter((id) => wishlistIds.includes(id));
    if (ids.length === 0) {
      toast('Select at least one course to remove', 'error');
      return;
    }
    ids.forEach((id) => removeFromWishlist(id));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    toast(
      ids.length === 1 ? 'Removed from wishlist' : `Removed ${ids.length} courses from wishlist`,
      'success',
    );
  };

  const wishlistStatus =
    courses.length > 0 ? (
      <div className="chat-status-pill" role="status">
        <span className="chat-status-dot" aria-hidden />
        {courses.length} saved course{courses.length === 1 ? '' : 's'}
        {selectedCount > 0 ? ` · ${selectedCount} selected` : ''}
      </div>
    ) : undefined;

  return (
    <div className="wishlist-page">
      <ShelfPageHero
        breadcrumbLabel="Wishlist"
        title="My Wishlist"
        description="Save courses you are considering, then book or remove them when you are ready."
        status={wishlistStatus}
      />
      <div className="shelf-page-body">
        <div className="container">
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
          <>
            <div className="shelf-toolbar">
              <div className="shelf-search-wrap">
                <i className="bi bi-search shelf-search-icon" aria-hidden />
                <input
                  type="search"
                  className="shelf-search"
                  placeholder="Search wishlist by course, provider, or location…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  aria-label="Search wishlist"
                />
              </div>
              <div className="shelf-toolbar-actions">
                <label className="shelf-select-all">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                    disabled={filteredCourses.length === 0}
                  />
                  <span>Select all{searchQ.trim() ? ' shown' : ''}</span>
                </label>
                <div className="shelf-bulk-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn--sm"
                    onClick={handleRemoveSelected}
                    disabled={selectedCount === 0}
                  >
                    Remove selected
                    {selectedCount > 0 ? ` (${selectedCount})` : ''}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn--sm"
                    onClick={handleBookNow}
                    disabled={selectedCount === 0}
                  >
                    Book now
                    {selectedCount > 0 ? ` (${selectedCount})` : ''}
                  </button>
                </div>
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <p className="shelf-no-results">No wishlist items match &ldquo;{searchQ}&rdquo;.</p>
            ) : (
              <ul className="shelf-item-list">
                {filteredCourses.map((course) => {
                  const selected = selectedIds.includes(course.id);
                  return (
                    <li key={course.id}>
                      <article className={`shelf-item shelf-item--selectable${selected ? ' is-selected' : ''}`}>
                        <label className="shelf-item-check">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleCourse(course.id)}
                            aria-label={`Select ${course.title}`}
                          />
                        </label>
                        <div className="shelf-item-body">
                          <span className="badge badge-teal">{course.category}</span>
                          <h3>{course.title}</h3>
                          <p>{course.provider}</p>
                          <p className="shelf-meta">
                            {course.location} · {course.duration} · <strong>{course.price}</strong>
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
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}
