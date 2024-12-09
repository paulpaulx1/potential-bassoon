import { fail, redirect } from "@sveltejs/kit";
import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie,
    generateSessionToken,
    createSession
} from "$lib/server/session";
import { prisma } from "$lib/server/prisma";
import { Argon2id } from "oslo/password";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get("email");
        const password = formData.get("password");

        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            return fail(400, { message: "Invalid input" });
        }

        try {
            // Find user and their password record in one query
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
                include: {
                    password: true
                }
            });

            // If no user or no password record exists
            if (!user?.password) {
                return fail(400, { message: "Invalid email or password" });
            }

            // Verify the password
            const validPassword = await new Argon2id().verify(
                user.password.hash,
                password
            );

            if (!validPassword) {
                return fail(400, { message: "Invalid email or password" });
            }

            // Create session
            const token = generateSessionToken();
            const session = await createSession(token, user.id);
            
            // Set session cookie
            setSessionTokenCookie(event, token, session.expires);

            return {
                status: 303,
                headers: { Location: '/portfolios' }
            };

        } catch (error) {
            console.error("Sign in error:", error);
            return fail(500, { message: "An unexpected error occurred" });
        }
    }
};

import { generateState, generateCodeVerifier } from "arctic";
// import { google } from "$lib/server/oauth";

import type { RequestEvent } from "@sveltejs/kit";

// export async function GET(event: RequestEvent): Promise<Response> {
// 	const state = generateState();
// 	const codeVerifier = generateCodeVerifier();
// 	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

// 	event.cookies.set("google_oauth_state", state, {
// 		path: "/",
// 		httpOnly: true,
// 		maxAge: 60 * 10, // 10 minutes
// 		sameSite: "lax"
// 	});
// 	event.cookies.set("google_code_verifier", codeVerifier, {
// 		path: "/",
// 		httpOnly: true,
// 		maxAge: 60 * 10, // 10 minutes
// 		sameSite: "lax"
// 	});

// 	return new Response(null, {
// 		status: 302,
// 		headers: {
// 			Location: url.toString()
// 		}
// 	});
// }

