<script lang="ts">
    import type { PageData } from './$types';
    import ImageOverlay from '$lib/components/ImageOverlay.svelte';
    
    export let data: PageData;
</script>

<ImageOverlay 
    painting={data.painting}
    paintings={data.paintings}
    onClose={() => {}}  
/>