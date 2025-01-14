import { prisma } from '$lib/server/prisma';
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions, RequestEvent } from './$types';

function sortPiecesByOrder(pieces: any[], pieceOrder: string[]) {
	return [...pieces].sort((a, b) => {
		const aIndex = pieceOrder.indexOf(a.id);
		const bIndex = pieceOrder.indexOf(b.id);
		return aIndex - bIndex;
	});
}

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
				// Default order for new portfolios or if pieceOrder isn't set
				orderBy: { createdAt: 'desc' }
			}
		}
	});

	if (!portfolio) throw error(404, 'Portfolio not found');

	// If we have a pieceOrder, use it to sort
	if (portfolio.pieceOrder?.length) {
		portfolio.pieces = sortPiecesByOrder(portfolio.pieces, portfolio.pieceOrder);
	}

	return { portfolio };
};

export const actions = {
	reorder: async ({ request, locals, params }) => {
		const { user } = locals;
		if (!user) throw error(401);

		const formData = await request.formData();
		const pieceIds = JSON.parse(formData.get('pieceIds') as string);

		// Get current state
		const portfolioBefore = await prisma.portfolio.findUnique({
			where: {
				slug: params.portfolioSlug,
				userId: user.id
			},
			include: {
				pieces: true
			}
		});

		console.log(
			'Before reorder:',
			portfolioBefore?.pieces.map((p) => ({ id: p.id, title: p.title }))
		);

		// Update the order
		await prisma.portfolio.update({
			where: {
				slug: params.portfolioSlug,
				userId: user.id
			},
			data: {
				pieceOrder: pieceIds
			}
		});

		// Get the after state
		const portfolioAfter = await prisma.portfolio.findUnique({
			where: {
				slug: params.portfolioSlug,
				userId: user.id
			},
			include: {
				pieces: true
			}
		});

		// Sort pieces by the new order
		const sortedPieces = sortPiecesByOrder(portfolioAfter?.pieces || [], pieceIds);

		console.log(
			'After reorder:',
			sortedPieces.map((p) => ({ id: p.id, title: p.title }))
		);

		return { success: true };
	}
} satisfies Actions;
