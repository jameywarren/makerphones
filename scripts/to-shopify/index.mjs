#!/usr/bin/env node
/**
 * to-shopify — Shopify export bridge (STUB).
 *
 * TODO: finish at store-launch. Intentionally not implemented now —
 * resource mode; no commerce is built until the store is reactivated.
 *
 * What this will do when finished:
 *  1. Walk src/content/docs/learn/*.md (skip index.mdx).
 *  2. Parse YAML frontmatter (handle, title, description, excerpt, tags,
 *     difficulty, prerequisites, related, read_time).
 *  3. Render each Markdown body to Shopify-ready HTML:
 *     - rewrite /learn/<handle> links to /pages/<handle>
 *     - convert Starlight asides (:::caution / :::tip) to styled divs
 *     - render the chapter metadata row (difficulty/prereqs/related)
 *       as inline HTML, since Shopify has no component layer
 *  4. Emit shopify-export.json: an array of
 *     { handle, title, body_html, description, excerpt, tags }
 *     ready for the Pages API / a bulk import.
 *
 * Handles are frozen and identical to the /learn/ slugs, so the cutover
 * is a redirect map of /learn/<handle> -> /pages/<handle>, nothing more.
 *
 * Likely dependencies when implemented: gray-matter (frontmatter),
 * unified/remark + rehype (Markdown -> HTML).
 */

console.error(
  'to-shopify is a stub — the Shopify bridge is finished at store-launch. ' +
    'See the TODO block in scripts/to-shopify/index.mjs.'
);
process.exit(1);
