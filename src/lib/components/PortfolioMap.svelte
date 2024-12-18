<script lang="ts">
	import { page } from '$app/stores';
	import PortfolioCreationForm from './PortfolioCreationForm.svelte';

	let { data } = $props();

	async function deletePortfolio(slug: string) {
		try {
			const res = await fetch(`/admin/portfolios/${slug}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok) {
				// Refresh the portfolio list
				data.portfolios = data.portfolios.filter((p: { slug: string }) => p.slug !== slug);
			} else {
				console.error('Error deleting portfolio:', await res.json());
			}
		} catch (err) {
			console.error('Error deleting portfolio:', err);
		}
	}
</script>

{#if data.portfolios.length === 0}
	<p class="empty-state">No portfolios yet. Create your first portfolio!</p>
{:else}
	<div class="portfolio-list">
		{#each data.portfolios as portfolio}
			<div class="portfolio-item">
				<a href={`/admin/portfolios/${portfolio.slug}`}>{portfolio.title}</a>
				<button class="delete-btn" onclick={() => deletePortfolio(portfolio.slug)}> Delete </button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.portfolio-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
