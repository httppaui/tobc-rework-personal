import type { TourPlacement } from '../data/guidedTour';

const SPOTLIGHT_PAD = 8;
/** Gap between dim panels and spotlight so the target is not covered at the edges */
const SHIELD_GAP = 4;
const POPOVER_GAP = 14;
const VIEWPORT_PAD = 12;

export interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PopoverPos {
  top: number;
  left: number;
  placement: TourPlacement;
}

export function spotlightFromElement(el: HTMLElement): SpotlightRect {
  const r = el.getBoundingClientRect();
  return {
    top: Math.max(VIEWPORT_PAD, r.top - SPOTLIGHT_PAD),
    left: Math.max(VIEWPORT_PAD, r.left - SPOTLIGHT_PAD),
    width: r.width + SPOTLIGHT_PAD * 2,
    height: r.height + SPOTLIGHT_PAD * 2,
  };
}

export interface TourShieldPanel {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Four fixed panels around the spotlight — nothing covers the hole. */
export function tourShieldPanels(spot: SpotlightRect): TourShieldPanel[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const holeTop = spot.top + SHIELD_GAP;
  const holeLeft = spot.left + SHIELD_GAP;
  const holeRight = spot.left + spot.width - SHIELD_GAP;
  const holeBottom = spot.top + spot.height - SHIELD_GAP;
  const holeH = Math.max(0, holeBottom - holeTop);
  return [
    { top: 0, left: 0, width: vw, height: Math.max(0, holeTop) },
    { top: holeTop, left: 0, width: Math.max(0, holeLeft), height: holeH },
    { top: holeTop, left: holeRight, width: Math.max(0, vw - holeRight), height: holeH },
    { top: holeBottom, left: 0, width: vw, height: Math.max(0, vh - holeBottom) },
  ].filter((p) => p.width > 0 && p.height > 0);
}

export function popoverPosition(
  spot: SpotlightRect | null,
  placement: TourPlacement,
  popoverW: number,
  popoverH: number,
): PopoverPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!spot || placement === 'center') {
    return {
      top: Math.max(VIEWPORT_PAD, (vh - popoverH) / 2),
      left: Math.max(VIEWPORT_PAD, (vw - popoverW) / 2),
      placement: 'center',
    };
  }

  let top = spot.top + spot.height + POPOVER_GAP;
  let left = spot.left + spot.width / 2 - popoverW / 2;
  let resolved: TourPlacement = placement;

  if (placement === 'top') {
    top = spot.top - popoverH - POPOVER_GAP;
  } else if (placement === 'left') {
    top = spot.top + spot.height / 2 - popoverH / 2;
    left = spot.left - popoverW - POPOVER_GAP;
  } else if (placement === 'right') {
    top = spot.top + spot.height / 2 - popoverH / 2;
    left = spot.left + spot.width + POPOVER_GAP;
  }

  if (top + popoverH > vh - VIEWPORT_PAD) {
    top = spot.top - popoverH - POPOVER_GAP;
    resolved = 'top';
  }
  if (top < VIEWPORT_PAD) {
    top = spot.top + spot.height + POPOVER_GAP;
    resolved = 'bottom';
  }

  left = Math.min(Math.max(VIEWPORT_PAD, left), vw - popoverW - VIEWPORT_PAD);
  top = Math.min(Math.max(VIEWPORT_PAD, top), vh - popoverH - VIEWPORT_PAD);

  return { top, left, placement: resolved };
}
