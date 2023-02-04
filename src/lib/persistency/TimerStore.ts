import { writable } from "svelte/store";
import type { TimerProps } from "../Timer";

export default writable<TimerProps[]>([]);