// src/routes/portfolios/[portfolioSlug]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { UTApi } from 'uploadthing/server';
import { redirect } from '@sveltejs/kit';

const utapi = new UTApi();

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;
	const portfolioSlug = event.params.portfolioSlug;

	if (!user) throw redirect(303, '/sign-in');

	const portfolio = await prisma.portfolio.findUnique({
		where: {
			slug: portfolioSlug,
			userId: user.id
		},
		include: {
			pieces: {
				orderBy: { createdAt: 'desc' }
			}
		}
	});

	if (!portfolio) throw error(404, 'Portfolio not found');

	return { portfolio };
};

export const actions: Actions = {
	createPiece: async (event) => {
		const { user } = event.locals;
		const portfolioSlug = event.params.portfolioSlug;

		if (!user) throw error(401, 'Unauthorized');

		const portfolio = await prisma.portfolio.findUnique({
			where: {
				slug: portfolioSlug,
				userId: user.id
			}
		});

		if (!portfolio) throw error(404, 'Portfolio not found');

		try {
			const formData = await event.request.formData();

			const title = formData.get('title') as string;
			const fullImageUrl = formData.get('fullImageUrl') as string;
			const blurImageUrl = formData.get('blurImageUrl') as string;
			const fileKey = formData.get('fileKey') as string;
			const medium = formData.get('medium') as string;
			const dimensions = formData.get('dimensions') as string;
			const year = formData.get('year') ? Number(formData.get('year')) : undefined;

			// Generate slug
			const slug = title.toLowerCase().replace(/\s+/g, '-');

			const piece = await prisma.piece.create({
				data: {
					title,
					slug,
					fullImageUrl,
					blurImageUrl: blurImageUrl || '',
					portfolioId: portfolio.id,
					medium: medium || undefined,
					dimensions: dimensions || undefined,
					year: year,
					uploadThingKey: fileKey
				}
			});

			return {
				piece
			};
		} catch (err) {
			console.error('Error creating piece:', err);
			return error(500, 'Failed to create piece');
		}
	},

	cancelUpload: async (event) => {
		console.log('PAGE.SERVER.TS CANCEL UPLOAD ACTION CALLED');

		const { user } = event.locals;

		if (!user) return error(401, 'Unauthorized');

		try {
			const formData = await event.request.formData();
			const fileKey = formData.get('fileKey') as string;
			console.log('Received fileKey:', fileKey); // Add this log

			if (fileKey) {
				// Delete the file from UploadThing
				await utapi.deleteFiles(fileKey);
			}

			return {
				status: 200,
				body: { message: 'Upload cancelled' }
			};
		} catch (err) {
			console.error('Error cancelling upload:', err);
			return error(500, 'Failed to cancel upload');
		}
	}
};
