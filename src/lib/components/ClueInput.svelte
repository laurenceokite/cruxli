<script lang="ts">
	import { cursor, Cursor } from '../stores/cursor';
	import InputGridSquare from './InputGridSquare.svelte';
	import { createInputDispatcher } from '../commands';
	import type { Orientation, Square, Clue, CrosswordInputEvent } from '$lib/types';

	export let clue: Clue;
	export let orientation: string;
	export let editorMode: boolean;
	export let squareInputMode: boolean;
	export let selected: boolean;
	export let intersected: boolean;
	export let focused: boolean;
	export let squares: (Square | null)[];
	export let getInputId: (orientation: string, index: number) => string;

	const dispatch = createInputDispatcher<{
		next: void;
		previous: void;
	}>();

	let textInput: HTMLTextAreaElement;
	$: if (editorMode && !squareInputMode && selected && focused) {
		textInput.focus();
	}

	function handleUpdateClue(event: Event) {
		if (!event.target) return;

		dispatch('updateClueText', [clue.number, (<HTMLInputElement>event.target).value]);
	}

	function handleMousedown() {
		squareInputMode = true;
		cursor.setOrientation(orientation as Orientation);
		if (!selected) {
			cursor.setIndex(squares[0]?.index ?? $cursor.index);
		}
	}

	function handleSelectSquare(event: CrosswordInputEvent['selectSquare']) {
		cursor.setOrientation(orientation as Orientation);
		dispatch('selectSquare', event.detail);
	}

	function handleKeydown(event: KeyboardEvent) {
		const { key } = event;

		switch (key) {
			case 'ArrowUp':
				if (editorMode && squareInputMode) {
					squareInputMode = false;
					textInput?.focus();
					event.stopPropagation();
				} else {
					squareInputMode = true;
					dispatch('previous');
				}
				break;
			case 'ArrowDown':
				if (editorMode && !squareInputMode) {
					squareInputMode = true;
					event.stopPropagation();
				} else {
					squareInputMode = false;
					dispatch('next');
				}
				break;
			case 'ArrowLeft':
				if ($cursor.index !== squares[0]?.index && squareInputMode) {
					cursor.move(Cursor.backward($cursor.orientation));
					event.stopPropagation();
				}
				break;
			case 'ArrowRight':
				if ($cursor.index !== squares[squares.length - 1]?.index && squareInputMode) {
					cursor.move(Cursor.forward($cursor.orientation));
					event.stopPropagation();
				}
				break;
		}
	}
</script>

<div
	role="grid"
	tabindex="-1"
	class="border border-gray-600 p-2"
	on:keydown={handleKeydown}
	on:mousedown={handleMousedown}
>
	<div class="font-semibold dark:text-gray-200">{Math.abs(clue.number)}</div>
	{#if editorMode}
		<textarea
			bind:this={textInput}
			role="row"
			class="my-4 h-14 text-sm p-1 xl:h-20 xl:p-2 xl:text-base w-full border dark:border-gray-600 rounded dark:bg-gray-950 dark:text-gray-200"
			tabindex={(selected || intersected) && !squareInputMode ? 0 : -1}
			value={clue.text ?? ''}
			on:change={handleUpdateClue}
			on:mousedown={() => (squareInputMode = false)}
		></textarea>
	{:else}
		<div class="my-4 text-small xl:text-base">{clue.text ?? ''}</div>
	{/if}
	<div
		role="row"
		class="flex border border-black dark:border-gray-500 w-fit dark:bg-gray-950"
		tabindex="-1"
		on:focusin={() => {
			squareInputMode = true;
		}}
	>
		{#each squares as square, index}
			{#if square}
				<div class="w-5 xl:w-8">
					<InputGridSquare
						{square}
						inputId={getInputId(orientation, square.index)}
						selected={$cursor.index === square.index}
						tabindex={squareInputMode && $cursor.index === square.index ? 0 : -1}
						highlighted={false}
						ariaRowindex={undefined}
						ariaColindex={index}
						displayNumber={false}
						on:updateValue={(e) => dispatch('updateValue', e.detail)}
						on:clearValue={(e) => dispatch('clearValue', e.detail)}
						on:selectSquare={handleSelectSquare}
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>
