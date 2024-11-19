import type { Painting } from '$lib/types';
import { paintings } from '$lib/data/paintings';
import type { PageLoad } from './$types';

export interface PageData {
    painting: Painting;
    paintings: Painting[];
  }

export const load = (({ params }) => {
  const painting = paintings.find(p => p.slug === params.slug);
  
  if (!painting) {
    throw new Error(`Painting ${params.slug} not found`);
  }

  return {
    painting,
    paintings
  };
}) satisfies PageLoad<PageData>;