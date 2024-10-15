<script lang="ts">
    import InputGridSquare from "./InputGridSquare.svelte";
    import { createInputDispatcher } from "$lib/commands";
    import type { Crossword, CrosswordInputEvent } from "$lib/types";
    import { cursorHelpers, type CursorStore } from "$lib/stores/cursor";

    export let crossword: Readonly<Crossword>;
    export let cursor: CursorStore;
    export let readonly: boolean;
    export let currentNumber: number;
    export let activeElementId: string | undefined;

    const dispatch = createInputDispatcher();
    const ID_PREFIX = "grid";

    $: focused = activeElementId
        ? activeElementId.startsWith(ID_PREFIX)
        : false;

    $: if (focused) {
        focus($cursor.index);
    }

    const focus = (index: number) => {
        document
            .querySelector<HTMLInputElement>(`#${getInputId(index)}`)
            ?.focus();
    };

    const handleKeydown = (event: KeyboardEvent) => {
        const { key } = event;

        switch (key) {
            case "ArrowUp":
            case "ArrowRight":
            case "ArrowDown":
            case "ArrowLeft":
                cursor.move(key, true);
                break;

            case " ":
                cursor.toggleOrientation();
                break;
        }
    };

    const handleSelectSquare = (event: CrosswordInputEvent["selectSquare"]) => {
        if ($cursor.index === event.detail) {
            cursor.toggleOrientation();
        }
        dispatch("selectSquare", event.detail);
    };

    function getInputId(index: number) {
        return `${ID_PREFIX}-input-${index}`;
    }
</script>

<div
    class="crossword-grid h-fit max-h-screen w-fit border-gray-950 xl:border-2 dark:border-gray-800 dark:bg-gray-800"
    style="--grid-size: {crossword.size}"
    role="grid"
    tabindex="-1"
    on:keydown={handleKeydown}
>
    {#each crossword.grid as square, index}
        <InputGridSquare
            {square}
            {readonly}
            selected={$cursor.index === index}
            tabindex={!readonly && $cursor.index === index ? 0 : -1}
            highlighted={!!square &&
                currentNumber === square[$cursor.orientation]}
            ariaColindex={cursorHelpers.x(crossword.size, index)}
            ariaRowindex={cursorHelpers.y(crossword.size, index)}
            inputId={getInputId(index)}
            on:updateValue={(e) => {
                dispatch("updateValue", e.detail);
            }}
            on:clearValue={(e) => {
                dispatch("clearValue", e.detail);
            }}
            on:selectSquare={handleSelectSquare}
        />
    {/each}
</div>
