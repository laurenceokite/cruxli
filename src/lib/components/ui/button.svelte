<script lang="ts">
	import { Button } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = Button.Props & {
		variant?: 'default';
		size: 'sm' | 'md' | 'lg' | 'full';
	};
	type $$Events = Button.Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'md';
	export let builders: $$Props['builders'] = [];
	export { className as class };

	function buttonVariants(opts: { variant: $$Props['variant']; size: $$Props['size'] }): string {
		let result = '';

		switch (opts.variant) {
			case 'default':
				result += '';
		}

		switch (opts.size) {
			case 'sm':
				result += '';
			case 'md':
				result += '';
			case 'lg':
				result += '';
			case 'full':
				result += '';
		}

		return result;
	}
</script>

<Button.Root
	{builders}
	class={cn(buttonVariants({ variant, size }), className)}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</Button.Root>
