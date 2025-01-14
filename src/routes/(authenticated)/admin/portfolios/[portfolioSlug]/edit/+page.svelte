<script lang="ts">
	import type { PageData } from './$types';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	let { data } = $props();
	// Use $state for reactive array
	let items = $state(data.portfolio.pieces);
	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<{ items: typeof items }>) {
		// Create new array reference
		items = [...e.detail.items];
	}

	async function handleDndFinalize(e: CustomEvent<{ items: typeof items }>) {
		// Create new array reference
		items = [...e.detail.items];

		console.log('Starting reorder...');
		console.log(
			'New order:',
			items.map((item) => ({
				id: item.id,
				title: item.title
			}))
		);

		const formData = new FormData();
		const pieceIds = items.map((item) => item.id);
		formData.append('pieceIds', JSON.stringify(pieceIds));

		try {
			const response = await fetch(`?/reorder`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Failed to save order');
			console.log('✅ Reorder saved successfully');
		} catch (error) {
			console.error('❌ Failed to save new order:', error);
		}
	}
</script>

<div class="editor-layout">
	<div class="text-panel">
		<h2>{data.portfolio.title}</h2>
		<p>{data.portfolio.description || ''}</p>
	</div>

	<section
		use:dndzone={{ items, flipDurationMs }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
		aria-label="Portfolio pieces grid"
		class="piece-grid"
	>
		{#each items as piece (piece.id)}
			<div animate:flip={{ duration: flipDurationMs }} class="piece-item" aria-label={piece.title}>
				<img src={piece.fullImageUrl} alt={piece.title} class="piece-image" />
			</div>
		{/each}
	</section>
</div>

<style>
	.editor-layout {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 2rem;
		padding: 2rem;
		min-height: 100vh;
	}

	.piece-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1rem;
		height: 100%;
	}

	.piece-item {
		cursor: grab;
		background: white;
		border-radius: 4px;
		overflow: hidden;
		transition: box-shadow 200ms ease;
		transform: translate(0, 0); /* Helps with rendering during drag */
		will-change: transform; /* Optimizes for animations */
		-webkit-backface-visibility: hidden; /* Prevents flickering */
	}

	.piece-item:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.piece-item:active {
		opacity: 1;
	}

	.piece-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		aspect-ratio: 1;
		pointer-events: none; /* Prevents image from interfering with drag */
	}
</style>
