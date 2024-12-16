// src/hooks.server.ts
import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$lib/server/session';
import { prisma } from '$lib/server/prisma';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// First check if this is a custom domain request
	const hostname = event.request.headers.get('host');
	console.log('Incoming request from:', hostname); // Debug log

	// Strip port number for local development
	const cleanHostname = hostname?.split(':')[0];

	// Allow our test domains and handle different environments
	if (
		cleanHostname &&
		!cleanHostname.includes('railway.app')
	) {
		// Try exact domain match first
		const domain = await prisma.domain.findFirst({
			where: {
				OR: [
					{ domain: cleanHostname }, // exact match
					{ domain: cleanHostname.replace('www.', '') } // handle www prefix
				]
			},
			include: { user: true }
		});

		if (domain) {
            console.log('Found domain mapping:', domain);
            
            // Send back a quick test page
            return new Response(`
                <!DOCTYPE html>
                <html>
                    <body>
                        <h1>🎨 Welcome to ${domain.user.email}'s Portfolio!</h1>
                        <p>Custom domain: ${domain.domain}</p>
                        <div style="margin-top: 20px; padding: 20px; background: #f0f0f0;">
                            <h2>✨ Soon this will be a beautiful portfolio</h2>
                            <p>Time to build some fun editor/preview UI stuff!</p>
                        </div>
                    </body>
                </html>
            `, {
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }
	}

	// If not a custom domain request, handle norl auth flow
	const token = event.cookies.get('session') ?? null;

	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);

	if (session !== null) {
		setSessionTokenCookie(event, token, session.expires);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};
