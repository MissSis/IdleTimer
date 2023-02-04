<script lang="ts">
  import TimerCollection from "./lib/TimerCollection.svelte";
  import PersistencyManager from "./lib/persistency/PersistencyManager";
  import type { TimerProps, TimerUpdateEvent } from "./lib/Timer";

  let persistenceManager = new PersistencyManager();
  let initialized = false;
  persistenceManager.init().then(() => (initialized = true));

  function updateTimer(event: CustomEvent<TimerUpdateEvent>) {
    if (initialized) {
      persistenceManager.updateTimer(event.detail);
    }
  }

  function createTimer(event: CustomEvent<{timer: TimerProps}>) {
    persistenceManager.createTimer(event.detail.timer);
  }

  function removeTimer(event: CustomEvent<{id: string}>) {
    persistenceManager.deleteTimer(event.detail.id);
  }

</script>

<main class="flex justify-center">
  <div class="m-10"></div>
  <TimerCollection on:updateTimer={updateTimer} on:createTimer={createTimer} on:removeTimer={removeTimer} />
</main>

<style>
</style>