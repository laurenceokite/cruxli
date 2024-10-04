import type { Clue, Crossword, Square, EditorCommand } from "$lib/types";
import { renumber, newSquare } from "$lib/crossword";

export function toggleSquares(indices: number[]): EditorCommand {
  let previousState: Clue[];

  const undo = (): EditorCommand => {
    return {
      execute: (c: Crossword) => {
        const grid = c.grid.map((s, i) =>
          indices.includes(i) ? toggle(s) : s,
        );
        let [crossword] = renumber({ ...c, grid });

        if (previousState.length) {
          for (let i = 0; i < previousState.length; i++) {
            if (!previousState[i].text) {
              continue;
            }

            const index = crossword.clues.findIndex(
              (c) => c.number === previousState[i].number,
            );

            if (index) {
              crossword.clues[index] = previousState[i];
            }
          }
        }

        return {
          crossword,
          undo: toggleSquares(indices),
        };
      },
    };
  };

  const execute = (c: Crossword) => {
    if (!indices.length) {
      return { crossword: c };
    }
    const grid = c.grid.map((s, i) => (indices.includes(i) ? toggle(s) : s));
    const [crossword, clues] = renumber({ ...c, grid });

    previousState = clues;

    return {
      crossword,
      undo: undo(),
    };
  };

  return { execute };
}

function toggle(square: Square | null): Square | null {
  if (square) {
    return null;
  }
  return newSquare();
}
