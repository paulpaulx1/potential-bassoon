// routes/(authenticated)/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { validateSessionToken } from '$lib/server/session';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get('session');
    if (!sessionToken) {
        throw redirect(303, '/auth/signin');
    }

    const { user } = await validateSessionToken(sessionToken);
    if (!user) {
        throw redirect(303, '/auth/signin');
    }

    return {
        user: {
            email: user.email,
            name: user.name || 'Not set',
            id: user.id,
            createdAt: user.createdAt
        }
    };
};