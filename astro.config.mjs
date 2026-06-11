// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Sidebar: the six parts of the Reference Manual, in order.
// Chapter entries are added as slug strings ('learn/<handle>') once the
// chapter Markdown lands in src/content/docs/learn/. Slugs are frozen —
// use _source/Website_URL_slug_Reference verbatim. Later groups stay
// defined-but-empty so the full structure is visible and trivial to extend.
const sidebar = [
  {
    label: 'Fundamentals',
    items: [
      // Part 1 — chapters 1–6 (add 'learn/<handle>' entries from the slug reference)
    ],
  },
  {
    label: 'Components & Materials',
    items: [
      // Part 2 — chapters 7–12
    ],
  },
  {
    label: 'Design & Build',
    items: [
      // Part 3 — chapter 13 (Design Methodology) written; 14–17 pending
    ],
  },
  { label: 'Measurement & Tuning', items: [] }, // Part 4 — not yet written
  { label: 'Advanced', items: [] }, // Part 5 — not yet written
  { label: 'Special Topics', items: [] }, // Part 6 — not yet written
];

export default defineConfig({
  site: 'https://makerphones.com',
  integrations: [
    starlight({
      title: 'MakerPhones',
      description:
        'An open reference for designing and building your own headphones — real engineering, explained plainly.',
      sidebar,
      customCss: ['./src/styles/theme.css'],
      pagination: true,
      lastUpdated: false,
      social: [],
      components: {
        // Renders the chapter metadata row (difficulty, read time,
        // prerequisites, related) beneath the title, fed by frontmatter.
        PageTitle: './src/components/PageTitle.astro',
      },
    }),
  ],
});
