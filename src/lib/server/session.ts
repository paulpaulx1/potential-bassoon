import { prisma } from './prisma';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import type { User, Session } from '@prisma/client';

export function generateSessionToken(): string {
	//generate a secure random token using web crypto API
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: string): Promise<Session> {
	//create a session ID by hashing the token
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = await prisma.session.create({
		data: {
			id: sessionId,
			user_id: userId,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		}
	});
	return session;
}

//find session if DB, if there, check if we're within the timeframe, if we're
//nearing the end, extend the session
export async function validateSessionToken(token: string): Promise<{
	session: Session | null;
	user: User | null;
}> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const result = await prisma.session.findUnique({
		where: { id: sessionId },
		include: { user: true }
	});

	if (!result) {
		return { session: null, user: null };
	}

	const { user, ...session } = result;

	// Check if session has expired
	if (Date.now() >= session.expires.getTime()) {
		await prisma.session.delete({ where: { id: sessionId } });
		return { session: null, user: null };
	}

	// Extend session if it's close to expiring (15 days)
	if (Date.now() >= session.expires.getTime() - 1000 * 60 * 60 * 24 * 15) {
		const updatedSession = await prisma.session.update({
			where: { id: session.id },
			data: {
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
			}
		});
		return { session: updatedSession, user };
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } });
}

import type { RequestEvent } from '@sveltejs/kit';

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	// Set a new session cookie with secure defaults
	event.cookies.set('session', token, {
		httpOnly: true, // Prevents JavaScript access, enhancing security
		sameSite: 'lax', // Provides CSRF protection while maintaining usability
		expires: expiresAt, // Matches our session expiration
		path: '/' // Makes cookie available across the whole site
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	// Clear the session cookie by setting it empty with immediate expiration
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0, // Immediate expiration
		path: '/'
	});
}
