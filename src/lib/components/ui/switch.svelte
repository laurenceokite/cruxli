<script lang="ts">
	import { Switch } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = Switch.Props;
	type $$Events = Switch.Events;

	let className: $$Props['class'] = undefined;

	export let checked: $$Props['checked'] = undefined;
	export { className as class };

	const baseRoot =
		'transition-colors duration-300 relative inline-flex items-center shrink-0 rounded-lg w-[88px] h-[48px] bg-gray-600/30 border border-gray-600';
</script>

<Switch.Root bind:checked class={cn(className, baseRoot)} {...$$restProps} on:click on:keydown>
	<Switch.Thumb
		class="pointer-events-none peer duration-300 shadow-sm transition-transform data-[state=checked]:translate-x-[44px] data-[state=unchecked]:translate-x-[6px] h-[36px] w-[36px] rounded-lg bg-violet-500 shadow-gray-950"
	/>
	<div class="absolute left-1 right-1/2 flex justify-center items-center pointer-events-none">
		<slot name="left" />
	</div>
	<div class="absolute right-1 left-1/2 flex justify-center items-center pointer-events-none">
		<slot name="right" />
	</div>
</Switch.Root>
