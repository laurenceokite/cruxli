<script lang="ts">
	import { Button } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = Button.Props & {
		variant?: 'primary' | 'secondary';
		size?: 'sm' | 'md' | 'lg' | 'full';
	};
	type $$Events = Button.Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'primary';
	export let size: $$Props['size'] = 'md';
	export let builders: $$Props['builders'] = [];
	export { className as class };

	const baseClass =
		'transition-colors duration-300 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-800 flex justify-center items-center shadow-sm enabled:shadow-gray-950';

	function sizeClass(s: $$Props['size']) {
		switch (s) {
			case 'sm':
				return '';
			case 'md':
				return 'w-[64px] h-[40px]';
			case 'lg':
				return '';
			case 'full':
				return '';
		}
	}

	function variantClass(v: $$Props['variant']) {
		if (v === 'primary') {
			return 'bg-violet-500 hover:bg-violet-400';
		}
		if (v === 'secondary') {
			return 'bg-gray-950 hover:bg-gray-900 text-slate-300';
		}
		return '';
	}
</script>

<Button.Root
	{builders}
	class={cn(className, sizeClass(size), variantClass(variant), baseClass)}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</Button.Root>
