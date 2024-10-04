import type { updateClueText } from "./commands/update-clue";
import type { updateValue } from "./commands/update-value";

export type Crossword = {
  grid: Grid;
  clues: Clue[];
  size: number;
  title?: string;
  theme?: string;
};

export type Grid = Array<Square | null>;

export type Square = {
  index: number;
  value: string;
  across: number;
  down: number;
  number: number | null;
  decoration?: string;
};

export type Clue = {
  number: number;
  indices: number[];
  text: string | undefined;
};

export type Orientation = "across" | "down";

export interface EditorCommand {
  execute: (crossword: Readonly<Crossword>) => {
    crossword: Crossword;
    undo?: EditorCommand;
  };
}

export type InputDispatchArgs = {
  updateClueText: Parameters<typeof updateClueText>;
  updateValue: Parameters<typeof updateValue>;
  toggleSquare: number;
  selectSquare: number;
  clearValue: number;
  resizeGrid: number;
};

export type CrosswordInputEvent = {
  [K in keyof InputDispatchArgs]: CustomEvent<InputDispatchArgs[K]>;
};
