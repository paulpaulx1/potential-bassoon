// src/hooks.server.ts
import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie
} from "$lib/server/session";

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // Try to get the session token from cookies
    const token = event.cookies.get("session") ?? null;
    
    // If no token exists, continue without authentication
    if (token === null) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    // Validate the token and get user information
    const { session, user } = await validateSessionToken(token);
    
    if (session !== null) {
        // If session is valid, refresh the cookie to extend its lifetime
        setSessionTokenCookie(event, token, session.expires);
    } else {
        // If session is invalid, clean up the cookie
        deleteSessionTokenCookie(event);
    }

    // Make user and session available to all routes
    event.locals.session = session;
    event.locals.user = user;
    
    return resolve(event);
}