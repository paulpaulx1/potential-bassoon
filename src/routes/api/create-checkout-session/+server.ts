// src/routes/api/create-checkout-session/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const BASE_URL =
			process.env.NODE_ENV === 'production' ? 'https://easels.io' : 'http://localhost:5173';

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price: 'price_1QeMEFHLAzF5yr084W9rkyJR',
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${BASE_URL}/payment/cancelled`,
			client_reference_id: userId,
			metadata: {
				userId: userId
			}
		});

		return json({ url: session.url });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
};
