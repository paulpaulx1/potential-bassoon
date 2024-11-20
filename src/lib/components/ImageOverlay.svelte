<script lang="ts">
	import type { Painting } from '$lib/types';

	let { painting, paintings } = $props();
	let dialog: HTMLDialogElement | null = $state(null);
	let fullImageLoaded = $state(false);

	function getNavigation(current: Painting) {
		const idx = paintings.findIndex((p: Painting) => p.slug === current.slug);
		return {
			prev: paintings[(idx - 1 + paintings.length) % paintings.length],
			next: paintings[(idx + 1) % paintings.length]
		};
	}

	$effect(() => {
		if (dialog) {
			dialog.showModal();
		}
	});
</script>

<dialog bind:this={dialog} class="overlay">
	<div class="overlay-content">
		<div class="image-wrapper">
			<img src={painting.blurImageUrl} class="blur-thumb" class:hidden={fullImageLoaded} alt="" />
			<img
				src={painting.fullImageUrl}
				alt={painting.title}
				class:loaded={fullImageLoaded}
				onload={() => (fullImageLoaded = true)}
			/>
		</div>
	</div>
	<nav class="navigation">
		<a
			href={`/work/${getNavigation(painting).prev.slug}`}
			class="nav-button prev"
			aria-label={`View previous work: ${getNavigation(painting).prev.title}`}
		>
			‹
		</a>
		<div class="painting-info">
			<h2>{painting.title}</h2>
			<p>{painting.description}</p>
		</div>
		<a
			href={`/work/${getNavigation(painting).next.slug}`}
			class="nav-button next"
			aria-label={`View next work: ${getNavigation(painting).next.title}`}
		>
			›
		</a>
	</nav>

	<a
		href="/"
		class="close-button"
		aria-label="Close and return to gallery"
		onclick={() => dialog?.close()}>×</a
	>
</dialog>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(255, 255, 255, 0.94);
		border: none;
		width: 100vw;
		height: 100vh;
		display: grid;
		place-items: center;
	}

	.image-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.blur-thumb {
		max-height: 70vh;
		max-width: 70vw;
		filter: blur(10px);
		transform: scale(1.05);
		transition: opacity 0.5s ease;
	}

	img:not(.blur-thumb) {
		position: absolute;
		max-height: 70vh;
		max-width: 70vw;
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	.navigation {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.nav-button {
		background: none;
		border: none;
		color: rgb(71, 71, 71);
		font-size: 4rem;
		cursor: pointer;
		transition: color 0.2s;
		font-family: -apple-system, BlinkMacSystemFont, sans-serif;
		padding: 1rem;
	}

	.nav-button:hover {
		color: rgb(40, 40, 40);
	}

	.close-button {
		position: absolute;
		top: 2rem;
		right: 2rem;
		background: none;
		border: none;
		color: rgb(40, 40, 40);
		font-size: 2rem;
		cursor: pointer;
	}

	.hidden {
		opacity: 0;
	}

	.loaded {
		opacity: 1 !important;
	}

	.nav-button {
		color: rgb(71, 71, 71);
		font-size: 4rem;
		text-decoration: none;
		padding: 1rem;
		transition: color 0.2s;
	}

	.nav-button:hover {
		color: rgb(40, 40, 40);
	}

	.prev {
		left: 2rem;
	}

	.next {
		right: 2rem;
	}
</style>
