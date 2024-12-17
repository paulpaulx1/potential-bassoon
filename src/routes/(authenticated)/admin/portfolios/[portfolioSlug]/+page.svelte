<!-- src/routes/portfolios/[portfolioSlug]/+page.svelte -->
<script lang="ts">
    import { createUploader } from "$lib/utils/uploadthing";
    import { UploadButton } from "@uploadthing/svelte";

    let { data } = $props();

    let uploadedFiles: string[] = $state([]);

    const uploader = createUploader("imageUploader", {
        onClientUploadComplete: (res) => {
            console.log('Upload complete', res);
            uploadedFiles = res.map((file: any) => file.url);
        },
        onUploadError: (error) => {
            console.error('Upload error', error);
        },
    });
</script>

<div>
    <h1>{data.portfolio.title}</h1>
    
    <div>
        <h2>Upload New Piece</h2>
        <UploadButton {uploader} />

        {#if uploadedFiles.length > 0}
            <div>
                <h3>Uploaded Files:</h3>
                {#each uploadedFiles as fileUrl}
                    <img src={fileUrl} alt="Uploaded" />
                {/each}
            </div>
        {/if}
    </div>

    {#if data.portfolio.pieces.length === 0}
        <p>No pieces in this portfolio yet</p>
    {:else}
        <div>
            <h2>Existing Pieces</h2>
            {#each data.portfolio.pieces as piece}
                <div>
                    <img src={piece.fullImageUrl} alt={piece.title} />
                    <h3>{piece.title}</h3>
                </div>
            {/each}
        </div>
    {/if}
</div>