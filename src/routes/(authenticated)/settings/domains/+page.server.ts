// routes/(authenticated)/settings/domains/+page.server.ts
import { prisma } from '$lib/server/prisma';
import type { Domain } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';

import dns from 'dns/promises';

async function verifyCNAME(domain: string): Promise<boolean> {
	try {
		const records = await dns.resolveCname(domain);
		return records.some((record) => record === 'your-app.railway.app');
	} catch (error) {
		console.error('CNAME verification failed:', error);
		return false;
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const domains = await prisma.domain.findMany({
		where: { userId: locals.user.id }
	});
	return { domains };
};

export const actions: Actions = {
	addDomain: async ({ request, locals }) => {
		try {
			const domain = await validateDomainInput(request);
			const isVerified = await verifyCNAME(domain);

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

async function validateDomainInput(request: Request): Promise<string> {
	const formData = await request.formData();
	const domain = formData.get('domain')?.toString().toLowerCase();

	if (!domain?.match(/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]\.[a-z]{2,}$/)) {
		throw new Error('Invalid domain format');
	}

	return domain;
}
