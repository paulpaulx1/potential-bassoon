// routes/portfolios/[portfolioSlug]/pieces/[pieceId]/+server.ts
import { error, type RequestEvent } from '@sveltejs/kit';
import { UTApi } from 'uploadthing/server'; 
import { prisma } from '$lib/server/prisma';

const utapi = new UTApi(); 

export async function DELETE({ params, locals }: RequestEvent) {
    const { user } = locals;
    const { portfolioSlug, pieceId } = params;

    if (!user) throw error(401, 'Unauthorized');

    // First verify the piece belongs to the user's portfolio
    const piece = await prisma.piece.findFirst({
        where: {
            id: pieceId,
            portfolio: {
                slug: portfolioSlug,
                userId: user.id
            }
        }
    });

    if (!piece) throw error(404, 'Piece not found');

    try {
        // Delete from UploadThing first
        if (piece.uploadThingKey) {
            await utapi.deleteFiles([piece.uploadThingKey]);
        }

        // Then delete from database
        await prisma.piece.delete({
            where: { id: pieceId }
        });

        return new Response(null, { status: 204 });
    } catch (err) {
        console.error('Error deleting piece:', err);
        throw error(500, 'Failed to delete piece');
    }
}