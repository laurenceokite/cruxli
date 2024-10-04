<script lang="ts">
	import InputGridSquare from './InputGridSquare.svelte';
	import { cursor, Cursor } from '$lib/stores/cursor';
	import { createInputDispatcher } from '$lib/commands';
	import type { Crossword } from '$lib/types';
	import { browser } from '$app/environment';

	export let crossword: Readonly<Crossword>;
	export let focused: boolean;
	export let currentNumber: number;

	$: if (browser && focused) {
		focus($cursor.index);
	}

	const dispatch = createInputDispatcher();
	function focus(index: number) {
		document.querySelector<HTMLInputElement>(`#${getInputId(index)}`)?.focus();
	}

	function handleKeydown(event: KeyboardEvent) {
		const { key } = event;

		switch (key) {
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft':
				cursor.move(key, true);
				break;

			case ' ':
				cursor.toggleOrientation();
				break;
		}
	}

	function getInputId(index: number) {
		return `input-grid-input-${index}`;
	}
</script>

<div
	class="crossword-grid"
	style="--grid-size: {crossword.size}"
	role="grid"
	tabindex="-1"
	on:keydown={handleKeydown}
>
	{#each crossword.grid as square, index}
		<InputGridSquare
			on:updateValue={(e) => {
				dispatch('updateValue', e.detail);
			}}
			on:clearValue={(e) => {
				dispatch('clearValue', e.detail);
			}}
			on:selectSquare={(e) => dispatch('selectSquare', e.detail)}
			inputId={getInputId(index)}
			{square}
			selected={$cursor.index === index}
			tabindex={$cursor.index === index ? 0 : -1}
			highlighted={!!square && currentNumber === square[$cursor.orientation]}
			ariaColindex={Cursor.x(crossword.size, index)}
			ariaRowindex={Cursor.y(crossword.size, index)}
		/>
	{/each}
</div>
