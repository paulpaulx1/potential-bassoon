import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export async function PATCH({ request }: RequestEvent) {
	const { id, name } = await request.json();

	try {
		const updatedUser = await prisma.user.update({
			where: {
				id
			},
			data: {
				name
			}
		});

		return new Response(JSON.stringify(updatedUser), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		console.error('Error updating user:', err);
		return new Response(JSON.stringify({ error: 'Error updating user' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
