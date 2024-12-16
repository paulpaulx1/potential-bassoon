import { redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie } from '$lib/server/session';
import type { Actions } from '../../../$types';

export const actions = {
    default: async (event) => {
        deleteSessionTokenCookie(event);
        return {
            status: 303,
            headers: {
                Location: '/sign-in'
            }
        };
    }
} satisfies Actions;
