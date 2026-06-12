/**
 * RSS feed — scoped to Bench Notes so build-log posts flow into
 * readers as they're published. Bench-notes entries are docs pages
 * whose id starts with 'bench-notes' (the index stub is excluded;
 * future posts land as bench-notes/<slug>).
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const docs = await getCollection('docs');
  const posts = docs.filter(
    (d) => d.id.startsWith('bench-notes/') && d.id !== 'bench-notes'
  );
  return rss({
    title: 'Makerphones — Bench Notes',
    description:
      'The Old Faithful build log — prototypes, measurements, and decisions, published as they happen.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      link: `/${p.id}/`,
    })),
  });
}
