<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { SubmitFunction } from '@sveltejs/kit';
    
    let loading = false;

    const handleSubmit: SubmitFunction = () => {
        loading = true;
        return async ({ result }) => {
            if (result.type === 'success' && result.data?.status === 303) {
                await goto(result.data.headers?.Location ?? '/');
                return;
            }
            loading = false;
        };
    };
</script>

<form
	action="/admin/sign-out"
	method="POST"
	use:enhance={handleSubmit}
>
	<button type="submit" disabled={loading} class="signout-button">
		{loading ? 'Signing out...' : 'Sign Out'}
	</button>
</form>

<style>
	.signout-button {
		position: fixed;
		top: 16px;
		right: 16px;
		background: white;
		border: 1px solid var(--color-border);
		padding: 8px 16px;
		border-radius: 4px;
		font-size: 14px;
		z-index: 100;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.signout-button:hover {
		background: #f5f5f7;
	}

	.signout-button:disabled {
		opacity: 0.7;
	}
</style>
