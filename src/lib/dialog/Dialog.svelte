<script lang="ts">
  export let open: boolean;
  export let title: string;
  export let close: () => void;
  export let submit: () => void | null = null;

  function keyPress(key: KeyboardEvent) {
    if (open && key.key === 'Escape') {
      close();
    } else if (open && key.key === 'Enter' && submit) {
      submit();
    }
  }
</script>

{#if open}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed bg-gray-700/80 w-full h-full z-10 grid place-items-center"
  on:click={close}>
  <div class="flex flex-col bg-gray-300 p-5 border rounded-lg" on:click={e => e.stopPropagation()}>
    <h1 class="text-3xl text-black pb-2">{title}</h1>
    <slot />
  </div>
</div>
{/if}
<svelte:window on:keydown={keyPress}/>