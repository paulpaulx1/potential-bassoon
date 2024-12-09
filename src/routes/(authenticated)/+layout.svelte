<script lang="ts">
	import type { LayoutData } from './$types';

	let { children } = $props();
</script>

// src/routes/(authenticated)/+layout.svelte
<div class="authenticated-layout">
	<nav>
		<a href="/admin">Dashboard</a>
		<a href="/portfolios">Portfolios</a>
	</nav>

	<main>
		<script>
			let { children } = $props();
		</script>

		{@render children()}
	</main>
</div>

<style>
	.authenticated-layout {
		min-height: 100vh;
	}
</style>
