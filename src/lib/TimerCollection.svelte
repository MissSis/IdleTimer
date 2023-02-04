<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Dialog from "./dialog/Dialog.svelte";
  import DialogButtons from "./dialog/DialogButtons.svelte";
  import type { RemoveTimerEvent, TimerProps } from "./Timer";
  import Timer from "./Timer.svelte";
  import { focus } from "./utils/utils";
  import timerStore from './persistency/TimerStore';

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
    $timerStore.splice($timerStore.findIndex(timer => timer.id === removeTimerId), 1);
    $timerStore = $timerStore;
    removeDialogOpen = false;
  }

  function abortRemoveTimer() {
    removeDialogOpen = false;
    removeTimerId = null;
  }

  function createNewTimer(title: string) {
    $timerStore = [...$timerStore, {id: crypto.randomUUID(), title}];
  }

  function newTimerSubmitButton() {
    createNewTimer(newTimerTitle);
    addDialogOpen = false;
    newTimerTitle = '';
  }
</script>

<button on:click={() => (addDialogOpen = true)} class="absolute left-1 top-1">+</button>
<Dialog bind:open={addDialogOpen} title="Create new timer" close={closeDialog} submit={newTimerSubmitButton}>
  <input bind:value={newTimerTitle} bind:this={dialogInput} use:focus />
  <DialogButtons>
    <button class="bg-red-700" on:click={closeDialog}>Cancel</button>
    <button class="bg-green-700" on:click={newTimerSubmitButton}>Submit</button>
  </DialogButtons>
</Dialog>
<Dialog bind:open={removeDialogOpen} title="Do you want to remove the timer?" close={abortRemoveTimer} submit={removeTimer}>
  <DialogButtons>
    <button class="bg-red-700" on:click={abortRemoveTimer}>No</button>
    <button class="bg-green-700" on:click={removeTimer}>Yes</button>
  </DialogButtons>
</Dialog>
<div class="inline-flex flex-col gap-3 overflow-y-auto pt-5 pb-5">
  {#each $timerStore as timer}
    <Timer id={timer.id}
      bind:time={timer.time} bind:title={timer.title} bind:accumulated={timer.accumulated}
      on:removeTimer={removeEventHandler} />
  {/each}
</div>