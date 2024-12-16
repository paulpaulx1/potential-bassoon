<!-- routes/portfolios/+page.svelte -->
<script lang="ts">
    import SignOut from '$lib/components/SignOut.svelte';
    export let data;
</script>

<div class="container">
    <SignOut></SignOut>

    <div class="account-info">
        <h2>Account Info</h2>
        <div class="info-grid">
            <p><span>Email:</span> {data.user.email}</p>
            <p><span>Name:</span> {data.user.name}</p>
            <p><span>Member since:</span> {new Date(data.user.createdAt).toLocaleDateString()}</p>
        </div>
    </div>
    
    <h1>Your Portfolios</h1>

    <div class="portfolios">
        <div class="header">
            <h2>Your Portfolios</h2>
            <button on:click={() => alert('Create portfolio functionality coming soon!')}>
                Create New Portfolio
            </button>
        </div>
        
        <p class="empty-state">
            No portfolios yet. Click "Create New Portfolio" to get started!
        </p>
    </div>
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

    .account-info, .portfolios {
        background-color: white;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .account-info {
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
</style>