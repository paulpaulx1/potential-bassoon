// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Window {}
	namespace App {
		interface Error {
			code?: string;
			status?: number;
			message?: string;
		}

		interface Locals {
			user: User | null;
			session: Session | null;
		}

		interface PageData {
			user?: {
				id: number;
				email: string;
				name?: string;
				clerkId: string;
			};
			portfolio?: {
				id: number;
				title: string;
				slug: string;
				description?: string;
				userId: number;
				pieces?: Piece[];
			};
			pieces?: {
				id: number;
				title: string;
				slug: string;
				fullImageUrl: string;
				blurImageUrl: string;
				description?: string;
				portfolioId: number;
				createdAt: string;
			}[];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
