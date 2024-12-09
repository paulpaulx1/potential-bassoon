<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children } = $props();
</script>

<!-- // src/routes/(authenticated)/+layout.svelte
{data.user.email} -->
<div class="authenticated-layout">
	<nav>
		<a href="/admin">Dashboard</a>
		<a href="/portfolios">Portfolios</a>
	</nav>

	<main>

		{@render children()}
	</main>
</div>

<style>
	.authenticated-layout {
		min-height: 100vh;
	}
</style>
