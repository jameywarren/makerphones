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
      // Part 3 — complete
      'learn/design-methodology',
      'learn/3d-design-for-headphones',
      'learn/acoustic-chamber-design',
      'learn/driver-mounting-and-assembly',
      'learn/damping-strategy-and-application',
    ],
  },
  {
    label: 'Measurement & Tuning',
    items: [
      // Part 4 — complete
      'learn/why-measure-headphones',
      'learn/budget-measurement-setup',
      'learn/taking-and-interpreting-measurements',
      'learn/tuning-with-damping',
      'learn/advanced-measurement-topics',
    ],
  },
  {
    label: 'Advanced',
    items: [
      // Part 5 — complete
      'learn/acoustic-modeling',
      'learn/resonance-control',
      'learn/manufacturing-for-consistency',
      'learn/professional-design-insights',
    ],
  },
  {
    label: 'Special Topics',
    items: [
      // Part 6 — complete
      'learn/bluetooth-integration',
      'learn/active-noise-cancelling',
      'learn/microphone-integration',
      'learn/custom-iem-design',
    ],
  },
  {
    label: 'Build Guides',
    items: [
      // Hands-on companion builds — no nav numbering, outside the chapter chain
      'learn/your-first-build',
      'learn/simple-open-back-build',
      'learn/closed-back-studio-build',
    ],
  },
  {
    label: 'Appendices',
    items: [
      // Reference appendices — no nav numbering, outside the chapter chain
      'learn/glossary',
      'learn/supplier-directory',
      'learn/design-resources',
      'learn/troubleshooting-guide',
      'learn/community-builds',
    ],
  },
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
