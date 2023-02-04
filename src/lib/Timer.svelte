<script lang="ts">
  import { extractTimeChange, millisToString, TimerInfo, type RemoveTimerEvent, type TimerUpdateEvent } from "./Timer";
  import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{removeTimer: RemoveTimerEvent}>();
  const dispatchUpdate = createEventDispatcher<{updateTimer: TimerUpdateEvent}>();

  export let title: string;
  export let accumulated = 0;
  export let id: string;

  let time = 0;
  let lastTime = 0;
  let running = false;
  let paused = true;
  let timeChange = '';
  let tooltipOpen = false;

	function removeTimer(): void {
		dispatch('removeTimer', {
      id,
		});
	}

  function sendTime() {
    dispatchUpdate('updateTimer', {
      id,
      time,
    });
  }
  
  function sendTimeAndAccumulated() {
    dispatchUpdate('updateTimer', {
      id,
      accumulated,
      time,
    });
  }

  const startButton = () => {
    if (!running) {
      lastTime = Date.now();
      running = true;
      paused = false;
    } else {
      if (paused) {
        lastTime = Date.now();
        paused = false;
      } else {
        time += Date.now() - lastTime;
        paused = true;
        sendTime();
      }
    }
  };

  const updateButton = () => {
    if (!running || paused) {
      return;
    }
    time += Date.now() - lastTime;
    lastTime = Date.now();
    sendTime();
  };

  const accumulateButton = () => {
    updateButton();
    accumulated += time;
    time = 0;
    running = false;
    paused = true;
    sendTimeAndAccumulated();
  };

  const changeTime = (operation: 'add' | 'substract') => {
    const change = extractTimeChange(timeChange);
    if (!change) {
    } else if (operation === 'add') {
      time += change;
    } else if (operation === 'substract') {
      time -= change;
    }
    timeChange = '';
    updateButton();
  }

  function keyup(e: KeyboardEvent) {
    if (e.code === 'Space') {
      e.preventDefault();
      startButton();
    }
  }

  $: startButtonColor = running ? (paused ? 'bg-yellow-600' : 'bg-green-700') : ''
</script>

<div class="flex flex-col justify-center items-center gap-2 p-3 border rounded-lg relative" tabindex="-1" on:keyup={keyup}>
  <button class="absolute top-2 right-2" on:click={removeTimer}>X</button>
  <h1 class="text-5xl">{title}</h1>
  <div>Total: {millisToString(accumulated)}</div>
  <div class="text-4xl">{millisToString(time)}</div>
  <div>
    <button on:click={() => changeTime('add')}>+</button>
    <input bind:value={timeChange} on:keyup={(e) => e.stopPropagation()} />
    <button on:click={() => changeTime('substract')}>-</button>
  </div>
  <div>
    <button on:click={startButton} class={startButtonColor}>
      {running ? (paused ? 'Resume' : 'Pause') : 'Start'}
    </button>
    <button on:click={updateButton}>Update</button>
    <button on:click={accumulateButton}>Accumulate</button>
  </div>
</div>