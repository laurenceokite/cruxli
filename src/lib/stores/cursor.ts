import { writable } from "svelte/store";
import type { Crossword, Square, Orientation, Cursor, Direction } from "../types";
import { Iter } from "../iterators/iter";

export type CursorStore = ReturnType<typeof createCursorStore>;

export function createCursorStore(crossword: () => Readonly<Crossword>) {
    const store = writable<Cursor>({
        index: 0,
        orientation: "across",
    });

    function move(direction: Direction, skipBlack: boolean = false) {
        store.update((cursor) => {
            const targetOrientation = cursorHelpers.orientation(direction);

            // Orientation needs to correspond to direction before moving.
            // Here we update orientation if necessary and return.
            if (cursor.orientation !== targetOrientation && skipBlack) {
                return {
                    ...cursor,
                    orientation: targetOrientation,
                };
            }

            const _crossword = crossword();

            if (cursorHelpers.atBoundary(_crossword.size, cursor.index, direction)) {
                return cursor;
            }

            const increment = cursorHelpers.increment(_crossword.size, direction);
            let index = cursor.index + increment;

            if (index < 0 || index > _crossword.grid.length - 1) {
                return cursor;
            }

            if (skipBlack && !_crossword.grid[index]) {
                for (let i = 0; i < _crossword.grid.length; i++) {
                    index += increment;
                    if (index < 0 || index >= _crossword.grid.length) {
                        return cursor;
                    }
                    if (_crossword.grid[index]) {
                        return {
                            ...cursor,
                            index,
                        };
                    }
                }
            }

            return {
                ...cursor,
                index,
            };
        });
    }

    function toggleOrientation() {
        store.update((cursor) => {
            const orientation = cursorHelpers.opposite(cursor.orientation);
            return {
                ...cursor,
                orientation,
            };
        });
    }

    function setOrientation(orientation: Orientation) {
        store.update((cursor) => {
            if (cursor.orientation === orientation) {
                return cursor;
            }
            return {
                ...cursor,
                orientation,
            };
        });
    }

    function setIndex(index: number) {
        const _crossword = crossword();

        if (index < 0 || index >= _crossword.grid.length) {
            return;
        }

        store.update((cursor) => {
            return {
                ...cursor,
                index,
            };
        });
    }

    function findEmptySquare(iter: Iter<Square | null>): number | undefined {
        for (const square of iter) {
            if (square && square.value.trim() === "") {
                return square.index;
            }
        }
        return undefined;
    }

    function goToFirstEmptySquare() {
        store.update((cursor) => {
            const iter = new Iter(crossword().grid[Symbol.iterator]());
            const index = findEmptySquare(
                cursor.orientation === "across" ? iter : iter.iterateBySqrt(),
            );

            if (index === undefined) {
                return cursor;
            }

            return {
                ...cursor,
                index,
            };
        });
    }

    function goToNextEmptySquare(indices?: readonly number[]) {
        store.update((cursor) => {
            let index: number | undefined = undefined;
            const _crossword = crossword();

            if (indices) {
                const squares = indices
                    .map((i) => _crossword.grid[i])
                    .filter((s) => !!s);

                const start =
                    squares.findIndex((s) => s && s.index === cursor.index) + 1;
                index = findEmptySquare(
                    new Iter(squares[Symbol.iterator]()).iterateFrom(start),
                );

                if (index !== undefined) {
                    return {
                        ...cursor,
                        index,
                    };
                }
            }

            const increment = cursorHelpers.increment(_crossword.size, cursor.orientation);
            const iter = new Iter(_crossword.grid[Symbol.iterator]()).iterateFrom(
                cursor.index + increment,
            );
            index = findEmptySquare(
                cursor.orientation === "across" ? iter : iter.iterateBySqrt(),
            );

            if (index !== undefined) {
                return {
                    ...cursor,
                    index,
                };
            }

            return cursor;
        });
    }

    return {
        subscribe: store.subscribe,
        move,
        setIndex,
        toggleOrientation,
        setOrientation,
        goToFirstEmptySquare,
        goToNextEmptySquare,
    };
}

export const cursorHelpers = {
    orientation(direction: Direction): Orientation {
        return {
            ArrowRight: "across",
            ArrowUp: "down",
            ArrowDown: "down",
            ArrowLeft: "across",
        }[direction] as Orientation;
    },

    opposite<T extends Orientation | Direction>(prop: T): T {
        return {
            ArrowUp: "ArrowDown",
            ArrowRight: "ArrowLeft",
            ArrowDown: "ArrowUp",
            ArrowLeft: "ArrowRight",
            across: "down",
            down: "across",
        }[prop] as T;
    },

    increment(size: number, prop: Orientation | Direction) {
        return {
            ArrowUp: -size,
            ArrowRight: 1,
            ArrowDown: size,
            ArrowLeft: -1,
            across: 1,
            down: size,
        }[prop];
    },

    forward(orientation: Orientation): Direction {
        return {
            across: "ArrowRight",
            down: "ArrowDown",
        }[orientation] as Direction;
    },

    backward(orientation: Orientation): Direction {
        return {
            across: "ArrowLeft",
            down: "ArrowUp",
        }[orientation] as Direction;
    },

    x(size: number, index: number) {
        return index % size;
    },

    y(size: number, index: number) {
        return Math.floor(index / size);
    },

    coordinates(size: number, index: number) {
        return [this.x(size, index), this.y(size, index)];
    },

    atBoundary(size: number, index: number, direction: Direction) {
        const x = () => this.x(size, index);
        const y = () => this.y(size, index);

        return {
            ArrowLeft: () => x() <= 0,
            ArrowUp: () => y() <= 0,
            ArrowRight: () => x() >= size - 1,
            ArrowDown: () => y() >= size - 1,
        }[direction]();
    },
}
