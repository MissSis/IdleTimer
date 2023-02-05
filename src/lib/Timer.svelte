<script lang="ts">
  import { extractTimeChange, millisToString, TimerInfo, type RemoveTimerEvent, type TimerUpdateEvent } from "./Timer";
  import { createEventDispatcher } from 'svelte';
  import IconButton from "./buttons/IconButton.svelte";

	const dispatch = createEventDispatcher<{removeTimer: RemoveTimerEvent}>();
  const dispatchUpdate = createEventDispatcher<{updateTimer: TimerUpdateEvent}>();

  export let title: string;
  export let accumulated = 0;
  export let id: string;
  export let time = 0;

  let lastTime = 0;
  let running = false;
  let paused = true;
  let timeChange = '';
  let inputShaking = false;

	function removeTimer(): void {
		dispatch('removeTimer', {
      id,
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
      }
    }
  };

  const updateButton = () => {
    if (!running || paused) {
      return;
    }
    time += Date.now() - lastTime;
    lastTime = Date.now();
  };

  const accumulateButton = () => {
    updateButton();
    accumulated += time;
    time = 0;
    running = false;
    paused = true;
  };

  const changeTime = (operation: 'add' | 'substract') => {
    const change = extractTimeChange(timeChange);
    if (!change) {
      shakeInput();
    } else if (operation === 'add') {
      time += change;
    } else if (operation === 'substract') {
      time -= change;
    }
    timeChange = '';
    updateButton();
  }

  function shakeInput() {
    inputShaking = true;
    setTimeout(() => {
      inputShaking = false;
    }, 600);
  }

  function keyup(e: KeyboardEvent) {
    if (e.code === 'Space') {
      e.preventDefault();
      startButton();
    }
  }

  $: startButtonColor = running ? (paused ? 'bg-yellow-600' : 'bg-green-700') : ''
</script>

<div
  class="flex flex-col justify-center items-center gap-2 p-3 border border-gray-500 bg-gray-700 shadow-lg rounded-lg relative
 focus-within:border-white focus-within::border-2 focus-within:bg-gray-600"
  tabindex="-1" on:keyup={keyup}
>
  <div class="grid gap-3 w-full" style="grid-template-columns: 3rem auto 3rem;">
    <div />
    <h1 class="text-5xl">{title}</h1>
    <IconButton image='delete-2-svgrepo-com.svg' onClick={removeTimer} />
  </div>
  <div>Total: {millisToString(accumulated)}</div>
  <div class="text-4xl">{millisToString(time)}</div>
  <div class="flex gap-1">
    <IconButton image='plus-svgrepo-com.svg' onClick={() => changeTime('add')} />
    <input bind:value={timeChange} on:keyup={(e) => e.stopPropagation()} class={inputShaking ? 'shake' : ''} />
    <IconButton image='minus-svgrepo-com.svg' onClick={() => changeTime('substract')} />
  </div>
  <div>
    <button on:click={startButton} class={startButtonColor}>
      {running ? (paused ? 'Resume' : 'Pause') : 'Start'}
    </button>
    <button on:click={updateButton}>Update</button>
    <button on:click={accumulateButton}>Accumulate</button>
  </div>
</div>

<style>
  .shake {
    animation: shake-anim 0.20s 2 alternate linear;
    border: 2px solid rgb(145, 0, 0);
  }

  @keyframes shake-anim {
    0% {
    }
    33% {
      transform: translateX(-10px);
    }
    66% {
      transform: translateX(+10px);
    }
    100% {
    }
  }
</style>