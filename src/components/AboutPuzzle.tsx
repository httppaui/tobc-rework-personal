import { useCallback, useEffect, useState } from 'react';
import aboutData from '../data/aboutPuzzle.json';
import type { AboutPuzzleData, PuzzleKey } from '../types';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  PUZZLE_CORNER_TO_KEY,
  PUZZLE_ORIGIN,
  PUZZLE_PIECE_PATHS,
  PUZZLE_RENDER_ORDER,
  type PuzzleCorner,
} from './puzzlePaths';
import { PuzzlePieceIcon } from './PuzzlePieceIcon';

const PUZZLE = aboutData as AboutPuzzleData;
const VB = 400;

const LEFT_SIDES: { key: PuzzleKey; corner: PuzzleCorner }[] = [
  { key: 'platform', corner: 'tl' },
  { key: 'story', corner: 'bl' },
];

const RIGHT_SIDES: { key: PuzzleKey; corner: PuzzleCorner }[] = [
  { key: 'mission', corner: 'tr' },
  { key: 'vision', corner: 'br' },
];

const GLOW: Record<PuzzleKey, string> = {
  platform:
    'drop-shadow(0 0 0 2px rgba(0,71,98,0.35)) drop-shadow(0 14px 36px rgba(0,71,98,0.45))',
  mission:
    'drop-shadow(0 0 0 2px rgba(255,117,0,0.4)) drop-shadow(0 14px 36px rgba(255,117,0,0.5))',
  story:
    'drop-shadow(0 0 0 2px rgba(253,186,97,0.45)) drop-shadow(0 14px 36px rgba(253,186,97,0.5))',
  vision:
    'drop-shadow(0 0 0 2px rgba(40,165,168,0.4)) drop-shadow(0 14px 36px rgba(40,165,168,0.5))',
};

export function AboutPuzzle() {
  const [hovered, setHovered] = useState<PuzzleCorner | null>(null);
  const [active, setActive] = useState<PuzzleKey | null>(null);
  const modalOpen = active !== null;
  const hotCorner =
    hovered ??
    (active
      ? (Object.entries(PUZZLE_CORNER_TO_KEY).find(([, k]) => k === active)?.[0] as PuzzleCorner)
      : null);

  const closeModal = useCallback(() => setActive(null), []);
  useEscapeKey([closeModal]);

  useEffect(() => {
    document.body.classList.toggle('about-modal-open', modalOpen);
    return () => document.body.classList.remove('about-modal-open');
  }, [modalOpen]);

  useEffect(() => {
    const root = document.documentElement;
    (Object.keys(PUZZLE) as PuzzleKey[]).forEach((key) => {
      root.style.setProperty(`--about-${key}`, PUZZLE[key].accent);
    });
    return () => {
      (Object.keys(PUZZLE) as PuzzleKey[]).forEach((key) => {
        root.style.removeProperty(`--about-${key}`);
      });
    };
  }, []);

  const hot = (corner: PuzzleCorner) =>
    hovered === corner || (active !== null && PUZZLE_CORNER_TO_KEY[corner] === active);

  const activate = (corner: PuzzleCorner) => setActive(PUZZLE_CORNER_TO_KEY[corner]);

  const interacting = hotCorner !== null;

  const renderOrder = hotCorner
    ? [...PUZZLE_RENDER_ORDER.filter((c) => c !== hotCorner), hotCorner]
    : PUZZLE_RENDER_ORDER;

  return (
    <>
      <section
        className={`section about-puzzle-section${modalOpen ? ' is-dimmed' : ''}`}
        id="aboutPuzzleSection"
        aria-labelledby="about-puzzle-heading"
      >
        <div className="container">
          <div className="section-header center">
            <span className="section-eyebrow">Who We Are</span>
            <h2 id="about-puzzle-heading">Built on Connection &amp; Collaboration</h2>
            <p className="about-puzzle-lead">Each piece fits together — click to explore what drives TOBC.</p>
          </div>

          <div className="about-puzzle-layout" onMouseLeave={() => setHovered(null)}>
            <div className="about-puzzle-labels-col about-puzzle-labels-col--left">
              {LEFT_SIDES.map(({ key, corner }) => (
                <SideBlock key={key} pieceKey={key} highlight={hot(corner)} />
              ))}
            </div>

            <div className="about-puzzle-stage">
              <div className={`about-puzzle-grid${interacting ? ' is-interacting' : ''}`}>
                <svg
                  className="about-puzzle-svg"
                  viewBox={`0 0 ${VB} ${VB}`}
                  role="group"
                  aria-label="Four puzzle pieces representing Platform, Mission, Our Story, and Vision"
                >
                  {renderOrder.map((corner) => {
                    const key = PUZZLE_CORNER_TO_KEY[corner];
                    const { x, y } = PUZZLE_ORIGIN[corner];
                    const isHot = hotCorner === corner;
                    return (
                      <g
                        key={corner}
                        className={`about-puzzle-piece about-puzzle-piece--${corner}${isHot ? ' is-hot' : ''}${interacting && !isHot ? ' is-dimmed' : ''}${active === key ? ' is-active' : ''}`}
                        style={{
                          transformOrigin: `${x}px ${y}px`,
                          filter: isHot ? GLOW[key] : undefined,
                        }}
                      >
                        <defs>
                          <clipPath id={`about-puzzle-clip-${corner}`}>
                            <path d={PUZZLE_PIECE_PATHS[corner]} />
                          </clipPath>
                        </defs>
                        <g clipPath={`url(#about-puzzle-clip-${corner})`} className="about-puzzle-piece-art">
                          <path
                            d={PUZZLE_PIECE_PATHS[corner]}
                            fill={PUZZLE[key].accent}
                            className="about-puzzle-piece-fill"
                          />
                          <PuzzlePieceIcon pieceKey={key} icon={PUZZLE[key].icon} corner={corner} />
                        </g>
                        <path
                          d={PUZZLE_PIECE_PATHS[corner]}
                          fill="transparent"
                          className="about-puzzle-piece-hit"
                          role="button"
                          tabIndex={0}
                          aria-label={`${PUZZLE[key].title}: ${PUZZLE[key].summary}`}
                          onMouseEnter={() => setHovered(corner)}
                          onFocus={() => setHovered(corner)}
                          onBlur={() => setHovered(null)}
                          onClick={() => activate(corner)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              activate(corner);
                            }
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
              <p className="about-puzzle-hint">
                <i className="bi bi-hand-index-thumb" aria-hidden /> Click any piece to read more
              </p>
            </div>

            <div className="about-puzzle-labels-col about-puzzle-labels-col--right">
              {RIGHT_SIDES.map(({ key, corner }) => (
                <SideBlock key={key} pieceKey={key} highlight={hot(corner)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        className={`about-modal-overlay${modalOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="aboutModalTitle"
        onClick={closeModal}
      >
        {active && (
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="about-modal-accent" style={{ background: PUZZLE[active].accent }} />
            <div className="about-modal-head">
              <h2 id="aboutModalTitle" style={{ color: PUZZLE[active].accent }}>
                {PUZZLE[active].title}
              </h2>
              <button type="button" className="about-modal-close" aria-label="Close" onClick={closeModal}>
                <i className="bi bi-x-lg" aria-hidden />
              </button>
            </div>
            <div className="about-modal-body" dangerouslySetInnerHTML={{ __html: PUZZLE[active].body }} />
          </div>
        )}
      </div>
    </>
  );
}

function SideBlock({ pieceKey, highlight }: { pieceKey: PuzzleKey; highlight: boolean }) {
  const piece = PUZZLE[pieceKey];
  const labelClass = `about-puzzle-side-label about-puzzle-side-label--${pieceKey}`;
  return (
    <div className="about-puzzle-side-block" data-about-side={pieceKey}>
      <span className={labelClass} style={highlight ? { transform: 'scale(1.04)' } : undefined}>
        {piece.title}
      </span>
      <p className="about-puzzle-side-summary">{piece.summary}</p>
    </div>
  );
}
