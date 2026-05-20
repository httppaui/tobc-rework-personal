import { useEffect, useState } from 'react';
import type { Course } from '../../data/courses';

export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH')}`;
}

type CartOrderSummaryProps = {
  courses: Course[];
  total: number;
  selectedCount: number;
  onBookNow: () => void;
  bookDisabled?: boolean;
};

export function CartOrderSummary({
  courses,
  total,
  selectedCount,
  onBookNow,
  bookDisabled,
}: CartOrderSummaryProps) {
  const multiCourse = courses.length > 1;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const courseKey = courses.map((c) => c.id).join(',');

  useEffect(() => {
    setExpandedIds(new Set());
  }, [courseKey, multiCourse]);

  const toggleLine = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="cart-order-summary" aria-labelledby="cart-summary-heading">
      <div className="cart-order-summary-inner booking-summary">
        <div className="bs-label" id="cart-summary-heading">
          Booking details
        </div>
        {courses.length === 0 ? (
          <p className="cart-summary-empty">Select courses to see your order summary.</p>
        ) : (
          <>
            <p className="cart-summary-count">
              {selectedCount} course{selectedCount === 1 ? '' : 's'} selected
            </p>
            {multiCourse ? (
              <p className="cart-summary-hint">Tap a course title to show details.</p>
            ) : null}
            <ul className="cart-summary-lines">
              {courses.map((course) => {
                const expanded = !multiCourse || expandedIds.has(course.id);
                const detailsId = `cart-summary-details-${course.id}`;

                return (
                  <li
                    key={course.id}
                    className={`cart-summary-line${multiCourse ? ' cart-summary-line--collapsible' : ''}${
                      expanded && multiCourse ? ' is-expanded' : ''
                    }`}
                  >
                    {multiCourse ? (
                      <button
                        type="button"
                        className="cart-summary-line-toggle"
                        aria-expanded={expanded}
                        aria-controls={detailsId}
                        onClick={() => toggleLine(course.id)}
                      >
                        <span className="bs-course-name cart-summary-line-title">{course.title}</span>
                        <i
                          className={`bi bi-chevron-down cart-summary-line-chevron${expanded ? ' is-open' : ''}`}
                          aria-hidden
                        />
                      </button>
                    ) : (
                      <div className="bs-course-name cart-summary-line-title">{course.title}</div>
                    )}
                    <div
                      id={detailsId}
                      className="cart-summary-line-details"
                      hidden={multiCourse && !expanded}
                    >
                      <div className="bs-row">
                        <span>Training center</span>
                        <span>{course.provider}</span>
                      </div>
                      <div className="bs-row">
                        <span>Location</span>
                        <span>{course.location}</span>
                      </div>
                      <div className="bs-row">
                        <span>Duration</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="bs-row">
                        <span>Category</span>
                        <span>{course.category}</span>
                      </div>
                      <div className="bs-row cart-summary-line-price">
                        <span>Course fee</span>
                        <span>{course.price}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="bs-total">
              <span>Total</span>
              <span>{formatPeso(total)}</span>
            </div>
          </>
        )}
        <button
          type="button"
          className="btn btn-primary cart-summary-book-btn"
          onClick={onBookNow}
          disabled={bookDisabled || selectedCount === 0}
        >
          Book now
        </button>
        {selectedCount > 1 ? (
          <p className="cart-summary-note">
            Checkout runs one course at a time. After you confirm, return here to book the rest.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
