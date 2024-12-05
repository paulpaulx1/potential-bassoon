// src/routes/(authenticated)/+layout.svelte
<script lang="ts">
    import type { LayoutData } from './$types';
    
    let { data } = $props();
</script>

<div class="authenticated-layout">
    <nav>
        <a href="/admin">Dashboard</a>
        <a href="/admin/portfolios">Portfolios</a>
        <button onclick={() => { /* handle sign out */ }}>Sign Out</button>
    </nav>
    
    <main>
    </main>
</div>

<style>
    .authenticated-layout {
        min-height: 100vh;
    }
</style>

