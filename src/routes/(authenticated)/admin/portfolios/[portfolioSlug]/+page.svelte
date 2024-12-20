<script lang="ts">
	import { createUploader } from '$lib/utils/uploadthing';
	import { invalidateAll } from '$app/navigation';
	import UploadSection from '$lib/components/editor/UploadSection.svelte';
	import PieceGrid from '$lib/components/editor/PieceGrid.svelte';
	import PieceDetailsModal from '$lib/components/editor/PieceDetailsModal.svelte';

	let { data } = $props();

	let isModalOpen = $state(false);
	let currentFile = $state<{
		url: string;
		key: string;
		blurUrl?: string;
	} | null>(null);

	let isSubmitting = $state(false);
	let submissionError = $state<string | null>(null);

	async function handlePieceSuccess(pieceDetails: {
		title: string | Blob;
		medium: string | Blob;
		dimensions: string | Blob;
		year: string | Blob;
	}) {
		// Just handle the UI updates after successful submission
		await invalidateAll();
		currentFile = null;
		isModalOpen = false;
	}

	async function handleCancelUpload() {
		if (!currentFile) return;

		try {
			const formData = new FormData();
			console.log('form Data', formData.entries())
			formData.append('fileKey', currentFile.key);
			console.log('form Data with filekey', ...formData)

			const response = await fetch(`?/cancelUpload`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to cancel upload');
			}

			currentFile = null;
			isModalOpen = false;
		} catch (error) {
			console.error('Error cancelling upload:', error);
		}
	}

	async function deletePiece(pieceId: string, uploadThingKey: string) {
		try {
			const response = await fetch(`${window.location.pathname}/pieces/${pieceId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await invalidateAll();
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

	<UploadSection
		onFileUploaded={(event) => {
			currentFile = event;
			isModalOpen = true;
		}}
	/>

	{#if data.portfolio.pieces.length === 0}
		<p class="empty-state">No pieces in this portfolio yet</p>
	{:else}
		<PieceGrid pieces={data.portfolio.pieces} onDelete={deletePiece} />
	{/if}

	<PieceDetailsModal
		{currentFile}
		isOpen={isModalOpen}
		{isSubmitting}
		{submissionError}
		onSuccess={async () => {
			// renamed from onSubmit
			await invalidateAll();
			currentFile = null;
			isModalOpen = false;
		}}
		onCancel={handleCancelUpload}
	/>
</div>
