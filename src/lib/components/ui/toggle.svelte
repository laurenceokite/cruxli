<script lang="ts">
	import { Toggle } from 'bits-ui';

	type $$Props = Toggle.Props;
	type $$Events = Toggle.Events;

	let className: $$Props['class'] = undefined;
	export let pressed: $$Props['pressed'] = undefined;
	export { className as class };
</script>

<Toggle.Root
	bind:pressed
	class="transition-colors duration-300 rounded-md border border-gray-600 p-1 xl:p-2 enabled:dark:data-[state=off]:text-slate-400 bg-transparent data-[state=on]:bg-violet-500/75 hover:enabled:bg-violet-400/75 cursor-pointer disabled:cursor-not-allowed disabled:data-[state]:bg-gray-700/50 disabled:text-gray-800"
	{...$$restProps}
	on:click
>
	<slot />
</Toggle.Root>
