import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Chapter frontmatter extends Starlight's native schema.
 *
 * Starlight natives used by chapters:
 *   title       — chapter title (no "Chapter N" / "Part N" ever)
 *   description — the chapter's Shopify meta-description
 *
 * Custom fields below carry the Shopify mapping and chapter metadata.
 * `part` and `chapter` are INTERNAL ordering only — never rendered.
 */
const chapterFields = z.object({
  /** Frozen URL slug/handle — identical to the filename and the future Shopify page handle. */
  handle: z.string().optional(),
  /** Page kind: manual chapter (default), reference appendix, or build guide. */
  type: z.enum(['chapter', 'appendix', 'build-guide']).default('chapter'),
  /** Part number 1–6. Internal ordering only; never displayed. */
  part: z.number().int().min(1).max(6).optional(),
  /** Chapter number within the manual. Internal ordering only; never displayed. */
  chapter: z.number().int().min(1).optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  /** Handles of chapters the reader should have read first. */
  prerequisites: z.array(z.string()).default([]),
  /** Handles of related chapters. */
  related: z.array(z.string()).default([]),
  /** Estimated reading time in minutes. */
  read_time: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
  /** The chapter's Shopify excerpt. */
  excerpt: z.string().optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: chapterFields }),
  }),
};
