import { prisma } from '$lib/server/prisma';
import { error, redirect, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { createUploadthing, UTApi } from 'uploadthing/server';
import { ourFileRouter } from '$lib/server/uploadthing';

const f = createUploadthing();

export async function POST({ params, locals, request }: RequestEvent) {
	console.log('+server.ts POST METHOD HIT');
	const { user } = locals;
	const portfolioSlug = params.portfolioSlug;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const formData = await request.formData();

	// If there's no title, it's likely not a piece creation request
	const title = formData.get('title');
	if (!title) {
		return new Response(null, { status: 200 });
	}

	const portfolio = await prisma.portfolio.findUnique({
		where: {
			slug: portfolioSlug,
			userId: user.id
		}
	});

	if (!portfolio) {
		throw error(404, 'Portfolio not found');
	}

	try {
		const formData = await request.formData();

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

		return json({ piece });
	} catch (err) {
		console.error('Error creating piece:', err);
		throw error(500, 'Failed to create piece');
	}
}

export async function DELETE({ params, locals }: RequestEvent) {
	const { portfolioSlug } = params;
	const { user } = locals;

	if (!user) {
		throw redirect(303, '/sign-in');
	}

	try {
		const portfolio = await prisma.portfolio.findUnique({
			where: {
				slug: portfolioSlug,
				userId: user.id
			},
			include: {
				pieces: true
			}
		});

		if (!portfolio) {
			throw error(404, 'Portfolio not found');
		}

		// Delete all uploaded files associated with the portfolio
		const utapi = new UTApi();
		await Promise.all(
			portfolio.pieces.map(async (piece) => {
				await utapi.deleteFiles(piece.uploadThingKey);
			})
		);

		// Delete the portfolio and all its pieces
		await prisma.portfolio.delete({
			where: {
				id: portfolio.id
			}
		});

		// Redirect to the portfolio list page
		return new Response(null, {
			status: 303,
			headers: {
				Location: '/admin/portfolios'
			}
		});
	} catch (err) {
		console.error('Error deleting portfolio:', err);
		return new Response(JSON.stringify({ error: 'Error deleting portfolio' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
