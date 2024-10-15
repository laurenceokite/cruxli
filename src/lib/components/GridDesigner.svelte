<script lang="ts">
    import { onMount } from "svelte";
    import type { Grid } from "../types";
    import { createInputDispatcher } from "../commands";
    import type { CursorStore } from "$lib/stores/cursor";

    export let grid: Grid;
    export let cursor: CursorStore;
    export let size: number;
    export let autoSymmetry: boolean;
    export let activeElementId: string | undefined;
    let className: string;
    export { className as class };

    const dispatch = createInputDispatcher();
    const ID_PREFIX = "designer";

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
                cursor.move(key);
                event.preventDefault();
                break;
        }
    };

    function getInputId(index: number) {
        return `${ID_PREFIX}-input-${index}`;
    }

    onMount(() => {
        focus($cursor.index);
    });
</script>

<div
    class={`crossword-grid ${className}`}
    style="--grid-size: {size}"
    role="grid"
    tabindex="-1"
    on:keydown={handleKeydown}
>
    {#each grid as square, index}
        <input
            value={!!square}
            type="checkbox"
            id={getInputId(index)}
            on:input={() => dispatch("toggleSquare", index)}
            tabindex="-1"
        />
    {/each}
</div>
