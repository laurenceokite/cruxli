<script lang="ts">
	import InputGrid from '$lib/components/InputGrid.svelte';
	import GridDesigner from '$lib/components/GridDesigner.svelte';
	import { updateValue } from '$lib/commands/update-value';
	import { toggleSquares } from '$lib/commands/toggle-square';
	import { resizeGrid } from '$lib/commands/resize';
	import { updateClueText } from '$lib/commands/update-clue';
	import ClueList from '$lib/components/ClueList.svelte';
	import GridWrapper from '$lib/components/GridWrapper.svelte';
	import { newCrossword } from '$lib/crossword';
	import { cursor, Cursor } from '$lib/stores/cursor';
	import { onMount } from 'svelte';
	import EditorControls from '$lib/components/EditorControls.svelte';
	import type { Crossword, Orientation, CrosswordInputEvent, EditorCommand } from '$lib/types';

	export let crossword: Readonly<Crossword> = newCrossword(15);
	export let isEditor = true;

	$: gridSideLength = remSize * 3 * crossword.size;
	$: breakpoint = gridSideLength * 2;
	$: isSplit = outerWidth < breakpoint || outerWidth < 800;
	let outerWidth: number;
	let remSize: number;

	enum Section {
		Grid,
		Clues,
		Controls
	}

	let isGridDesigner = false;
	let listView = false;
	let autoSymmetry = true;
	let goToNextEmptySquare = true;
	let previousNumber = 0;
	let currentNumber = 0;
	let warnings: Set<number> | undefined;
	let focusedSection: Section;
	let undo: EditorCommand[] = [];
	let redo: EditorCommand[] = [];

	$: currentSquare = crossword.grid[$cursor.index];
	$: if ($cursor.index > -1) {
		setPreviousNumber();
		setCurrentNumber($cursor.orientation);
	}

	$: oppositeNumber = currentSquare?.[Cursor.opposite($cursor.orientation)] ?? 0;
	$: currentClue = crossword.clues.find((c) => c.number === currentNumber);

	// If we change clue number check if we should update goToNextEmpty
	$: if (previousNumber !== currentNumber) {
		// If we've moved to a black square, or an already filled square, we can set it to false
		if (goToNextEmptySquare && currentSquare && currentSquare.value !== '') {
			goToNextEmptySquare = false;

			goToNextEmptySquare = true;
		}
	} else if (goToNextEmptySquare && currentSquare && currentSquare.value !== '') {
		goToNextEmptySquare = false;
	}

	$: if (!isGridDesigner && !currentSquare) {
		cursor.move(Cursor.forward($cursor.orientation));
	}

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

	function setPreviousNumber() {
		previousNumber = currentNumber;
	}

	function setCurrentNumber(o: Orientation) {
		currentNumber = currentSquare?.[o] ?? 0;
	}

	function handleUpdateValue(event: CrosswordInputEvent['updateValue']) {
		execute(updateValue(...event.detail));

		if (goToNextEmptySquare) {
			cursor.goToNextEmptySquare(currentClue?.indices);
		} else {
			cursor.move(Cursor.forward($cursor.orientation), true);
		}
	}

	function handleClearValue(event: CrosswordInputEvent['clearValue']) {
		execute(updateValue(event.detail, ''));
		cursor.move(Cursor.backward($cursor.orientation));
	}

	function handleToggleSquare(event: CrosswordInputEvent['toggleSquare']) {
		cursor.setIndex(event.detail);
		const indices = [event.detail];

		if (autoSymmetry) {
			indices.push(crossword.grid.length - (event.detail + 1));
		}

		execute(toggleSquares(indices));
		warnings = findLayoutWarnings();
	}

	function handleUpdateClueText(event: CrosswordInputEvent['updateClueText']) {
		execute(updateClueText(...event.detail));
	}

	function handleSelectSquare(event: CrosswordInputEvent['selectSquare'], section: Section) {
		focusedSection = section;
		cursor.setIndex(event.detail);
	}

	function handleResizeGrid(event: CrosswordInputEvent['resizeGrid']) {
		execute(resizeGrid(event.detail));
		warnings = findLayoutWarnings();
	}

	function handleKeydown(event: KeyboardEvent) {
		const { key } = event;

		switch (key) {
			case 'Escape':
				isGridDesigner = !isGridDesigner;
		}
	}

	function findLayoutWarnings(): Set<number> {
		return new Set(
			crossword.clues.map((clue) => (clue.indices.length > 2 ? undefined : clue.indices)).flat()
		) as Set<number>;
	}

	onMount(() => {
		cursor.initialize(() => crossword);
		remSize = parseInt(getComputedStyle(document.documentElement).fontSize);
	});
</script>

<svelte:window on:keydown={handleKeydown} bind:outerWidth />

<div class="relative flex flex-col items-center w-full pt-32 dark:bg-gray-800">
	<section
		class="absolute top-0 left-0 right-0 h-32 flex justify-center"
		on:focusin={() => {
			focusedSection = Section.Controls;
		}}
	>
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

	<div
		class="flex w-full bg-gray-50 dark:bg-gray-950 divide-x divide-gray-600"
		style={`max-width: ${Math.max(1200, breakpoint * 2)}px;`}
	>
		{#if !isSplit || !listView}
			<section
				class="flex flex-1 justify-center"
				on:focusin={() => {
					focusedSection = Section.Grid;
				}}
			>
				<GridWrapper>
					{#if !isEditor || isGridDesigner}
						<GridDesigner
							grid={crossword.grid}
							size={crossword.size}
							focused={focusedSection === Section.Grid}
							{autoSymmetry}
							invalidIndices={warnings}
							on:toggleSquare={handleToggleSquare}
							on:selectSquare={(e) => handleSelectSquare(e, Section.Grid)}
						/>
					{:else}
						<InputGrid
							{crossword}
							{currentNumber}
							focused={focusedSection === Section.Grid}
							on:updateValue={handleUpdateValue}
							on:clearValue={handleClearValue}
							on:selectSquare={(e) => handleSelectSquare(e, Section.Grid)}
						/>
					{/if}
				</GridWrapper>
			</section>
		{/if}

		{#if !isSplit || listView}
			<section
				class="flex flex-1 flex-wrap justify-center overflow-scroll h-[calc(100vh-6rem)] w-full"
				on:focusin={() => {
					focusedSection = Section.Clues;
				}}
			>
				<ClueList
					editorMode={isEditor}
					focused={focusedSection === Section.Clues}
					{crossword}
					{currentNumber}
					{oppositeNumber}
					on:updateClueText={handleUpdateClueText}
					on:updateValue={handleUpdateValue}
					on:clearValue={handleClearValue}
					on:selectSquare={(e) => handleSelectSquare(e, Section.Clues)}
				/>
			</section>
		{/if}
	</div>
</div>
