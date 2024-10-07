<script lang="ts">
	import { createInputDispatcher } from '../commands';
	import type { Square } from '$lib/types';

	export let square: Square | null;
	export let inputType: 'text' | 'checkbox' = 'text';
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
			el.value = el.value.split('').pop() ?? '';
		}

		el.value = el.value.toLocaleUpperCase();

		dispatch('updateValue', [square!.index, el.value]);
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Backspace':
				event.preventDefault();
				dispatch('clearValue', square!.index);
				break;
			case ' ':
				event.preventDefault();
				break;
		}
	}

	function handleMousedown() {
		dispatch('selectSquare', square!.index);
	}
</script>

<div
	class:bg-gray-950={!square}
	class="group relative border border-1 border-gray-600 aspect-square"
	role="gridcell"
	aria-colindex={ariaColindex}
	aria-rowindex={ariaRowindex}
>
	<div
		class:bg-indigo-300={highlighted}
		class:bg-violet-400={selected}
		class:bg-violet-950={highlighted && !square}
		class:bg-gray-500={readonly}
		class="absolute inset-0 pointer-events-none opacity-50"
	></div>
	{#if square && square.number && displayNumber}
		<div
			class="absolute top-0 left-0 text-[0.4rem] xl:text-[0.5rem] pl-[1px] xl:pl-[2px]"
			class:dark:text-gray-200={!highlighted && !selected}
		>
			{square.number}
		</div>
	{/if}
	{#if inputType === 'checkbox'}
		<input
			id={inputId}
			on:input={() => dispatch('toggle')}
			value={!!square}
			type="checkbox"
			maxlength="6"
			class="opacity-0 w-full h-full peer"
			{tabindex}
		/>
	{:else if square}
		<input
			id={inputId}
			on:mousedown|preventDefault|stopPropagation={handleMousedown}
			on:input={handleUpdateValue}
			on:keydown={handleKeydown}
			value={square.value}
			type="text"
			maxlength="6"
			class="absolute bg-transparent caret-transparent text-center pt-[2px] pl-[2px] xl:p-0 xl:font-semibold text-sm xl:text-base w-full h-full outline-none peer"
			class:dark:text-slate-300={!highlighted && !selected}
			{tabindex}
		/>
	{/if}
	<div
		class="absolute inset-0 peer-focus:ring-4 ring-violet-800 rounded pointer-events-none z-10"
	></div>
	{#if warn}
		<div class="absolute inset-0 opacity-25 bg-rose-600"></div>
	{/if}
</div>
