// lib/server/uploadthing.ts
import { createUploadthing } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
import { validateSessionToken } from '$lib/server/session';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Extract session token from cookies
      const cookieHeader = req.headers.get('cookie');
      const token = cookieHeader?.split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];

      if (!token) throw new Error("Unauthorized");

      // Validate session token
      const { user } = await validateSessionToken(token);
      
      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      // Additional logic to save file info to database
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;