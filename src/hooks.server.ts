// src/hooks.server.ts
import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie
} from '$lib/server/session';
import { prisma } from '$lib/server/prisma';
import type { Handle } from '@sveltejs/kit';

// Cache for domain lookups
const domainCache = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

async function getDomain(hostname: string) {
    const cleanHostname = hostname.split(':')[0];
    const cacheKey = cleanHostname.replace('www.', '');
    
    // Check cache
    const cached = domainCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return cached.domain;
    }

    // If not in cache or expired, fetch from DB
    const domain = await prisma.domain.findFirst({
        where: {
            OR: [
                { domain: cleanHostname },
                { domain: cleanHostname.replace('www.', '') }
            ]
        },
        include: { user: true }
    });

    // Update cache
    if (domain) {
        domainCache.set(cacheKey, {
            domain,
            timestamp: Date.now()
        });
    }

    return domain;
}

// Skip domain check for these paths
const SKIP_DOMAIN_CHECK = [
    '/_app',
    '/favicon.ico',
    '/api',
    '/assets',
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg'
];

export const handle: Handle = async ({ event, resolve }) => {
    const hostname = event.request.headers.get('host');
    const pathname = event.url.pathname;

    // Check if this is a potential custom domain request
    const shouldCheckDomain = 
        hostname && 
        !hostname.includes('railway.app') && 
        !SKIP_DOMAIN_CHECK.some(path => pathname.includes(path));

    if (shouldCheckDomain) {
        const domain = await getDomain(hostname);
        if (domain) {
            // For now, return test page. Later this will render the actual portfolio
            return new Response(
                `<!DOCTYPE html>
                <html>
                    <body>
                        <h1>🎨 Welcome to ${domain.user.email}'s Portfolio!</h1>
                        <p>Custom domain: ${domain.domain}</p>
                        <div style="margin-top: 20px; padding: 20px; background: #f0f0f0;">
                            <h2>✨ Soon this will be a beautiful portfolio</h2>
                            <p>Time to build some fun editor/preview UI stuff!</p>
                        </div>
                    </body>
                </html>`,
                {
                    headers: { 'Content-Type': 'text/html' }
                }
            );
        }
    }

    // Handle authentication
    const token = event.cookies.get('session');
    if (!token) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await validateSessionToken(token);

    if (session) {
        setSessionTokenCookie(event, token, session.expires);
    } else {
        deleteSessionTokenCookie(event);
    }

    event.locals.session = session;
    event.locals.user = user;

    if (pathname.startsWith('/edit') || pathname.startsWith('/upload')) {
        if (!user?.isSubscribed) {
            return new Response('Subscription required', { status: 403 });
        }
    }

    return resolve(event);
};