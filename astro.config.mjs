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
      // Part 4 — complete. measuring-raw-drivers is a full part-4 chapter
      // (type: chapter, the schema default), in the numbered chain via
      // manual.ts MANUAL_PARTS — correctly grouped here, not a loose note.
      'learn/why-measure-headphones',
      'learn/budget-measurement-setup',
      'learn/taking-and-interpreting-measurements',
      'learn/measuring-raw-drivers',
      'learn/tuning-with-damping',
      'learn/tuning-with-eq',
      'learn/benchmarking-with-public-measurements',
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
      // Hands-on companion builds — no nav numbering, outside the chapter chain.
      // First Chair leads the builds: it is the flagship (the on-ear open-back that
      // is the first rung), and Daily Driver follows as the over-ear you graduate to.
      'learn/choosing-a-3d-printer',
      'learn/your-first-build',
      'learn/first-chair-design-spec',
      'learn/first-chair-parts',
      'learn/simple-open-back-build',
      'learn/closed-back-studio-build',
      'learn/daily-driver-design-spec',
      'learn/daily-driver-parts',
      'learn/daily-driver-parts-beta',
      'learn/designing-headphones-with-ai',
    ],
  },
  {
    label: 'Appendices',
    items: [
      // Reference pages — no nav numbering, outside the chapter chain.
      // listening-safely is the standing safety note (type: chapter, the
      // schema default) that deliberately leads the appendices — it is NOT
      // an appendix-typed file; the placement is intentional and mirrors
      // manual.ts APPENDIX_HANDLES. The entries below it are type: appendix.
      'learn/listening-safely',
      'learn/glossary',
      'learn/supplier-directory',
      'learn/design-resources',
      'learn/sources-and-further-reading',
      'learn/troubleshooting-guide',
      'learn/community-builds',
    ],
  },
];

export default defineConfig({
  site: 'https://makerphones.com',
  integrations: [
    starlight({
      title: 'makerphones',
      description:
        'An open reference for designing and building your own headphones — real engineering, explained plainly.',
      sidebar,
      favicon: '/favicon.svg',
      head: [
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'makerphones' } },
        // default branded OG image (per-page overrides optional later)
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://makerphones.com/og-default.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://makerphones.com/og-default.png' } },
        // icons + manifest
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#ea580c' } },
        // bench-notes feed
        { tag: 'link', attrs: { rel: 'alternate', type: 'application/rss+xml', title: 'makerphones — Bench Notes', href: '/rss.xml' } },
        // Privacy-friendly analytics (GoatCounter: no cookies, no consent
        // banner needed).
        {
          tag: 'script',
          attrs: {
            'data-goatcounter': 'https://makerphones.goatcounter.com/count',
            async: true,
            src: '//gc.zgo.at/count.js',
          },
        },
      ],
      customCss: [
        // self-hosted variable fonts (bundled, no external requests)
        '@fontsource-variable/schibsted-grotesk',
        '@fontsource-variable/source-serif-4',
        '@fontsource-variable/jetbrains-mono',
        './src/styles/theme.css',
        './src/styles/diagrams.css',
        './src/styles/homepage.css',
      ],
      pagination: true,
      lastUpdated: false,
      social: [],
      components: {
        // Claude Design v2 overrides — see src/components/.
        SiteTitle: './src/components/SiteTitle.astro',
        Sidebar: './src/components/Sidebar.astro',
        PageTitle: './src/components/PageTitle.astro',
        PageFrame: './src/components/PageFrame.astro',
        Footer: './src/components/Footer.astro',
        Header: './src/components/Header.astro',
      },
    }),
  ],
});
