<script lang="ts">
	import { writable } from 'svelte/store';
	import '../app.css';
	import { onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';

	const darkMode = writable<boolean | null>(null);
	$: applyDarkMode($darkMode);

	function applyDarkMode(mode: boolean | null) {
		if (!browser) return;

		if (mode === null) {
			mode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		if (mode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	setContext('darkMode', darkMode);

	onMount(() => applyDarkMode($darkMode));
</script>

<slot />
