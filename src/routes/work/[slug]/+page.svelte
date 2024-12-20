<script lang="ts">
    import type { PageData } from './$types';
    import ImageOverlay from '$lib/components/display/portfolio/ImageOverlay.svelte';
    
    let { data } = $props();
    console.log(data);
</script>

<ImageOverlay 
    painting={data.painting}
    paintings={data.paintings}
/>