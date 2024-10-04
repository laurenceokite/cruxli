<script lang="ts">
	import { writable } from 'svelte/store';
	import '../app.css';
	import { onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';

	const darkMode = writable<boolean | null>(null);
	$: applyDarkMode($darkMode);

	function applyDarkMode(mode: boolean | null) {
		if (!browser) return;
		switch (mode) {
			case null:
				mode = window.matchMedia('(prefers-color-scheme: dark)').matches;
			case true:
				document.documentElement.classList.add('dark');
				break;
			case false:
				document.documentElement.classList.remove('dark');
				break;
		}
	}

	setContext('darkMode', darkMode);

	onMount(() => applyDarkMode($darkMode));
</script>

<slot />
