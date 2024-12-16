<!-- routes/(authenticated)/settings/domains/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';

    let { data } = $props();
</script>

<div class="container">
    <h1>Custom Domains</h1>

    <form method="POST" action="?/addDomain" use:enhance>
        <div class="form-group">
            <label for="domain-input">Domain Name</label>
            <input
                id="domain-input"
                type="text"
                name="domain"
                placeholder="yourdomain.com"
            />
        </div>
        
        <div class="help-text">
            After adding your domain, set this CNAME record:
            <pre>
                CNAME @ your-app.railway.app
            </pre>
        </div>

        <button type="submit">Add Domain</button>
    </form>

    <div class="domains-list">
        {#each data.domains as domain}
            <div class="domain-card">
                <h3>{domain.domain}</h3>
                <p class="status">
                    {domain.verified ? 'Verified' : 'Pending verification'}
                </p>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .help-text {
        margin: 1rem 0;
        font-size: 0.9rem;
        color: #666;
    }

    pre {
        background: #f5f5f5;
        padding: 0.5rem;
        border-radius: 4px;
    }

    .domain-card {
        border: 1px solid #ddd;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
    }

    .status {
        font-size: 0.9rem;
        color: #666;
    }
</style>