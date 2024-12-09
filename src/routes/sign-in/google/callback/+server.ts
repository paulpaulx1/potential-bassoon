// // routes/login/google/callback/+server.ts
// import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/session';
// import { google } from '$lib/server/oauth';
// import { decodeIdToken } from 'arctic';
// import { prisma } from '../../../../lib/server/prisma';
// import type { User } from '@prisma/client';

// import type { RequestEvent } from '@sveltejs/kit';
// import type { OAuth2Tokens } from 'arctic';

// interface GoogleClaims {
// 	sub: string;
// 	email: string;
// 	email_verified: boolean;
// 	name?: string;
// 	picture?: string;
// 	given_name?: string;
// 	family_name?: string;
// }

// export async function GET(event: RequestEvent) : Promise<Response> {
// 	const code = event.url.searchParams.get('code');
// 	const state = event.url.searchParams.get('state');
// 	const storedState = event.cookies.get('google_oauth_state') ?? null;
// 	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
// 	if (code === null || state === null || storedState === null || codeVerifier === null) {
// 		return new Response(null, {
// 			status: 400
// 		});
// 	}
// 	if (state !== storedState) {
// 		return new Response(null, {
// 			status: 400
// 		});
// 	}

// 	let tokens: OAuth2Tokens;
// 	try {
// 		tokens = await google.validateAuthorizationCode(code, codeVerifier);
// 	} catch (e) {
// 		return new Response(null, {
// 			status: 400
// 		});
// 	}

// 	const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
// 	const googleId = claims.sub;
// 	const email = claims.email;
// 	const name = claims.name;

// 	async function getUserFromGoogleId(googleId: string): Promise<User | null> {
// 		return await prisma.user.findUnique({
// 			where: {
// 				googleId
// 			}
// 		});
// 	}

// 	const existingUser = await getUserFromGoogleId(googleId);

// 	if (existingUser !== null) {
// 		const sessionToken = generateSessionToken();
// 		const session = await createSession(sessionToken, existingUser.id);
// 		setSessionTokenCookie(event, sessionToken, session.expires);
// 		return new Response(null, {
// 			status: 302,
// 			headers: {
// 				Location: '/'
// 			}
// 		});
// 	}

// 	async function createUser(googleId: string, email: string) {
// 		return await prisma.user.create({ data: { googleId, email } });
// 	}
// 	const user = await createUser(googleId, email);

// 	const sessionToken = generateSessionToken();
// 	const session = await createSession(sessionToken, user.id);
// 	setSessionTokenCookie(event, sessionToken, session.expires);
// 	return new Response(null, {
// 		status: 302,
// 		headers: {
// 			Location: '/'
// 		}
// 	});
// }
