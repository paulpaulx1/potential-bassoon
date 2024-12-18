import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load: LayoutServerLoad = async (event) => {
    const { user } = event.locals;

    if (!user) {
        throw redirect(303, '/login');
    }

    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (!userData) {
            throw redirect(303, '/login');
        }

        return {
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                createdAt: userData.createdAt.toISOString()
            }
        };
    } catch (err) {
        console.error('Error fetching user data:', err);
        throw redirect(303, '/login');
    }
};