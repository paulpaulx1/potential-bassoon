<script lang="ts">
    import ImageOverlay from '$lib/components/display/portfolio/ImageOverlay.svelte';
    let { data } = $props();
</script>

<ImageOverlay 
    painting={data.painting}
    paintings={data.paintings}
/>