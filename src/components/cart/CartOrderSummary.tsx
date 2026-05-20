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
            <ul className="cart-summary-lines">
              {courses.map((course) => (
                <li key={course.id} className="cart-summary-line">
                  <div className="bs-course-name cart-summary-line-title">{course.title}</div>
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
                </li>
              ))}
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
