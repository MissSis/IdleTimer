<script lang="ts">
  import Icon from "./Icon.svelte";

  export let onClick: () => void = () => {};
  export let classes: string = '';

  export let alt = 'icon';
  export let image: string;
  export let color = '#fff';

  const classesArray = classes.split(' ');

  const defaultClasses = ["w-12", "h-12", "p-2"].filter(cls => {
    const minusIndex = cls.indexOf('-', 0) !== -1 ? cls.indexOf('-', 0) : cls.length;
    const cssAttribute = cls.substring(0, minusIndex);

    return !classesArray.some(cls => cls.startsWith(cssAttribute));
  });
</script>


<button on:click={onClick} class={defaultClasses.join(' ') + ' ' + classes}>
  <Icon {...{alt, image, color}} />
</button>