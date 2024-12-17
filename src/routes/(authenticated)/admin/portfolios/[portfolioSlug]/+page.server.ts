// src/routes/portfolios/[portfolioSlug]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createUploadthing } from "uploadthing/server";

export const load: PageServerLoad = async (event) => {
    const { user } = event.locals;
    const portfolioSlug = event.params.portfolioSlug;

    console.log('Attempting to find portfolio with slug:', portfolioSlug);

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
    upload: async (event) => {
        const { user } = event.locals;
        const portfolioSlug = event.params.portfolioSlug;

        if (!user) return error(401, 'Unauthorized');

        const portfolio = await prisma.portfolio.findUnique({
            where: { 
                slug: portfolioSlug,
                userId: user.id 
            }
        });

        if (!portfolio) return error(404, 'Portfolio not found');

        const formData = await event.request.formData();
        const file = formData.get('file') as File;

        // Implement your file upload logic here
        // This is a placeholder - you'll want to integrate with UploadThing
        
        return {
            status: 200,
            message: 'Upload successful'
        };
    }
};