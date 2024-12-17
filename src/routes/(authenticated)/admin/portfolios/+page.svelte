<script lang="ts">
	let { data } = $props();
	let portfolioTitle = $state('');
</script>

<div class="container">
	<div class="header">
		<h2>Your Portfolios</h2>
		<form method="POST">
			<input
				type="text"
				name="title"
				bind:value={portfolioTitle}
				placeholder="Portfolio Title"
				required
			/>
			<button type="submit">Create Portfolio</button>
		</form>
	</div>

	{#if data.portfolios.length === 0}
		<p class="empty-state">No portfolios yet. Create your first portfolio!</p>
	{:else}
		<div class="portfolio-list">
			{#each data.portfolios as portfolio}
				<a href={`/admin/portfolios/${portfolio.slug}`}>{portfolio.title}</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}

	.account-info {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 1.5rem;
	}

	h2 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.info-grid p span {
		font-weight: 500;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	button {
		background-color: #2563eb;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #1d4ed8;
	}

	.empty-state {
		color: #4b5563;
	}

	.portfolio-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.portfolio-list a {
		text-decoration: none;
		color: #2563eb;
		padding: 0.5rem 0;
	}

	.portfolio-list a:hover {
		text-decoration: underline;
	}
</style>
