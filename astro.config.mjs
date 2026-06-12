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
      // Part 1 — chapters 1–6
      'learn/how-headphones-create-sound',
      'learn/understanding-frequency-response',
      'learn/impedance-and-sensitivity',
      'learn/open-vs-closed-back-design',
      'learn/headphone-form-factors',
      'learn/driver-technologies',
    ],
  },
  {
    label: 'Components & Materials',
    items: [
      // Part 2 — chapters 7–12
      'learn/driver-selection-guide',
      'learn/sourcing-components',
      'learn/acoustic-chambers-and-enclosures',
      'learn/ear-pads-and-comfort',
      'learn/damping-materials',
      'learn/cables-connectors-hardware',
    ],
  },
  {
    label: 'Design & Build',
    items: [
      // Part 3 — 3d-design-for-headphones (3.2) still pending
      'learn/design-methodology',
      'learn/acoustic-chamber-design',
      'learn/driver-mounting-and-assembly',
      'learn/damping-strategy-and-application',
    ],
  },
  {
    label: 'Measurement & Tuning',
    items: [
      // Part 4 — 4.1 and 4.4 written; 4.2, 4.3, 4.5 pending
      'learn/why-measure-headphones',
      'learn/tuning-with-damping',
    ],
  },
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
      customCss: [
        // self-hosted variable fonts (bundled, no external requests)
        '@fontsource-variable/schibsted-grotesk',
        '@fontsource-variable/source-serif-4',
        '@fontsource-variable/jetbrains-mono',
        './src/styles/theme.css',
      ],
      pagination: true,
      lastUpdated: false,
      social: [],
      components: {
        // Claude Design v2 overrides — see src/components/.
        SiteTitle: './src/components/SiteTitle.astro',
        Sidebar: './src/components/Sidebar.astro',
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
        Header: './src/components/Header.astro',
      },
    }),
  ],
});
