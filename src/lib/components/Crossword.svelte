<script lang="ts">
    import { browser } from "$app/environment";
    import { createInputDispatcher } from "$lib/commands";
    import { createCursorStore, cursorHelpers } from "$lib/stores/cursor";
    import {
        CrosswordMode,
        type Crossword,
        type Orientation,
        type CrosswordInputEvent,
    } from "$lib/types";
    import { onMount } from "svelte";
    import ClueList from "./ClueList.svelte";
    import InputGrid from "./InputGrid.svelte";

    export let crossword: Readonly<Crossword>;
    export let mode: CrosswordMode;
    export let readonlyGrid: boolean = false;

    const cursor = createCursorStore(() => crossword);
    const dispatch = createInputDispatcher();

    let outerWidth = 0;
    let remSize = 0;
    let activeElementId: string | undefined;
    let listView = false;
    let goToNextEmptySquare = true;
    let previousNumber = 0;
    let currentNumber = 0;

    $: gridSideLength = remSize * 3 * crossword.size;
    $: breakpoint = gridSideLength * 2;
    $: isSplit = outerWidth < breakpoint || outerWidth < 800;
    $: if (browser) {
        activeElementId = document.activeElement?.id;
    }

    $: currentSquare = crossword.grid[$cursor.index];
    $: if ($cursor.index > -1) {
        setPreviousNumber();
        setCurrentNumber($cursor.orientation);
    }

    $: currentClue = crossword.clues.find((c) => c.number === currentNumber);

    $: if (!readonlyGrid && previousNumber !== currentNumber) {
        if (
            goToNextEmptySquare &&
            currentSquare &&
            currentSquare.value !== ""
        ) {
            goToNextEmptySquare = false;
        } else {
            goToNextEmptySquare = true;
        }
    } else if (
        !readonlyGrid &&
        goToNextEmptySquare &&
        currentSquare &&
        currentSquare.value !== ""
    ) {
        goToNextEmptySquare = false;
    }

    $: if (!readonlyGrid && !currentSquare) {
        cursor.move(cursorHelpers.forward($cursor.orientation));
    }

    function setPreviousNumber() {
        previousNumber = currentNumber;
    }

    function setCurrentNumber(o: Orientation) {
        currentNumber = currentSquare?.[o] ?? 0;
    }

    function handleUpdateValue(event: CrosswordInputEvent["updateValue"]) {
        if (goToNextEmptySquare) {
            cursor.goToNextEmptySquare(currentClue?.indices);
        } else {
            cursor.move(cursorHelpers.forward($cursor.orientation), true);
        }
        dispatch("updateValue", event.detail);
    }

    function handleClearValue(event: CrosswordInputEvent["clearValue"]) {
        cursor.move(cursorHelpers.backward($cursor.orientation));
        dispatch("clearValue", event.detail);
    }

    function handleSelectSquare(event: CrosswordInputEvent["selectSquare"]) {
        console.log(event.detail);
        cursor.setIndex(event.detail);
    }

    onMount(() => {
        remSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    });
</script>

<svelte:window bind:outerWidth />

<div
    class="flex w-full divide-x divide-gray-600 bg-gray-50 dark:bg-gray-950"
    style={`max-width: ${Math.max(1200, breakpoint * 2)}px;`}
>
    {#if !isSplit || !listView}
        <section class="flex flex-1 justify-center">
            <div class="relative">
                <slot {cursor} {activeElementId}></slot>
                <InputGrid
                    {crossword}
                    {currentNumber}
                    {activeElementId}
                    {cursor}
                    readonly={readonlyGrid}
                    on:updateValue={handleUpdateValue}
                    on:clearValue={handleClearValue}
                    on:selectSquare={handleSelectSquare}
                />
            </div>
        </section>
    {/if}

    {#if !isSplit || listView}
        <section
            class="flex h-[calc(100vh-6rem)] w-full flex-1 flex-wrap justify-center overflow-scroll"
        >
            <ClueList
                {mode}
                {crossword}
                {cursor}
                {currentNumber}
                {activeElementId}
                on:updateClueText
                on:updateValue={handleUpdateValue}
                on:clearValue={handleClearValue}
                on:selectSquare={handleSelectSquare}
            />
        </section>
    {/if}
</div>

<style>
    :global(.crossword-grid) {
        @apply grid aspect-square;
    }
    :global(.crossword-grid) {
        grid-template-columns: repeat(var(--grid-size), minmax(auto, 3rem));
        grid-template-rows: repeat(var(--grid-size), minmax(auto, 3rem));
    }
</style>
