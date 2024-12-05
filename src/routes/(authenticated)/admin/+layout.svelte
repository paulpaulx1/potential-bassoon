<!-- routes/admin/+layout.svelte -->
<script lang="ts">
    import AdminSignOut from '$lib/components/SignOut.svelte';
    import { page } from '$app/stores';

    const navItems = [
        { href: '/admin', label: 'Dashboard', match: /^\/admin$/ },
        { href: '/admin/portfolios', label: 'Portfolios', match: /^\/admin\/portfolios/ },
        { href: '/admin/upload', label: 'Upload', match: /^\/admin\/upload/ },
        { href: '/admin/preview', label: 'Preview', match: /^\/admin\/preview/ }
        // Add analytics later if you get to it
    ];
</script>

<div class="admin-layout">
    <nav class="admin-nav">
        <div class="nav-header">
            <h1>Admin</h1>
        </div>
        
        <div class="nav-items">
            {#each navItems as item}
                <a 
                    href={item.href}
                    class="nav-item"
                    class:active={item.match.test($page.url.pathname)}
                >
                    {item.label}
                </a>
            {/each}
        </div>
    </nav>

    <main class="admin-content">
        <slot />
    </main>

    <AdminSignOut />
</div>

<style>
    .admin-layout {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 240px 1fr;
        background: var(--color-background);
    }

    .admin-nav {
        background: white;
        border-right: 1px solid var(--color-border);
        height: 100vh;
        position: fixed;
        width: 240px;
    }

    .nav-header {
        padding: 24px;
        border-bottom: 1px solid var(--color-border);
    }

    .nav-header h1 {
        font-size: 20px;
        font-weight: 600;
    }

    .nav-items {
        padding: 16px 0;
    }

    .nav-item {
        display: block;
        padding: 12px 24px;
        color: var(--color-text);
        text-decoration: none;
        font-size: 15px;
        transition: background-color 0.2s;
    }

    .nav-item:hover {
        background: #f5f5f7;
    }

    .nav-item.active {
        background: #f5f5f7;
        color: var(--color-primary);
        font-weight: 500;
    }

    .admin-content {
        padding: 24px;
        grid-column: 2;
        max-width: 1200px;
    }

    @media (max-width: 768px) {
        .admin-layout {
            grid-template-columns: 1fr;
        }

        .admin-nav {
            position: static;
            width: 100%;
            height: auto;
        }

        .admin-content {
            grid-column: 1;
        }
    }
</style>