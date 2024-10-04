<script lang="ts">
	import { Switch } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = Switch.Props & {
		size?: 'sm' | 'md';
		variant?: 'default';
	};
	type $$Events = Switch.Events;

	let className: $$Props['class'] = undefined;

	export let size: $$Props['size'] = 'md';
	export let variant: $$Props['variant'] = 'default';
	export let checked: $$Props['checked'] = undefined;
	export { className as class };

	function switchVariants(opts: { size: $$Props['size']; variant: $$Props['variant'] }) {
		let result = '';

		switch (opts.size) {
			case 'sm':
				result += '';
				break;
			case 'md':
				result += '';
				break;
		}

		switch (opts.variant) {
			case 'default':
				result += '';
				break;
		}

		return result;
	}
</script>

<Switch.Root
	bind:checked
	class={cn(switchVariants({ variant, size }), className)}
	{...$$restProps}
	on:click
	on:keydown
>
	<div class="absolute left-2">
		<slot name="left" />
	</div>
	<div class="absolute right-2">
		<slot name="right" />
	</div>
	<Switch.Thumb />
</Switch.Root>
