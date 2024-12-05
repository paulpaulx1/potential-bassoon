// routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    throw redirect(303, '/sign-in');
};


// import { prisma } from '$lib/server/prisma'
// import type { PageServerLoad } from './$types';
// import type { Piece } from '@prisma/client';


// export const load = (async () => {
//     const pieces = await prisma.piece.findMany({
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
  
//     return {
//       pieces: pieces as Piece[]
//     };
//   }) satisfies PageServerLoad;