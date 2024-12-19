// lib/server/uploadthing.ts
import { createUploadthing } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';
import { validateSessionToken } from '$lib/server/session';

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: '8MB',
			maxFileCount: 1
		}
	})
		.middleware(async ({ req }) => {
			// Extract session token from cookies
			console.log('Starting middleware check');

			const cookieHeader = req.headers.get('cookie');

			console.log('cookieHedaer', cookieHeader);

			const token = cookieHeader
				?.split('; ')
				.find((row) => row.startsWith('session='))
				?.split('=')[1];

			if (!token) {
				console.log('TOKEN NOT FIOUND');
				throw new Error('Unauthorized');
			}
			// Validate session token
			console.log('Validating token');
			const { user } = await validateSessionToken(token);

			if (!user) {
				throw new Error('Unauthorized');
				console.log('No user found');
			}
			console.log('Middleware successful, userId:', user.id);
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete for userId:', metadata.userId);
			console.log('file url', file.url);
			console.log('About to return from onUploadComplete');
			return {
				success: true,
				file: {
					url: file.url,
					key: file.key,
					name: file.name
				}
			};
		})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
