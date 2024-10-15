<script lang="ts">
    import ClueInput from "./ClueInput.svelte";
    import { createInputDispatcher } from "../commands";
    import { CrosswordMode, type Crossword, type Direction } from "../types";
    import { cursorHelpers, type CursorStore } from "$lib/stores/cursor";
    import { browser } from "$app/environment";

    export let crossword: Readonly<Crossword>;
    export let cursor: CursorStore;
    export let mode: CrosswordMode;
    export let currentNumber: number;
    export let activeElementId: string | undefined;

    const dispatch = createInputDispatcher();
    const ID_PREFIX = "clue";

    let clueInputMode = false;

    const handleKeydown = (event: KeyboardEvent) => {
        const { key } = event;

        switch (key) {
            case "ArrowLeft":
                if (!clueInputMode) {
                    cursor.move(cursorHelpers.backward($cursor.orientation));
                }
                break;
            case "ArrowRight":
                if (!clueInputMode) {
                    cursor.move(cursorHelpers.forward($cursor.orientation));
                }
                break;
            case "ArrowUp":
            case "ArrowDown":
                changeClue(key);
                break;
        }
    };

    const changeClue = (direction: Direction) => {
        const clueIndex = clues[$cursor.orientation].findIndex(
            (c) => c.number === currentNumber,
        );

        if (clueIndex === undefined) {
            return;
        }

        const { length } = clues[$cursor.orientation];
        const newClueIndex =
            (clueIndex + (direction === "ArrowUp" ? -1 : 1) + length) % length;
        const { indices } = clues[$cursor.orientation][newClueIndex];

        if (indices.length) {
            cursor.setIndex(indices[0]);
        }
    };

    $: focused = activeElementId
        ? activeElementId.startsWith(ID_PREFIX)
        : false;

    $: clues = {
        across: crossword.clues.filter((c) => c.number < 0).reverse(),
        down: crossword.clues.filter((c) => c.number > 0),
    };

    $: if (browser && focused && clueInputMode) {
        document
            .querySelector<HTMLTextAreaElement>(
                `#${getTextInputId(currentNumber)}`,
            )
            ?.focus();
    }

    $: if (browser && focused && !clueInputMode) {
        document
            .querySelector<HTMLInputElement>(
                `#${getSquareId($cursor.orientation, $cursor.index)}`,
            )
            ?.focus();
    }

    function getSquareId(orientation: string, index: number) {
        return `${ID_PREFIX}-square-${orientation}-${index}`;
    }

    function getTextInputId(number: number) {
        return `${ID_PREFIX}-text-${number}`;
    }
</script>

<div role="grid" tabindex="-1" on:keydown={handleKeydown}>
    {#each Object.entries(clues) as [orientation, list]}
        <ul class="max-w-screen w-[650px] min-w-fit shadow-md">
            <h2
                class="sticky top-0 z-50 flex h-10 items-center border-b border-gray-950 bg-white px-2 font-semibold dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            >
                {orientation.toUpperCase()}
            </h2>
            {#each list as clue, index}
                <li class:dark:bg-gray-800={!!(index % 2)} tabindex="-1">
                    <ClueInput
                        {clue}
                        {orientation}
                        {focused}
                        {clueInputMode}
                        cursor={$cursor}
                        textAreaId={mode === CrosswordMode.Editor
                            ? getTextInputId(clue.number)
                            : undefined}
                        {getSquareId}
                        selected={orientation === $cursor.orientation &&
                            currentNumber === clue.number}
                        squares={clue.indices.map((i) => crossword.grid[i])}
                        on:updateClueText={(e) =>
                            dispatch("updateClueText", e.detail)}
                        on:updateValue={(e) =>
                            dispatch("updateValue", e.detail)}
                        on:clearValue={(e) => dispatch("clearValue", e.detail)}
                        on:selectSquare={(e) =>
                            dispatch("selectSquare", e.detail)}
                        on:toggleClueInputMode={() =>
                            (clueInputMode = !clueInputMode)}
                    />
                </li>
            {/each}
        </ul>
    {/each}
</div>
