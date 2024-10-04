import type { InputDispatchArgs } from "$lib/types";
import { createEventDispatcher } from "svelte";

export function createInputDispatcher<T extends Record<string, any> = {}>() {
  return createEventDispatcher<InputDispatchArgs & T>();
}
