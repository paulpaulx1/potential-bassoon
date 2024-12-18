<!-- src/lib/components/PortfolioMap.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import type { Portfolio } from '@prisma/client';

    export let data: { 
        portfolios: Pick<Portfolio, 'slug' | 'title'>[] 
    };

    let deleteModalOpen = false;
    let portfolioToDelete: Pick<Portfolio, 'slug' | 'title'> | null = null;
    let isCreating = false;
    let creationError: string | null = null;

    function deletePortfolio(slug: string, title: string) {
        portfolioToDelete = { slug, title };
        deleteModalOpen = true;
    }

    async function confirmDeletePortfolio() {
        if (!portfolioToDelete) return;

        try {
            const res = await fetch(`/admin/portfolios/${portfolioToDelete.slug}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Refresh the portfolio list
                data.portfolios = data.portfolios.filter((p) => p.slug !== portfolioToDelete?.slug);
                deleteModalOpen = false;
            } else {
                const errorData = await res.json();
                console.error('Error deleting portfolio:', errorData);
            }
        } catch (err) {
            console.error('Error deleting portfolio:', err);
        } finally {
            portfolioToDelete = null;
            deleteModalOpen = false;
        }
    }
</script>

<div class="portfolio-creation-form">
    <h2>Your Portfolios</h2>
    <form 
        method="POST" 
        use:enhance={() => {
            isCreating = true;
            creationError = null;

            return async ({ result, update }) => {
                isCreating = false;
                
                if (result.type === 'success') {
                    // Optionally add the new portfolio to the list without a full page reload
                    await update();
                } else if (result.type === 'failure') {
                    creationError = result.data?.message ?? 'Failed to create portfolio';
                }
            };
        }}
    >
        <input
            type="text"
            name="title"
            placeholder="Portfolio Title"
            required
            disabled={isCreating}
        />
        <button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Portfolio'}
        </button>
        
        {#if creationError}
            <p class="error-message">{creationError}</p>
        {/if}
    </form>
</div>

{#if data.portfolios.length === 0}
    <p class="empty-state">No portfolios yet. Create your first portfolio!</p>
{:else}
    <div class="portfolio-list">
        {#each data.portfolios as portfolio}
            <div class="portfolio-item">
                <a href={`/admin/portfolios/${portfolio.slug}`}>{portfolio.title}</a>
                <button 
                    class="delete-btn" 
                    on:click={() => deletePortfolio(portfolio.slug, portfolio.title)}
                >
                    Delete
                </button>
            </div>
        {/each}
    </div>
{/if}

{#if deleteModalOpen}
    <div class="modal">
        <div class="modal-content">
            <h2>Delete Portfolio</h2>
            <p>Are you sure you want to delete the portfolio "{portfolioToDelete?.title}" and all of its contents?</p>
            <div class="modal-actions">
                <button 
                    class="confirm-btn" 
                    on:click={confirmDeletePortfolio}
                >
                    Confirm
                </button>
                <button 
                    class="cancel-btn" 
                    on:click={() => { 
                        deleteModalOpen = false; 
                        portfolioToDelete = null; 
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Previous styles remain the same */
    .error-message {
        color: #e53e3e;
        margin-top: 0.5rem;
    }

    /* Disable state for buttons */
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    input:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
</style>