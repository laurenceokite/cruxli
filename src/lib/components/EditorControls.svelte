<script lang="ts">
	import { createInputDispatcher } from '../commands';
	import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '$lib/crossword';
	import type { Crossword } from '$lib/types';
	import { FlipVertical, List, Blocks, TextCursorInput, Save, FileUp } from 'lucide-svelte';
	import Switch from './ui/switch.svelte';
	import Button from './ui/button.svelte';
	import Input from './ui/input.svelte';
	import Toggle from './ui/toggle.svelte';
	export let crossword: Readonly<Crossword>;
	export let autoSymmetry: boolean;
	export let isGridDesigner: boolean;
	export let undoable: boolean;
	export let redoable: boolean;
	export let isSplit: boolean;
	export let listView: boolean;

	let { size } = crossword;
	$: setSize(crossword.size);

	function setSize(newSize: number) {
		size = newSize;
	}

	const dispatch = createInputDispatcher<{
		undo: null;
		redo: null;
		toggleView: null;
	}>();
</script>

<div
	class="flex w-full h-full items-start flex-wrap-reverse px-2 pb-2 xl:pb-6 xl:px-6 gap-2 border-b border-gray-600 shadow-sm dark:bg-gray-800"
>
	<div class="flex flex-1 flex-nowrap justify-between max-w-xl">
		<fieldset class="flex gap-1 xl:gap-2">
			<Button
				type="button"
				class="px-2 xl:px-4"
				on:click={() => dispatch('undo')}
				disabled={!undoable}
			>
				Undo
			</Button>

			<Button
				type="button"
				class="px-2 xl:px-4 text-sm"
				on:click={() => dispatch('redo')}
				disabled={!redoable}
			>
				Redo
			</Button>
		</fieldset>

		<div class="flex gap-2 xl:gap-6 items-center">
			<Switch
				bind:checked={isGridDesigner}
				aria-label={isGridDesigner ? 'Switch to text input.' : 'Switch to grid designer.'}
			>
				<Blocks slot="left" />
				<TextCursorInput slot="right" />
			</Switch>
			<Toggle
				bind:pressed={autoSymmetry}
				disabled={!isGridDesigner}
				aria-label={`Toggle auto-symmetry ${autoSymmetry ? 'off' : 'on'}.`}
			>
				<FlipVertical class="h-6 w-6" />
			</Toggle>
			<Input
				id="sizeInput"
				type="number"
				aria-label="Set grid size."
				min={MIN_GRID_SIZE}
				max={MAX_GRID_SIZE}
				class="form-input w-24 flex items-center"
				bind:value={size}
				on:change={() => dispatch('resizeGrid', size)}
			/>
		</div>
	</div>

	<div class="flex flex-1 flex-nowrap justify-between">
		{#if isSplit}
			<Toggle
				bind:pressed={listView}
				variant="default"
				class="bg-white data-[state='on']:bg-blue-100"
			>
				<List class="h-6 w-6" />
			</Toggle>
		{:else}
			<div aria-hidden="true" class="opacity-0 h-[1px] w-[1px]"></div>
		{/if}

		<div class="flex items-center gap-2">
			<Button type="button">
				<Save class="h-6 w-6" />
			</Button>
			<Button type="button">
				<FileUp class="h-6 w-6" />
			</Button>
		</div>
	</div>
</div>
