<script lang="ts">
  import hexToCssFilter from "../svg_colorizer/hexToCssFilter";

  export let alt = 'icon';
  export let image: string;
  export let color = '#fff';

  let filterString = hexToCssFilter(color);
</script>

<img alt={alt} src={image} class="w-full h-full" style={filterString} />