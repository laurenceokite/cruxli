import type { Crossword, EditorCommand } from "$lib/types";

export function updateClueText(number: number, text: string): EditorCommand {
  let previousState: { index: number; text: string | undefined };

  const undo = (): EditorCommand => {
    return {
      execute: (c: Crossword) => {
        const clue = {
          ...c.clues[previousState.index],
          text: previousState.text,
        };

        console.log({ previousState }, { clue });

        return {
          crossword: {
            ...c,
            clues: c.clues.toSpliced(previousState.index, 1, clue),
          },
          undo: updateClueText(number, text),
        };
      },
    };
  };

  const execute = (c: Crossword) => {
    const index = c.clues.findIndex((clue) => clue.number === number);
    console.log({ number, text });

    if (index === undefined) {
      return { crossword: c };
    }
    const clue = c.clues[index];
    previousState = { index, text: clue.text };

    const newClue = { ...clue, text };

    return {
      crossword: {
        ...c,
        clues: c.clues.toSpliced(index, 1, newClue),
      },
      undo: undo(),
    };
  };

  return { execute };
}
