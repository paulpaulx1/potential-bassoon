import { redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie } from '$lib/server/session';
import type { Actions } from '../../../$types';

export const actions: Actions = {
    default: async (event) => {
        deleteSessionTokenCookie(event);
        return {
            status: 303,
            headers: {
                Location: '/sign-in'
            }
        };
    }
} 
