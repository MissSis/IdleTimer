<script lang="ts">
  import TimerCollection from "./lib/TimerCollection.svelte";
  import PersistencyManager from "./lib/persistency/PersistencyManager";
  import { onDestroy } from "svelte";

  let persistenceManager = new PersistencyManager();
  let initialized = false;
  persistenceManager.init().then(() => (initialized = true));

  document.documentElement.classList.add('bg-gray-800');

  onDestroy(() => {
    persistenceManager.close();
  });
</script>

<main class="flex justify-center bg-gray-800 h-full">
  <TimerCollection />
</main>

<style>
</style>