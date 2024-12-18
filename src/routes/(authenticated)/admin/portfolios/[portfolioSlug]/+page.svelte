<script lang="ts">
    import { createUploader } from "$lib/utils/uploadthing";
    import { UploadButton } from "@uploadthing/svelte";
    import { enhance } from '$app/forms';

    let { data } = $props();

    // State for tracking uploaded files
    let uploadedFiles: Array<{
        url: string;
        key: string; 
        blurUrl?: string;
    }> = $state([]);

    // Modal state
    let isModalOpen = $state(false);
    let currentFile = $state<{
        url: string;
        key: string;
        blurUrl?: string;
    } | null>(null);

    // Piece details state
    let pieceDetails = $state({
        title: '',
        medium: '',
        dimensions: '',
        year: ''
    });

    // Loading and error states
    let isSubmitting = $state(false);
    let submissionError = $state<string | null>(null);

    const uploader = createUploader("imageUploader", {
        onClientUploadComplete: async (res) => {
            console.log('Upload complete', res);
            
            // Update uploaded files state
            uploadedFiles = res.map((file: any) => ({
                url: file.url,
                key: file.key, 
                blurUrl: '' 
            }));

            // Open modal for the first uploaded file
            if (res.length > 0) {
                currentFile = uploadedFiles[0];
                isModalOpen = true;
            }
        },
        onUploadError: (error) => {
            console.error('Upload error', error);
        },
    });

    // Method to submit piece details
    async function submitPieceDetails() {
        if (!currentFile) return;

        isSubmitting = true;
        submissionError = null;

        const formData = new FormData();
        formData.append('title', pieceDetails.title);
        formData.append('fullImageUrl', currentFile.url);
        formData.append('blurImageUrl', currentFile.blurUrl || '');
        formData.append('fileKey', currentFile.key);
        
        if (pieceDetails.medium) formData.append('medium', pieceDetails.medium);
        if (pieceDetails.dimensions) formData.append('dimensions', pieceDetails.dimensions);
        if (pieceDetails.year) formData.append('year', pieceDetails.year);

        try {
            const response = await fetch(`/admin/portfolios/${data.portfolio.slug}?/createPiece`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                data.portfolio.pieces = [result.piece, ...data.portfolio.pieces];

                // Reset state
                pieceDetails = { title: '', medium: '', dimensions: '', year: '' };
                uploadedFiles = uploadedFiles.filter(f => f.url !== currentFile?.url);
                currentFile = null;
                isModalOpen = false;
            } else {
                submissionError = result.message || 'Failed to create piece';
            }
        } catch (error) {
            console.error('Error submitting piece:', error);
            submissionError = 'An unexpected error occurred';
        } finally {
            isSubmitting = false;
        }
    }

    // Method to cancel upload
    async function cancelUpload() {
        if (!currentFile) return;

        const formData = new FormData();
        formData.append('fileKey', currentFile.key);

        try {
            const response = await fetch(`/portfolios/${data.portfolio.slug}?/cancelUpload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Remove from uploaded files
                uploadedFiles = uploadedFiles.filter(f => f.url !== currentFile?.url);
                currentFile = null;
                isModalOpen = false;
            } else {
                const result = await response.json();
                console.error('Failed to cancel upload:', result.message);
            }
        } catch (error) {
            console.error('Error cancelling upload:', error);
        }
    }

    // Method to delete a piece
    async function deletePiece(pieceId: string, uploadThingKey: string) {
        try {
            const response = await fetch(`/portfolios/${data.portfolio.slug}/pieces/${pieceId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove the piece from the list
                data.portfolio.pieces = data.portfolio.pieces.filter(p => p.id !== pieceId);
            } else {
                const result = await response.json();
                console.error('Failed to delete piece:', result.message);
            }
        } catch (error) {
            console.error('Error deleting piece:', error);
        }
    }
</script>

<div class="portfolio-container">
    <h1 class="portfolio-title">{data.portfolio.title}</h1>
    
    <div class="upload-section">
        <h2 class="section-title">Upload New Piece</h2>
        <div class="upload-button-container">
            <UploadButton {uploader} />
        </div>
    </div>

    {#if data.portfolio.pieces.length === 0}
        <p class="empty-state">No pieces in this portfolio yet</p>
    {:else}
        <div class="existing-pieces-section">
            <h2 class="section-title">Existing Pieces</h2>
            <div class="pieces-grid">
                {#each data.portfolio.pieces as piece}
                    <div class="piece-card">
                        <div class="piece-image-container">
                            <img 
                                src={piece.fullImageUrl} 
                                alt={piece.title} 
                                class="piece-image"
                            />
                            <button 
                                class="delete-piece-btn"
                                onclick={() => deletePiece(piece.id, piece.uploadThingKey)}
                            >
                                ✕
                            </button>
                        </div>
                        <div class="piece-details">
                            <h3 class="piece-title">{piece.title}</h3>
                            {#if piece.medium}
                                <p class="piece-medium">{piece.medium}</p>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    {#if isModalOpen && currentFile}
        <div class="modal-overlay">
            <div class="modal-content">
                <h2 class="modal-title">Add Piece Details</h2>
                
                <div class="modal-image-container">
                    <img 
                        src={currentFile.url} 
                        alt="Uploaded piece" 
                        class="modal-image"
                    />
                </div>
                
                <form class="piece-details-form" use:enhance>
                    <div class="form-group">
                        <label for="title" class="form-label">
                            Piece Title <span class="required-marker">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="title"
                            placeholder="Enter piece title" 
                            bind:value={pieceDetails.title} 
                            required 
                            class="form-input"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="medium" class="form-label">
                                Medium
                            </label>
                            <input 
                                type="text" 
                                id="medium"
                                placeholder="e.g., Oil on Canvas" 
                                bind:value={pieceDetails.medium} 
                                class="form-input"
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="year" class="form-label">
                                Year
                            </label>
                            <input 
                                type="number" 
                                id="year"
                                placeholder="Creation year" 
                                bind:value={pieceDetails.year} 
                                class="form-input"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="dimensions" class="form-label">
                            Dimensions
                        </label>
                        <input 
                            type="text" 
                            id="dimensions"
                            placeholder="e.g., 24 x 36 inches" 
                            bind:value={pieceDetails.dimensions} 
                            class="form-input"
                            disabled={isSubmitting}
                        />
                    </div>

                    {#if submissionError}
                        <p class="error-message">{submissionError}</p>
                    {/if}

                    <div class="modal-actions">
                        <button 
                            type="button" 
                            class="btn btn-cancel"
                            onclick={cancelUpload}
                            disabled={isSubmitting}
                        >
                            Cancel Upload
                        </button>
                        <button 
                            type="button" 
                            class="btn btn-save"
                            disabled={!pieceDetails.title || isSubmitting}
                            onclick={submitPieceDetails}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Piece'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Previous styles remain the same */
    .piece-image-container {
        position: relative;
    }

    .delete-piece-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(255, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .delete-piece-btn:hover {
        background-color: rgba(255, 0, 0, 0.9);
    }

    .error-message {
        color: #e53e3e;
        margin-top: 0.5rem;
        text-align: center;
    }

    /* Disabled state styles */
    input:disabled, button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>