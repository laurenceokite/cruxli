import { Cursor } from "./stores/cursor";
import type { Clue, Crossword, Grid, Square } from "./types";

export const MAX_GRID_SIZE = 30;
export const MIN_GRID_SIZE = 3;

export function newSquare(): Square {
  return {
    index: 0,
    value: "",
    across: 0,
    down: 0,
    number: null,
  };
}
export function newGrid(size: number): Grid {
  return new Array(size ** 2).fill(null).map(() => newSquare());
}

export function newCrossword(size: number = 15) {
  const grid = numberGrid(newGrid(size), size);

  return {
    size,
    grid,
    clues: buildClues(grid),
  };
}

export function renumber(
  crossword: Crossword,
): [crossword: Crossword, lostClues: Clue[]] {
  const grid = numberGrid(crossword.grid, crossword.size);
  const [clues, discardedClues] = updateClues(grid, crossword.clues);

  return [{ ...crossword, grid, clues }, discardedClues];
}

function numberGrid(grid: Grid, size: number): Grid {
  let number = 0;
  let across = 0;
  const down: number[] = [];

  return grid.map((square, index) => {
    if (!square) return null;

    const xCoord = Cursor.x(size, index);

    const newAcross = !(xCoord !== 0 && grid[index - 1]);
    const newDown = !(index >= size && grid[index - size]);

    if (newAcross || newDown) {
      number++;
    }

    if (newAcross) {
      across = number;
    }

    if (newDown) {
      down[xCoord] = number;
    }

    return {
      ...square,
      index,
      across: -across,
      down: down[xCoord],
      number: newAcross || newDown ? number : null,
    };
  });
}

function buildClues(grid: Grid): Clue[] {
  const unsorted = grid.reduce((map, square, index) => {
    if (!square) {
      return map;
    }

    const set = (number: number) =>
      map?.has(number)
        ? map.get(number)!.push(index)
        : map.set(number, [index]);
    [square.across, square.down].forEach(set);

    return map;
  }, new Map<number, number[]>());

  return [...unsorted.entries()]
    .map((x) => {
      return {
        number: x[0],
        indices: x[1],
        text: undefined,
      };
    })
    .sort((a, b) => a.number - b.number);
}

function updateClues(
  grid: Grid,
  oldClues: Clue[],
): [result: Clue[], discarded: Clue[]] {
  const map = new Map(
    Object.values(oldClues).map((clue) => [clue.indices.join(), clue]),
  );
  const result = buildClues(grid);

  result.forEach((c, i) => {
    result[i].text = map.get(c.indices.join())?.text;
    map.delete(c.indices.join());
  });

  return [result, [...map.values()]];
}
