// routes/(authenticated)/settings/domains/+page.server.ts
import { prisma } from '$lib/server/prisma';
import type { Domain } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';

import dns from 'dns/promises';

export const load: PageServerLoad = async ({ locals }) => {
    const domains = await prisma.domain.findMany({
        where: { userId: locals.user.id }
    });
    return { domains };
};

export const actions: Actions = {
	addDomain: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const domain = formData.get('domain')?.toString().toLowerCase();

			if (!domain) {
				return { error: 'Domain is required' };
			}

			const isVerified = await verifyDomain(domain);

			const newDomain = await prisma.domain.create({
				data: {
					domain,
					userId: locals.user.id,
					verified: isVerified
				}
			});
			return { success: true, domain: newDomain };
		} catch (error) {
			return { error: error instanceof Error ? error.message : 'Failed to add domain' };
		}
	}
};

async function verifyDomain(domain: string): Promise<boolean> {
	try {
		// Basic domain format validation first
		if (!domain.match(/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9](\.[a-z]{2,}|\.vercel\.app)$/)) {
			throw new Error('Invalid domain format');
		}

		if (domain.endsWith('.vercel.app')) {
			const response = await fetch(`https://${domain}`);
			return response.ok;
		} else {
			const records = await dns.resolveCname(domain);
			return records.some((record) => record === 'your-app.railway.app');
		}
	} catch (error) {
		console.error('Domain verification failed:', error);
		return false;
	}
}
