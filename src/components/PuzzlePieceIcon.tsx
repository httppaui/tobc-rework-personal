import type { PuzzleKey } from '../types';
import { PUZZLE_ORIGIN, type PuzzleCorner } from './puzzlePaths';

const ICON_BOX = 88;

type Props = {
  pieceKey: PuzzleKey;
  icon: string;
  corner: PuzzleCorner;
};

export function PuzzlePieceIcon({ pieceKey, icon, corner }: Props) {
  const { x, y } = PUZZLE_ORIGIN[corner];
  const offset = ICON_BOX / 2;

  return (
    <foreignObject
      x={x - offset}
      y={y - offset}
      width={ICON_BOX}
      height={ICON_BOX}
      className="about-puzzle-icon-fo"
    >
      <div className={`about-puzzle-icon-inner about-puzzle-icon-inner--${pieceKey}`}>
        <span className="material-symbols-outlined" aria-hidden="true">
          {icon}
        </span>
      </div>
    </foreignObject>
  );
}
