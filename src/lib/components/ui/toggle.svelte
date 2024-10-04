<script lang="ts">
	import { Toggle } from 'bits-ui';
	import { cn } from '$lib/utils';

	type $$Props = Toggle.Props & {
		variant?: 'default';
		size?: 'sm' | 'md';
	};
	type $$Events = Toggle.Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'md';
	export let pressed: $$Props['pressed'] = undefined;
	export { className as class };

	const baseClass = 'rounded-md';

	function toggleVariants(options: { variant: $$Props['variant']; size: $$Props['size'] }): string {
		let result = '';

		switch (options.variant) {
			case 'default':
				result += 'data-[state=on]:bg-slate-900';
				break;
		}

		switch (options.size) {
			case 'md':
				result += '';
				break;

			case 'sm':
				result += '';
				break;
		}

		return result;
	}
</script>

<Toggle.Root
	bind:pressed
	class={cn(toggleVariants({ variant, size }), baseClass, className)}
	{...$$restProps}
	on:click
>
	<slot />
</Toggle.Root>
