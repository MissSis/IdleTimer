<script lang="ts">
  import TimerCollection from "./lib/TimerCollection.svelte";
  import PersistencyManager from "./lib/persistency/PersistencyManager";
  import { onDestroy } from "svelte";
  import Dialog from "./lib/dialog/Dialog.svelte";
  import DialogButtons from "./lib/dialog/DialogButtons.svelte";

  let persistenceManager = new PersistencyManager();
  let errorDialogOpen = false;
  let errorMessage = '';
  persistenceManager.init()
    .catch(e => {
      errorMessage = e;
      errorDialogOpen = true;
    });

  document.documentElement.classList.add('bg-gray-800');

  function closeDialog() {
    errorDialogOpen = false;
  }

  onDestroy(() => {
    persistenceManager.close();
  });
</script>

<main class="flex justify-center bg-gray-800 h-full">
  <Dialog open={errorDialogOpen} title='Error occured' close={closeDialog}>
    <div class="text-black">{errorMessage}</div>
    <DialogButtons>
      <button class="bg-red-700" on:click={closeDialog}>Dismiss</button>
    </DialogButtons>
  </Dialog>
  <TimerCollection />
</main>

<style>
</style>