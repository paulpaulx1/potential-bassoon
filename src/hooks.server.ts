// src/hooks.server.ts
import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie
} from "$lib/server/session";
import { prisma } from "$lib/server/prisma";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // First check if this is a custom domain request
    const hostname = event.request.headers.get('host');
    console.log('Incoming request from:', hostname); // Debug log

    // If it's not the main app domain, check for custom domain routing
    if (hostname && !hostname.includes('railway.app') && !hostname.includes('localhost')) {
        const domain = await prisma.domain.findUnique({
            where: { domain: hostname },
            include: { user: true }
        });

        if (domain) {
            // For now, just return a test message
            return new Response(`Test: This domain belongs to ${domain.user.email}`);
        }
    }

    // If not a custom domain request, handle norl auth flow
    const token = event.cookies.get("session") ?? null;
    
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
}