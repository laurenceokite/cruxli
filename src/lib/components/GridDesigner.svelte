<script lang="ts">
	import { onMount } from 'svelte';
	import { cursor, Cursor } from '../stores/cursor';
	import type { Grid } from '../types';
	import InputGridSquare from './InputGridSquare.svelte';
	import { createInputDispatcher } from '../commands';

	export let grid: Grid;
	export let size: number;
	export let autoSymmetry: boolean;
	export let focused: boolean;
	export let invalidIndices: Set<number> | undefined;

	$: if (focused) {
		focus($cursor.index);
	}

	const dispatch = createInputDispatcher();

	function getInputId(index: number) {
		return `grid-designer-input-${index}`;
	}

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
				cursor.move(key);
				event.preventDefault();
				break;
		}
	}

	onMount(() => {
		focus($cursor.index);
	});
</script>

<div
	class="crossword-grid"
	style="--grid-size: {size}"
	role="grid"
	tabindex="0"
	on:keydown={handleKeydown}
>
	{#each grid as square, index}
		<InputGridSquare
			{square}
			inputType="checkbox"
			highlighted={index === $cursor.index ||
				(autoSymmetry && index === size ** 2 - $cursor.index - 1)}
			selected={false}
			ariaRowindex={Cursor.y(size, index)}
			ariaColindex={Cursor.x(size, index)}
			inputId={getInputId(index)}
			on:toggle={() => dispatch('toggleSquare', index)}
			warn={invalidIndices && invalidIndices.has(index)}
		/>
	{/each}
</div>
