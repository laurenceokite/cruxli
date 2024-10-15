<script lang="ts">
    import { createInputDispatcher } from "../commands";
    import type { Square } from "$lib/types";

    export let square: Square | null;
    export let tabindex: 0 | -1 = -1;
    export let selected: boolean;
    export let highlighted: boolean;
    export let inputId: string;
    export let displayNumber = true;
    export let ariaColindex: number | undefined;
    export let ariaRowindex: number | undefined;
    export let warn: boolean = false;
    export let readonly: boolean = false;

    const dispatch = createInputDispatcher<{ toggle: void }>();

    function handleUpdateValue(event: Event) {
        const el = event.target as HTMLInputElement;

        el.value = el.value.trim();

        if (el.value.length > 1) {
            el.value = el.value.split("").pop() ?? "";
        }

        el.value = el.value.toLocaleUpperCase();

        dispatch("updateValue", [square!.index, el.value]);
    }

    function handleKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case "Backspace":
                event.preventDefault();
                dispatch("clearValue", square!.index);
                break;
            case " ":
                event.preventDefault();
                break;
        }
    }

    function handleMousedown() {
        dispatch("selectSquare", square!.index);
    }
</script>

<div
    class:bg-gray-950={!square}
    class="border-1 group relative aspect-square border border-gray-600"
    role="gridcell"
    aria-colindex={ariaColindex}
    aria-rowindex={ariaRowindex}
>
    <div
        class:bg-indigo-300={highlighted && !readonly}
        class:bg-violet-400={selected}
        class:bg-violet-950={highlighted && !square}
        class="pointer-events-none absolute inset-0 opacity-50"
    ></div>
    {#if square && square.number && displayNumber}
        <div
            class="absolute left-0 top-0 pl-[1px] text-[0.4rem] xl:pl-[2px] xl:text-[0.5rem]"
            class:dark:text-gray-200={!highlighted && !selected}
        >
            {square.number}
        </div>
    {/if}
    {#if square}
        <input
            id={inputId}
            on:mousedown|preventDefault|stopPropagation={handleMousedown}
            on:input={handleUpdateValue}
            on:keydown={handleKeydown}
            value={square.value}
            type="text"
            maxlength="6"
            class="peer absolute h-full w-full bg-transparent pl-[2px] pt-[2px] text-center text-sm caret-transparent outline-none xl:p-0 xl:text-base xl:font-semibold"
            class:dark:text-slate-300={!highlighted && !selected}
            {tabindex}
            {readonly}
        />
    {/if}
    <div
        class="pointer-events-none absolute inset-0 z-10 rounded ring-violet-800 peer-focus:ring-4"
    ></div>
    {#if warn}
        <div class="absolute inset-0 bg-rose-600 opacity-25"></div>
    {/if}
</div>
