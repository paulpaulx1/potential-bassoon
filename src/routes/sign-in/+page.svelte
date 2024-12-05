<!-- src/routes/sign-in/+page.svelte -->
<script lang="ts">
	import SignInRegister from '$lib/components/SignInRegister.svelte';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
</script>

<div class="container">
	<div class="auth-card">
		<SignInRegister message={form?.message} email={form?.email} />
	</div>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}

	.auth-card {
		background: white;
		padding: 32px;
		border-radius: 6px;
		border: 1px solid var(--color-border);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		width: 100%;
		max-width: 400px;
	}
</style>
