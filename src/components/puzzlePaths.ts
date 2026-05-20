/**
 * Jigsaw paths (400×400 viewBox) — matches reference assembly:
 * TL right tab + bottom socket | TR left socket + bottom tab
 * BL top tab + right socket | BR top socket + left tab
 */
import type { PuzzleKey } from '../types';

export type PuzzleCorner = 'tl' | 'tr' | 'bl' | 'br';

/** Back → front paint / hit order */
export const PUZZLE_RENDER_ORDER: PuzzleCorner[] = ['br', 'tr', 'tl', 'bl'];

export const PUZZLE_HIT_ORDER: PuzzleCorner[] = PUZZLE_RENDER_ORDER;

export const PUZZLE_CORNER_TO_KEY: Record<PuzzleCorner, PuzzleKey> = {
  tl: 'platform',
  tr: 'mission',
  bl: 'story',
  br: 'vision',
};

/** Center of each quadrant — for hover lift origin */
export const PUZZLE_ORIGIN: Record<PuzzleCorner, { x: number; y: number }> = {
  tl: { x: 100, y: 100 },
  tr: { x: 300, y: 100 },
  bl: { x: 100, y: 300 },
  br: { x: 300, y: 300 },
};

const R = 28;

export const PUZZLE_PIECE_PATHS: Record<PuzzleCorner, string> = {
  tl: `M0,0 H200 V72 A${R} ${R} 0 0 1 200 128 V200 H128 A${R} ${R} 0 0 0 72 200 H0 Z`,
  tr: `M200,0 H400 V200 H328 A${R} ${R} 0 0 1 272 200 H200 V128 A${R} ${R} 0 0 0 200 72 V0 H200 Z`,
  bl: `M0,400 H200 V328 A${R} ${R} 0 0 1 200 272 V200 H128 A${R} ${R} 0 0 0 72 200 H0 V400 Z`,
  br: `M200,200 H272 A${R} ${R} 0 0 0 328 200 H400 V400 H200 V328 A${R} ${R} 0 0 1 200 272 V200 Z`,
};

export const PUZZLE_PIECE_SVG: Record<PuzzleCorner, string> = {
  tl: '/assets/images/about/puzzle-piece-platform.svg',
  tr: '/assets/images/about/puzzle-piece-mission.svg',
  bl: '/assets/images/about/puzzle-piece-story.svg',
  br: '/assets/images/about/puzzle-piece-vision.svg',
};
