// routes/auth/register/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { setSessionTokenCookie } from "$lib/server/session";
import { registerUser } from "$lib/server/auth";

export const actions = {
    default: async (event: RequestEvent) => {
        const formData = await event.request.formData();
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return fail(400, { message: "Invalid input" });
        }

        try {
            // First do the registration
            const { user, token, expiresAt } = await registerUser(email, password);
            setSessionTokenCookie(event, token, expiresAt);
        } catch (error) {
            // Only catch actual errors, not redirects
            if (error instanceof Error && error.message === 'Email already taken') {
                return fail(400, { 
                    message: error.message,
                    email
                });
            }
            console.error("Registration error:", error);
            return fail(500, { message: "An unexpected error occurred" });
        }

        // Do the redirect outside of try/catch
        throw redirect(303, '/portfolios');
    }
};