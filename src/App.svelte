<script lang="ts">
  import TimerCollection from "./lib/TimerCollection.svelte";
  import PersistencyManager from "./lib/persistency/PersistencyManager";
  import { onDestroy } from "svelte";

  let persistenceManager = new PersistencyManager();
  let initialized = false;
  persistenceManager.init().then(() => (initialized = true));

  onDestroy(() => {
    persistenceManager.close();
  });
</script>

<main class="flex justify-center bg-gray-800">
  <div class="m-10"></div>
  <TimerCollection />
</main>

<style>
</style>