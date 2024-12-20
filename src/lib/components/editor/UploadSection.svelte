<script lang="ts">
	import { createUploader } from '$lib/utils/uploadthing';
	import { UploadButton } from '@uploadthing/svelte';

	type FileUploadedEvent = { url: string; key: string };
	let onFileUploaded = $props<{
		onFileUploaded: (event: FileUploadedEvent) => void;
	}>();

	let isUploading = $state(false);

	const uploader = createUploader('imageUploader', {
		onUploadBegin: () => {
			isUploading = true;
		},
		onClientUploadComplete: async (res) => {
			isUploading = false;
			if (res.length > 0) {
				onFileUploaded.onFileUploaded({
					url: res[0].url,
					key: res[0].key
				});
			}
		},
		onUploadError: (error) => {
			isUploading = false;
			console.error('Upload error', error);
		}
	});
</script>

<div class="upload-section">
	<h2 class="section-title">Upload New Piece</h2>
	<div class="upload-button-container relative">
		<UploadButton {uploader} />
		{#if isUploading}
			<div class="loader absolute inset-0 flex items-center justify-center bg-white/80">
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
			</div>
		{/if}
	</div>
</div>

<style>
	.loader {
		display: flex;
		gap: 8px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #4f46e5;
		animation: bounce 0.5s ease-in-out infinite;
	}

	.dot:nth-child(2) {
		animation-delay: 0.1s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.2s;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.upload-button-container {
		position: relative;
	}
</style>
