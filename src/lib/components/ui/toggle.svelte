<script lang="ts">
    import { Toggle } from "bits-ui";

    type $$Props = Toggle.Props;
    type $$Events = Toggle.Events;

    let className: $$Props["class"] = undefined;
    export let pressed: $$Props["pressed"] = undefined;
    export { className as class };
</script>

<Toggle.Root
    bind:pressed
    class="cursor-pointer rounded-md border border-gray-600 bg-transparent p-1 transition-colors duration-300 hover:enabled:bg-violet-400/75 disabled:cursor-not-allowed disabled:text-gray-800 data-[state=on]:bg-violet-500/75 disabled:data-[state]:bg-gray-700/50 xl:p-2 enabled:dark:data-[state=off]:text-slate-400"
    {...$$restProps}
    on:click
>
    <slot />
</Toggle.Root>
