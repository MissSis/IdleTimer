<script lang="ts">
  import hexToCssFilter from "../svg_colorizer/hexToCssFilter";

  export let alt = 'icon';
  export let image: string;
  export let color = '#fff';

  let filterString = hexToCssFilter(color);

  const imagePath = '../../public/';
</script>

<img alt={alt} src={imagePath + image} class="w-full h-full" style={filterString} />