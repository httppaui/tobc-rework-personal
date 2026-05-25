import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppProvider';
import { GUIDED_TOUR_STEPS, resolveTourTarget } from '../data/guidedTour';
import { cleanupTourDom } from '../lib/tourCleanup';
import { scrollTourTargetIntoView } from '../lib/tourScroll';
import {
  popoverPosition,
  spotlightFromElement,
  tourShieldPanels,
  type PopoverPos,
  type SpotlightRect,
} from '../lib/tourPosition';

function blockPointer(e: React.MouseEvent | React.PointerEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function TourDimPanels({ spot }: { spot: SpotlightRect }) {
  return (
    <>
      {tourShieldPanels(spot).map((panel, i) => (
        <div
          key={i}
          className="tour-panel"
          aria-hidden
          style={
            {
              position: 'fixed',
              top: panel.top,
              left: panel.left,
              width: panel.width,
              height: panel.height,
            } as CSSProperties
          }
          onClick={blockPointer}
          onMouseDown={blockPointer}
          onPointerDown={blockPointer}
        />
      ))}
    </>
  );
}

export function GuidedTour() {
  const {
    tourOpen,
    tourStepIndex,
    nextTourStep,
    prevTourStep,
    endTour,
    navigateTo,
    closeCourseDetail,
    closePartnerDetail,
  } = useApp();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<SpotlightRect | null>(null);
  const [popoverPos, setPopoverPos] = useState<PopoverPos>({ top: 0, left: 0, placement: 'center' });
  const [targetMissing, setTargetMissing] = useState(false);

  const step = GUIDED_TOUR_STEPS[tourStepIndex];
  const total = GUIDED_TOUR_STEPS.length;
  const isLast = tourStepIndex >= total - 1;

  const measure = useCallback(() => {
    if (!tourOpen || !step) return;
    const el = resolveTourTarget(step);
    if (!el) {
      setTargetMissing(true);
      setSpot(null);
      const pop = popoverRef.current;
      const w = pop?.offsetWidth ?? 320;
      const h = pop?.offsetHeight ?? 200;
      setPopoverPos(popoverPosition(null, 'center', w, h));
      return;
    }
    setTargetMissing(false);
    const nextSpot = spotlightFromElement(el);
    setSpot(nextSpot);
    const pop = popoverRef.current;
    const w = pop?.offsetWidth ?? 320;
    const h = pop?.offsetHeight ?? 200;
    setPopoverPos(popoverPosition(nextSpot, step.placement, w, h));
  }, [tourOpen, step]);

  useEffect(() => {
    if (tourOpen) return;
    cleanupTourDom();
  }, [tourOpen]);

  useEffect(() => {
    if (!tourOpen || !step?.page) return;
    closeCourseDetail();
    closePartnerDetail();
    navigateTo(step.page);
  }, [
    tourOpen,
    tourStepIndex,
    step?.page,
    navigateTo,
    closeCourseDetail,
    closePartnerDetail,
  ]);

  useLayoutEffect(() => {
    if (!tourOpen || !step) return;
    const delay = step.page ? 220 : step.scrollIntoView ? 50 : 0;
    const timer = window.setTimeout(() => {
      if (step.scrollIntoView) {
        const el = resolveTourTarget(step);
        if (el) scrollTourTargetIntoView(el);
      }
      measure();
      if (step.scrollIntoView) {
        window.setTimeout(measure, 100);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [measure, tourOpen, tourStepIndex, step]);

  useEffect(() => {
    if (!tourOpen) return;
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [tourOpen, measure]);

  useEffect(() => () => cleanupTourDom(), []);

  if (!tourOpen || !step) return null;

  const hasSpotlight = spot && !targetMissing;
  /** Interactive steps: popover only — page stays fully clickable */
  const showShield = hasSpotlight && !step.interactive;

  const tourUi = (
    <div className="tour-root" role="presentation">
      {showShield ? (
        <>
          <TourDimPanels spot={spot} />
          <div
            className="tour-spotlight-ring"
            aria-hidden
            style={{
              top: spot.top,
              left: spot.left,
              width: spot.width,
              height: spot.height,
            }}
          />
        </>
      ) : !step.interactive ? (
        <div
          className="tour-backdrop tour-backdrop--dim"
          aria-hidden
          onClick={blockPointer}
          onMouseDown={blockPointer}
          onPointerDown={blockPointer}
        />
      ) : null}
      <div
        ref={popoverRef}
        className="tour-popover"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tourStepTitle"
        aria-describedby="tourStepBody"
        style={{ top: popoverPos.top, left: popoverPos.left }}
        data-placement={popoverPos.placement}
      >
        <div className="tour-popover-head">
          <span className="tour-step-badge">
            Step {tourStepIndex + 1} of {total}
          </span>
          <button type="button" className="tour-skip" onClick={endTour}>
            Skip tour
          </button>
        </div>
        <h3 id="tourStepTitle">{step.title}</h3>
        <p id="tourStepBody">{step.body}</p>
        <ul className="tour-checklist" aria-label="Tour progress">
          {GUIDED_TOUR_STEPS.map((s, i) => (
            <li
              key={s.id}
              className={
                i < tourStepIndex ? 'done' : i === tourStepIndex ? 'current' : ''
              }
            >
              <span className="tour-check-icon" aria-hidden>
                {i < tourStepIndex ? '✓' : i === tourStepIndex ? '●' : '○'}
              </span>
              <span className="visually-hidden">
                {i < tourStepIndex ? 'Completed: ' : i === tourStepIndex ? 'Current: ' : ''}
              </span>
              {s.title}
            </li>
          ))}
        </ul>
        <div className="tour-popover-actions">
          <button
            type="button"
            className="btn btn-secondary btn--sm"
            onClick={prevTourStep}
            disabled={tourStepIndex === 0}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary btn--sm"
            onClick={isLast ? endTour : nextTourStep}
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(tourUi, document.body);
}
