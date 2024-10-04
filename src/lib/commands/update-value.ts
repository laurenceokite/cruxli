import type { Crossword, Square, EditorCommand } from "$lib/types";

export function updateValue(index: number, value: string): EditorCommand {
  let previousValue: string;

  const undo = (): EditorCommand => {
    return {
      execute: (c: Crossword) => {
        const grid = c.grid.map((s, i) =>
          i === index
            ? {
                ...(s as Square),
                value: previousValue,
                rebus: previousValue.length > 1,
              }
            : s,
        );

        return {
          crossword: {
            ...c,
            grid,
          },
          undo: updateValue(index, value),
        };
      },
    };
  };

  const execute = (c: Crossword) => {
    const square = c.grid[index];

    if (!square || value === square.value) {
      return { crossword: c };
    }

    previousValue = square.value;

    const grid = c.grid.map((s, i) =>
      i === index && !!s ? { ...s, value, rebus: value.length > 1 } : s,
    );

    return {
      crossword: {
        ...c,
        grid,
      },
      undo: undo(),
    };
  };

  return { execute };
}
