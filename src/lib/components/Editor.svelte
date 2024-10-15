<script lang="ts">
    import { resizeGrid } from "$lib/commands/resize";
    import CrosswordDisplay from "$lib/components/Crossword.svelte";
    import EditorControls from "$lib/components/EditorControls.svelte";
    import GridDesigner from "$lib/components/GridDesigner.svelte";
    import {
        CrosswordMode,
        type Crossword,
        type CrosswordInputEvent,
        type EditorCommand,
    } from "$lib/types";

    export let crossword: Readonly<Crossword>;

    let isGridDesigner = false;
    let autoSymmetry = true;
    let isSplit = false;
    let listView = false;

    let undo: EditorCommand[] = [];
    let redo: EditorCommand[] = [];

    function execute(command: EditorCommand) {
        const result = command.execute(crossword);

        if (result.undo) {
            undo = [...undo, result.undo];
            redo = [];
            crossword = result.crossword;
        }
    }

    function handleUndo() {
        if (!undo.length) {
            return;
        }

        const command = undo[undo.length - 1];
        const result = command.execute(crossword);

        undo = undo.slice(0, undo.length - 1);
        redo = [...redo, result.undo!];
        crossword = result.crossword;
    }

    function handleRedo() {
        if (!redo.length) {
            return;
        }

        const command = redo[redo.length - 1];
        const result = command.execute(crossword);

        redo = redo.slice(0, redo.length - 1);
        undo = [...undo, result.undo!];
        crossword = result.crossword;
    }

    function handleResizeGrid(event: CrosswordInputEvent["resizeGrid"]) {
        execute(resizeGrid(event.detail));
    }

    function handleKeydown(event: KeyboardEvent) {
        const { key } = event;

        switch (key) {
            case "Escape":
                isGridDesigner = !isGridDesigner;
        }
    }
</script>

<svelte:document on:keydown={handleKeydown} />

<div class="relative flex w-full flex-col items-center pt-32 dark:bg-gray-800">
    <section class="absolute left-0 right-0 top-0 flex h-32 justify-center">
        <EditorControls
            {crossword}
            {isSplit}
            bind:listView
            bind:autoSymmetry
            bind:isGridDesigner
            undoable={!!undo.length}
            redoable={!!redo.length}
            on:undo={handleUndo}
            on:redo={handleRedo}
            on:resizeGrid={handleResizeGrid}
        />
    </section>
    <CrosswordDisplay
        {crossword}
        mode={CrosswordMode.Editor}
        let:cursor
        let:activeElementId
    >
        {#if isGridDesigner}
            <GridDesigner
                {cursor}
                {autoSymmetry}
                {...crossword}
                {activeElementId}
                class="absolute inset-0"
            />
        {/if}
    </CrosswordDisplay>
</div>
