<script lang="ts">
    import InputGridSquare from "./InputGridSquare.svelte";
    import { createInputDispatcher } from "../commands";
    import type { Square, Clue, Cursor } from "$lib/types";

    export let cursor: Readonly<Cursor>;
    export let clue: Clue;
    export let squares: (Square | null)[];
    export let orientation: string;
    export let focused: boolean;
    export let selected: boolean;
    export let clueInputMode: boolean = false;
    export let textAreaId: string | undefined;
    export let getSquareId: (orientation: string, index: number) => string;

    const dispatch = createInputDispatcher<{
        toggleClueInputMode: null;
    }>();

    function handleUpdateClue(event: Event) {
        if (!event.target) return;

        dispatch("updateClueText", [
            clue.number,
            (<HTMLInputElement>event.target).value,
        ]);
    }

    function handleMousedown() {
        if ((!focused || !selected) && !!squares[0]) {
            dispatch("selectSquare", squares[0].index);
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!textAreaId) return;

        const { key } = event;

        if (key === "ArrowUp" && !clueInputMode) {
            event.stopPropagation();
            dispatch("toggleClueInputMode");
        }

        if (key === "ArrowDown" && clueInputMode) {
            event.stopPropagation();
            dispatch("toggleClueInputMode");
        }
    }
</script>

<div
    role="grid"
    tabindex="-1"
    class="border border-gray-600 p-2"
    on:mousedown={handleMousedown}
    on:keydown={handleKeydown}
>
    <div class="font-semibold dark:text-gray-200">{Math.abs(clue.number)}</div>
    {#if textAreaId}
        <textarea
            id={textAreaId}
            role="row"
            class="my-4 h-14 w-full rounded border p-1 text-sm xl:h-20 xl:p-2 xl:text-base dark:border-gray-600 dark:bg-gray-950 dark:text-gray-200"
            value={clue.text ?? ""}
            on:change={handleUpdateClue}
        ></textarea>
    {:else}
        <div class="text-small my-4 xl:text-base">{clue.text ?? ""}</div>
    {/if}
    <div
        role="row"
        class="flex w-fit border border-black dark:border-gray-500 dark:bg-gray-950"
        tabindex="-1"
    >
        {#each squares as square, index}
            {#if square}
                <div class="w-5 xl:w-8">
                    <InputGridSquare
                        {square}
                        inputId={getSquareId(orientation, square.index)}
                        selected={cursor.index === square.index}
                        tabindex={cursor.index === square.index &&
                        !clueInputMode
                            ? 0
                            : -1}
                        highlighted={false}
                        ariaRowindex={undefined}
                        ariaColindex={index}
                        displayNumber={false}
                        on:updateValue={(e) =>
                            dispatch("updateValue", e.detail)}
                        on:clearValue={(e) => dispatch("clearValue", e.detail)}
                        on:selectSquare
                    />
                </div>
            {/if}
        {/each}
    </div>
</div>
