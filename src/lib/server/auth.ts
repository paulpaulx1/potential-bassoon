// lib/auth.ts
import { prisma } from './prisma';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { Argon2id } from "oslo/password";
import type { User, Session } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';


// User registration 
export async function registerUser(email: string, password: string): Promise<{ 
    user: User; 
    token: string;
    expiresAt: Date;
}> {
    const existing = await prisma.user.findUnique({ 
        where: { email: email.toLowerCase() } 
    });
    
    if (existing) {
        throw new Error('Email already taken');
    }

    const argon2id = new Argon2id();
    const hash = await argon2id.hash(password);

    // Create user and password in a transaction
    const result = await prisma.$transaction(async (tx) => {
        // First create the user (Prisma will generate the ID)
        const user = await tx.user.create({
            data: {
                email: email.toLowerCase()
            }
        });

        await tx.password.create({
            data: {
                hash,
                userId: user.id
            }
        });

        return user;
    });

    // Create session
    const token = generateSessionToken();
    const session = await createSession(token, result.id);

    return { 
        user: result,
        token,
        expiresAt: session.expires
    };
}

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: string): Promise<Session> {
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

