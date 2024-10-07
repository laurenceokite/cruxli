<script lang="ts">
	import ClueInput from './ClueInput.svelte';
	import { cursor } from '../stores/cursor';
	import { createInputDispatcher } from '../commands';
	import type { Crossword, Orientation } from '../types';
	import { browser } from '$app/environment';

	export let crossword: Readonly<Crossword>;
	export let editorMode: boolean = false;
	export let focused: boolean;
	export let currentNumber: number;
	export let oppositeNumber: number;

	const dispatch = createInputDispatcher();

	let squareInputMode = true;
	$: if (browser && focused && squareInputMode) {
		document
			.querySelector<HTMLInputElement>(`#${getInputId($cursor.orientation, $cursor.index)}`)
			?.focus();
	}

	$: if (browser && !focused && squareInputMode) {
		document
			.querySelector<HTMLInputElement>(`#${getInputId($cursor.orientation, $cursor.index)}`)
			?.scrollIntoView({ block: 'start' });
	}

	$: clues = {
		across: crossword.clues.filter((c) => c.number < 0).reverse(),
		down: crossword.clues.filter((c) => c.number > 0)
	};

	function getInputId(orientation: string, index: number) {
		return `clue-square-${orientation}-${index}`;
	}

	function handleChangeClue(clueIndex: number, orientation: string) {
		const index = clues[orientation as Orientation][clueIndex].indices[0];
		if (index === undefined) {
			return;
		}
		cursor.setIndex(index);
	}
</script>

{#each Object.entries(clues) as [orientation, list]}
	<ul class="w-[650px] min-w-fit max-w-screen shadow-md">
		<h2
			class="sticky top-0 h-10 flex items-center px-2 font-semibold bg-white dark:text-white dark:bg-gray-950 border-gray-950 dark:border-gray-800 border-b z-50"
		>
			{orientation.toUpperCase()}
		</h2>
		{#each list as clue, index}
			<li class:dark:bg-gray-800={!!(index % 2)}>
				<ClueInput
					{clue}
					{orientation}
					{editorMode}
					{focused}
					{getInputId}
					bind:squareInputMode
					selected={orientation === $cursor.orientation && currentNumber === clue.number}
					intersected={orientation !== $cursor.orientation && oppositeNumber === clue.number}
					squares={clue.indices.map((i) => crossword.grid[i])}
					on:updateClueText={(e) => dispatch('updateClueText', e.detail)}
					on:updateValue={(e) => dispatch('updateValue', e.detail)}
					on:clearValue={(e) => dispatch('clearValue', e.detail)}
					on:selectSquare={(e) => dispatch('selectSquare', e.detail)}
					on:next={() => handleChangeClue(index + 1, orientation)}
					on:previous={() => handleChangeClue(index - 1, orientation)}
				/>
			</li>
		{/each}
	</ul>
{/each}
