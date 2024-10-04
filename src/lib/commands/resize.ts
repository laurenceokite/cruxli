import {
  MAX_GRID_SIZE,
  MIN_GRID_SIZE,
  renumber,
  newSquare,
} from "$lib/crossword";
import type { Crossword, Square, EditorCommand } from "$lib/types";

export function resizeGrid(newSize: number): EditorCommand {
  const execute = (crossword: Crossword) => {
    const previousSize = crossword.size;
    const targetLength = newSize ** 2;

    if (newSize < MIN_GRID_SIZE || newSize > MAX_GRID_SIZE) {
      return { crossword };
    }

    if (newSize === previousSize && crossword.grid.length === targetLength) {
      return { crossword };
    }

    const previousState = JSON.stringify(crossword);

    const _newGrid: Square[] = [];
    const minSize = Math.min(previousSize, newSize);

    for (let row = 0; row < minSize; row++) {
      for (let col = 0; col < minSize; col++) {
        const sourceIndex = row * previousSize + col;
        const targetIndex = row * newSize + col;

        _newGrid[targetIndex] = crossword.grid[sourceIndex] ?? newSquare();
      }
    }

    if (newSize > previousSize) {
      for (let i = 0; i < targetLength; i++) {
        if (!_newGrid[i]) {
          _newGrid[i] = newSquare();
        }
      }
    }

    const [cw] = renumber({ ...crossword, grid: _newGrid, size: newSize });

    return {
      crossword: cw,
      undo: {
        execute: () => ({
          crossword: JSON.parse(previousState) as Crossword,
          undo: resizeGrid(newSize),
        }),
      },
    };
  };

  return { execute };
}
