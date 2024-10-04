<div class="flex justify-center h-min bg-white dark:bg-gray-950 pt-8 w-full max-w-screen">
	<slot />
</div>

<style>
	:global(.crossword-grid) {
		@apply grid w-fit h-fit max-h-screen xl:border-2 border-gray-950 dark:border-gray-800 dark:bg-gray-800 aspect-square;
	}
	:global(.crossword-grid) {
		grid-template-columns: repeat(var(--grid-size), minmax(auto, 3rem));
		grid-template-rows: repeat(var(--grid-size), minmax(auto, 3rem));
	}
</style>
