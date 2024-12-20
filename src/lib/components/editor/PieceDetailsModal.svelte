<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let {
		currentFile = null,
		isOpen = false,
		isSubmitting = false,
		submissionError = null,
		onSuccess,
		onCancel
	} = $props();

	let pieceDetails = $state({
		title: '',
		medium: '',
		dimensions: '',
		year: ''
	});

	const handleSubmit: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ result }) => {
			isSubmitting = false;
			if (result.type === 'error') {
				submissionError = result.error?.message;
			} else if (result.type === 'success') {
				onSuccess();
			}
		};
	};

	const handleCancel: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				onCancel();
			}
		};
	};
</script>

{#if isOpen && currentFile}
	<div class="modal-overlay">
		<div class="modal-container">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title">Add Piece Details</h2>
					<button type="button" class="modal-close" aria-label="Close modal" onclick={onCancel}>
						&times;
					</button>
				</div>

				<div class="modal-body">
					<div class="modal-image-container">
						<img src={currentFile.url} alt="Uploaded piece" class="modal-image" />
					</div>

					<form
						class="piece-details-form"
						action="?/createPiece"
						method="POST"
						use:enhance={handleSubmit}
					>
						<input type="hidden" name="fullImageUrl" value={currentFile.url} />
						<input type="hidden" name="blurImageUrl" value={currentFile.blurUrl || ''} />
						<input type="hidden" name="fileKey" value={currentFile.key} />

						<div class="form-group">
							<label for="title" class="form-label">
								Piece Title <span class="required-marker">*</span>
							</label>
							<input
								type="text"
								id="title"
								name="title"
								placeholder="Enter piece title"
								bind:value={pieceDetails.title}
								required
								class="form-input"
								disabled={isSubmitting}
							/>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="medium" class="form-label">Medium</label>
								<input
									type="text"
									id="medium"
									name="medium"
									placeholder="e.g., Oil on Canvas"
									bind:value={pieceDetails.medium}
									class="form-input"
									disabled={isSubmitting}
								/>
							</div>

							<div class="form-group">
								<label for="year" class="form-label">Year</label>
								<input
									type="number"
									id="year"
									name="year"
									placeholder="Creation year"
									bind:value={pieceDetails.year}
									class="form-input"
									disabled={isSubmitting}
								/>
							</div>
						</div>

						<div class="form-group">
							<label for="dimensions" class="form-label">Dimensions</label>
							<input
								type="text"
								id="dimensions"
								name="dimensions"
								placeholder="e.g., 24 x 36 inches"
								bind:value={pieceDetails.dimensions}
								class="form-input"
								disabled={isSubmitting}
							/>
						</div>

						{#if submissionError}
							<p class="error-message">{submissionError}</p>
						{/if}
					</form>
				</div>

				<div class="modal-footer">
					<div class="modal-actions">
						<form
							action="?/cancelUpload"
							method="POST"
							class="cancel-form"
							use:enhance={handleCancel}
						>
							<input type="hidden" name="fileKey" value={currentFile.key} />
							<button type="submit" class="btn btn-secondary" disabled={isSubmitting}>
								Cancel Upload
							</button>
						</form>

						<form action="?/createPiece" method="POST" use:enhance={handleSubmit}>
							<input type="hidden" name="fullImageUrl" value={currentFile.url} />
							<input type="hidden" name="blurImageUrl" value={currentFile.blurUrl || ''} />
							<input type="hidden" name="fileKey" value={currentFile.key} />
							<input type="hidden" name="title" value={pieceDetails.title} />
							<input type="hidden" name="medium" value={pieceDetails.medium || ''} />
							<input type="hidden" name="dimensions" value={pieceDetails.dimensions || ''} />
							<input type="hidden" name="year" value={pieceDetails.year || ''} />
							<button
								type="submit"
								class="btn btn-primary"
								disabled={!pieceDetails.title || isSubmitting}
							>
								{isSubmitting ? 'Saving...' : 'Save Piece'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-container {
		background-color: white;
		border-radius: 0.75rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.modal-close {
		background: none;
		border: none;
		font-size: 2rem;
		line-height: 1;
		color: #6b7280;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.modal-close:hover {
		color: #374151;
	}

	.modal-body {
		padding: 1rem;
		overflow-y: auto;
	}

	.modal-image-container {
		width: 100%;
		max-height: 300px;
		overflow: hidden;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.modal-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-footer {
		padding: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.modal-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.form-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		transition: border-color 0.2s;
	}

	.form-input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.form-input:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
	}

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.form-row .form-group {
		flex: 1;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		transition:
			background-color 0.2s,
			opacity 0.2s;
	}

	.btn-secondary {
		background-color: #f3f4f6;
		color: #374151;
		border: 1px solid #d1d5db;
	}

	.btn-primary {
		background-color: #3b82f6;
		color: white;
		border: none;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.required-marker {
		color: #ef4444;
	}

	.error-message {
		color: #ef4444;
		margin-top: 0.5rem;
	}
</style>
