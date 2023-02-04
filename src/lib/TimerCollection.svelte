<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Dialog from "./dialog/Dialog.svelte";
  import DialogButtons from "./dialog/DialogButtons.svelte";
  import type { RemoveTimerEvent, TimerProps } from "./Timer";
  import Timer from "./Timer.svelte";
  import { focus } from "./utils/utils";

  const dispatchRemove = createEventDispatcher<{removeTimer: {id: string}}>();
  const dispatchCreate = createEventDispatcher<{createTimer: {timer: TimerProps}}>();

  let timers: TimerProps[] = [];

  let newTimerTitle = '';
  let addDialogOpen = false;
  let removeDialogOpen = false;
  let removeTimerId: string | null = null;
  let dialogInput: HTMLInputElement;

  function closeDialog() {
    addDialogOpen = false;
    newTimerTitle = '';
  }

  function removeEventHandler(event: CustomEvent<RemoveTimerEvent>) {
    removeTimerId = event.detail.id;
    removeDialogOpen = true;
  }

  function removeTimer() {
    if (removeTimerId == null) {
      return;
    }
    timers.splice(timers.findIndex(timer => timer.id === removeTimerId), 1);
    timers = timers;
    removeDialogOpen = false;
    dispatchRemove('removeTimer', {id: removeTimerId});
  }

  function abortRemoveTimer() {
    removeDialogOpen = false;
    removeTimerId = null;
  }

  function createNewTimer(title: string) {
    timers = [...timers, {id: crypto.randomUUID(), title}];
    dispatchCreate('createTimer', {timer: timers[timers.length - 1]});
  }

  function newTimerSubmitButton() {
    createNewTimer(newTimerTitle);
    addDialogOpen = false;
    newTimerTitle = '';
  }
</script>

<button on:click={() => (addDialogOpen = true)} class="absolute left-1 top-1">+</button>
<Dialog bind:open={addDialogOpen} title="Create new timer" close={closeDialog}>
  <input bind:value={newTimerTitle} bind:this={dialogInput} use:focus />
  <DialogButtons>
    <button class="bg-red-700" on:click={closeDialog}>Cancel</button>
    <button class="bg-green-700" on:click={newTimerSubmitButton}>Submit</button>
  </DialogButtons>
</Dialog>
<Dialog bind:open={removeDialogOpen} title="Do you want to remove the timer?" close={abortRemoveTimer}>
  <DialogButtons>
    <button class="bg-red-700" on:click={abortRemoveTimer}>No</button>
    <button class="bg-green-700" on:click={removeTimer}>Yes</button>
  </DialogButtons>
</Dialog>
<div class="inline-flex flex-col gap-3 overflow-y-auto pt-5 pb-5">
  {#each timers as timer}
    <Timer {...timer} on:removeTimer={removeEventHandler} on:updateTimer />
  {/each}
</div>