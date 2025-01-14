// src/routes/api/webhook/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return json({ error: 'No signature' }, { status: 400 });
	}

	try {
		const body = await request.text();
		const event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET ? process.env.STRIPE_WEBHOOK_SECRET : ''
		);

		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object;
				const userId = session.client_reference_id;

				if (userId) {
					// Get subscription details to get the current period end
					const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

					// Update user subscription status
					await prisma.user.update({
						where: { id: userId },
						data: {
							isSubscribed: true,
							stripeCustomerId: session.customer as string
						}
					});

					// Create subscription record
					await prisma.subscription.create({
						data: {
							userId,
							stripeSubscriptionId: session.subscription as string,
							status: 'active',
							currentPeriodEnd: new Date(subscription.current_period_end * 1000)
						}
					});
				}
				break;
			}
			case 'customer.subscription.deleted': {
				const subscription = event.data.object;

				// Remove subscription status
				await prisma.user.update({
					where: { stripeCustomerId: subscription.customer as string },
					data: {
						isSubscribed: false
					}
				});

				// Update subscription record
				await prisma.subscription.update({
					where: { stripeSubscriptionId: subscription.id },
					data: {
						status: 'cancelled',
						cancelledAt: new Date()
					}
				});
				break;
			}
		}

		return json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return json({ error: 'Webhook error' }, { status: 400 });
	}
};
