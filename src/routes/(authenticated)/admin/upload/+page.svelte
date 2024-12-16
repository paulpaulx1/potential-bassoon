<script lang="ts">
    import { createUploader } from "$lib/utils/uploadthing";
    import { UploadButton } from "@uploadthing/svelte";
  
    const uploader = createUploader("imageUploader", {
      onClientUploadComplete: (res) => {
        console.log('Upload complete', res);
        // Handle successful upload
      },
      onUploadError: (error) => {
        console.error('Upload error', error);
        // Handle upload error
      },
    });
  </script>
  
  <div class="container mx-auto p-4">
    <h1 class="text-2xl mb-4">Upload Image</h1>
    <UploadButton {uploader} />
  </div>