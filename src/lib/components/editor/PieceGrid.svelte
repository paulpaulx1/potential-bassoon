<script lang="ts">
type Piece = {
    id: string;
    title: string;
    fullImageUrl: string;
    medium?: string | null;
    uploadThingKey: string;
};

let { pieces, onDelete } = $props<{
    pieces: Piece[];
    onDelete: (pieceId: string, uploadThingKey: string) => Promise<void>;
}>();

</script>

<div class="existing-pieces-section">
    <h2 class="section-title">Existing Pieces</h2>
    <div class="pieces-grid">
        {#each pieces as piece}
            <div class="piece-card">
                <div class="piece-image-container">
                    <img src={piece.fullImageUrl} alt={piece.title} class="piece-image" />
                    <button
                        class="delete-piece-btn"
                        onclick={() => onDelete(piece.id, piece.uploadThingKey)}
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

<style>
    .piece-image-container {
        position: relative;
        max-width: 400px;
    }

    .piece-image-container img {
        max-width: 400px;
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
</style>