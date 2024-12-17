import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
    const { user } = event.locals;
    if (!user) throw redirect(303, '/login');

    const portfolios = await prisma.portfolio.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });

    return {
        user,
        portfolios
    };
};

export const actions = {
    default: async (event: RequestEvent) => {
        const { user } = event.locals;
        if (!user) return fail(401, { message: 'Unauthorized' });

        const formData = await event.request.formData();
        const title = formData.get('title');

        if (!title || typeof title !== 'string') {
            return fail(400, { message: 'Portfolio title is required' });
        }

        const portfolio = await prisma.portfolio.create({
            data: {
                title,
                slug: title.toLowerCase().replace(/\s+/g, '-'),
                userId: user.id
            }
        });

        throw redirect(303, `admin/portfolios/${portfolio.slug}`);
    }
};