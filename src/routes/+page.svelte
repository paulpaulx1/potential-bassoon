<script lang="ts">
	import ImageCard from '$lib/components/ImageCard.svelte';
	import type { PageData } from './$types';
  
	const { data } = $props<{ data: PageData }>();
  </script>
  
  <main>
	  <h1>paulmneenan@gmail.com</h1>
	  <div class="gallery">
		{#each [...data.pieces].reverse() as piece}
		  <ImageCard {...piece} />
		{/each}
	  </div>
  </main>
  

<style>
	main {
		font-family:
			Inter,
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;

		padding: 32px;
		max-width: 1400px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		margin-bottom: 32px;
		font-size: 32px;
		color: rgb(40, 40, 40);
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 32px;
	}

</style>
