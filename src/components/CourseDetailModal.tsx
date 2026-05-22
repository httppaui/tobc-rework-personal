import { useEffect, useId, useState, type ReactNode } from 'react';
import { useApp } from '../context/AppProvider';
import {
  COURSE_DETAIL_TABS,
  courseDetailPdfFilename,
  getCourseById,
  getCourseCancellationPolicy,
  getCourseCancellationPolicyPdf,
  getCourseDescription,
  getCourseEntryRequirementsPdf,
  getCourseEntryStandards,
  getCourseTrainingOutcomes,
  type CourseDetailTabId,
} from '../lib/courseCatalog';

function formatDetailText(text: string) {
  return text.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('•')) {
      const items = trimmed.split('\n').map((line) => line.replace(/^•\s*/, '').trim());
      return (
        <ul key={i} className="course-detail-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="course-detail-desc">
        {trimmed}
      </p>
    );
  });
}

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

  const tabListId = useId();
  const [activeTab, setActiveTab] = useState<CourseDetailTabId>('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [courseDetailId]);

  if (!courseDetailId) return null;
  const course = getCourseById(courseDetailId);
  if (!course) return null;

  const inWishlist = isInWishlist(course.id);
  const inCart = isInCart(course.id);
  const entryPdf = getCourseEntryRequirementsPdf(course);
  const cancellationPdf = getCourseCancellationPolicyPdf(course);

  const panelContent: Record<CourseDetailTabId, ReactNode> = {
    overview: formatDetailText(getCourseDescription(course)),
    outcomes: formatDetailText(getCourseTrainingOutcomes(course)),
    entry: (
      <>
        {formatDetailText(getCourseEntryStandards(course))}
        <a
          className="course-detail-pdf-btn"
          href={entryPdf}
          download={courseDetailPdfFilename(course, 'entry')}
        >
          <i className="bi bi-file-earmark-pdf" aria-hidden />
          Download requirements (PDF)
        </a>
      </>
    ),
    cancellation: (
      <>
        {formatDetailText(getCourseCancellationPolicy(course))}
        <a
          className="course-detail-pdf-btn"
          href={cancellationPdf}
          download={courseDetailPdfFilename(course, 'cancellation')}
        >
          <i className="bi bi-file-earmark-pdf" aria-hidden />
          Download cancellation policy (PDF)
        </a>
      </>
    ),
  };

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
          <div className="course-detail-hero" style={{ background: course.gradient }}>
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

          <div className="course-detail-tabs-wrap">
            <div className="course-detail-tabs" role="tablist" aria-label="Course information" id={tabListId}>
              {COURSE_DETAIL_TABS.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`${tabListId}-${tab.id}`}
                    className={`course-detail-tab${selected ? ' is-active' : ''}`}
                    aria-selected={selected}
                    aria-controls={`${tabListId}-panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {COURSE_DETAIL_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                id={`${tabListId}-panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`${tabListId}-${tab.id}`}
                hidden={!selected}
                className="course-detail-panel"
              >
                {selected ? panelContent[tab.id] : null}
              </div>
            );
          })}
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
