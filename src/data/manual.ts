/**
 * The manual's structure — six parts, 30 chapters, frozen handles.
 *
 * Handle order matches the Content & Style Guide appendix
 * (_source/MakerPhones-Content-Style-Guide.md) verbatim. Nav-chrome
 * decimal numbers (1.1–6.4) derive from position here — they are
 * NEVER stored in content. Titles for written chapters come from
 * frontmatter at build time (see chapterInfo); titles listed here are
 * working titles for chapters that don't exist yet.
 *
 * Part-level descriptions/levels are nav-chrome copy from the v2
 * design handoff.
 */
import { getCollection } from 'astro:content';

export interface ManualPart {
  num: number;
  title: string;
  level: string;
  desc: string;
  handles: string[];
}

/** Working titles for unwritten chapters (from the frozen outline). */
const WORKING_TITLES: Record<string, string> = {
  '3d-design-for-headphones': '3D Design for Headphones',
  'acoustic-chamber-design': 'Acoustic Chamber Design',
  'driver-mounting-and-assembly': 'Driver Mounting and Assembly',
  'damping-strategy-and-application': 'Damping Strategy and Application',
  'why-measure-headphones': 'Why Measure Headphones',
  'budget-measurement-setup': 'Budget Measurement Setup',
  'taking-and-interpreting-measurements': 'Taking and Interpreting Measurements',
  'tuning-with-damping': 'Tuning with Damping',
  'advanced-measurement-topics': 'Advanced Measurement Topics',
  'acoustic-modeling': 'Acoustic Modeling',
  'resonance-control': 'Resonance Control',
  'manufacturing-for-consistency': 'Manufacturing for Consistency',
  'professional-design-insights': 'Professional Design Insights',
  'bluetooth-integration': 'Bluetooth Integration',
  'active-noise-cancelling': 'Active Noise Cancelling',
  'microphone-integration': 'Microphone Integration',
  'custom-iem-design': 'Custom IEM Design',
};

export const MANUAL_PARTS: ManualPart[] = [
  {
    num: 1,
    title: 'Fundamentals',
    level: 'Beginner',
    desc: 'How headphones create sound — frequency response, impedance, form factors, and driver technologies.',
    handles: [
      'how-headphones-create-sound',
      'understanding-frequency-response',
      'impedance-and-sensitivity',
      'open-vs-closed-back-design',
      'headphone-form-factors',
      'driver-technologies',
    ],
  },
  {
    num: 2,
    title: 'Components & Materials',
    level: 'Beginner → Intermediate',
    desc: 'Drivers, chambers, pads, damping, cables — what each part does, and where to actually get it.',
    handles: [
      'driver-selection-guide',
      'sourcing-components',
      'acoustic-chambers-and-enclosures',
      'ear-pads-and-comfort',
      'damping-materials',
      'cables-connectors-hardware',
    ],
  },
  {
    num: 3,
    title: 'Design & Build Process',
    level: 'Intermediate',
    desc: 'Methodology, 3D design, chamber geometry, mounting, and a damping strategy that survives contact with reality.',
    handles: [
      'design-methodology',
      '3d-design-for-headphones',
      'acoustic-chamber-design',
      'driver-mounting-and-assembly',
      'damping-strategy-and-application',
    ],
  },
  {
    num: 4,
    title: 'Measurement & Tuning',
    level: 'Intermediate',
    desc: 'Why measurement matters, a rig that doesn’t break the bank, and how to tune what you find.',
    handles: [
      'why-measure-headphones',
      'budget-measurement-setup',
      'taking-and-interpreting-measurements',
      'tuning-with-damping',
      'advanced-measurement-topics',
    ],
  },
  {
    num: 5,
    title: 'Advanced Topics',
    level: 'Advanced',
    desc: 'Acoustic modeling, resonance control, manufacturing consistency, and lessons from a design career.',
    handles: [
      'acoustic-modeling',
      'resonance-control',
      'manufacturing-for-consistency',
      'professional-design-insights',
    ],
  },
  {
    num: 6,
    title: 'Special Topics',
    level: 'Advanced',
    desc: 'Bluetooth, active noise cancelling, microphones, and custom in-ear monitors.',
    handles: [
      'bluetooth-integration',
      'active-noise-cancelling',
      'microphone-integration',
      'custom-iem-design',
    ],
  },
];

/**
 * The five reference appendices, in the Compass's planned order.
 * Appendices carry no nav numbering and sit outside the 1–30
 * prev/next chain; they resolve in byHandle so related-field
 * cross-references link correctly in both directions.
 */
export const APPENDIX_HANDLES = [
  'glossary',
  'supplier-directory',
  'design-resources',
  'troubleshooting-guide',
  'community-builds',
] as const;

/**
 * Build guides — hands-on companion builds (type: build-guide).
 * Like appendices: no nav numbering, outside the 1–30 chain,
 * resolved in byHandle so cross-references link correctly.
 */
export const BUILD_GUIDE_HANDLES = [
  'your-first-build',
  'simple-open-back-build',
  'closed-back-studio-build',
] as const;

export const LEVEL_RANK: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export interface ChapterInfo {
  handle: string;
  /** Nav-chrome decimal, e.g. "2.3" — derived, never displayed in content. */
  num: string;
  partNum: number;
  partTitle: string;
  title: string;
  written: boolean;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime?: number;
  /** Build guides: rough hands-on time, free text. */
  timeEstimate?: string;
  prerequisites: string[];
  related: string[];
}

/**
 * Resolve the full outline against the live docs collection.
 * Written chapters take title/difficulty/read_time from frontmatter;
 * unwritten ones get working titles and an upcoming state.
 */
export async function getManual(): Promise<{
  parts: (ManualPart & { chapters: ChapterInfo[] })[];
  appendices: ChapterInfo[];
  buildGuides: ChapterInfo[];
  byHandle: Map<string, ChapterInfo>;
  writtenCount: number;
  totalCount: number;
}> {
  const docs = await getCollection('docs');
  const byId = new Map(docs.map((d) => [d.id, d]));
  const byHandle = new Map<string, ChapterInfo>();

  const parts = MANUAL_PARTS.map((part) => {
    const chapters = part.handles.map((handle, i): ChapterInfo => {
      const entry = byId.get(`learn/${handle}`);
      const info: ChapterInfo = {
        handle,
        num: `${part.num}.${i + 1}`,
        partNum: part.num,
        partTitle: part.title,
        title: entry?.data.title ?? WORKING_TITLES[handle] ?? handle,
        written: Boolean(entry),
        difficulty: entry?.data.difficulty,
        readTime: entry?.data.read_time,
        prerequisites: entry?.data.prerequisites ?? [],
        related: entry?.data.related ?? [],
      };
      byHandle.set(handle, info);
      return info;
    });
    return { ...part, chapters };
  });

  const appendices = APPENDIX_HANDLES.map((handle): ChapterInfo => {
    const entry = byId.get(`learn/${handle}`);
    const info: ChapterInfo = {
      handle,
      num: '', // appendices carry no nav numbering
      partNum: 0,
      partTitle: 'Appendices',
      title: entry?.data.title ?? handle,
      written: Boolean(entry),
      difficulty: entry?.data.difficulty,
      readTime: entry?.data.read_time,
      prerequisites: entry?.data.prerequisites ?? [],
      related: entry?.data.related ?? [],
    };
    byHandle.set(handle, info);
    return info;
  });

  const buildGuides = BUILD_GUIDE_HANDLES.map((handle): ChapterInfo => {
    const entry = byId.get(`learn/${handle}`);
    const info: ChapterInfo = {
      handle,
      num: '', // build guides carry no nav numbering
      partNum: -1,
      partTitle: 'Build Guides',
      title: entry?.data.title ?? handle,
      written: Boolean(entry),
      difficulty: entry?.data.difficulty,
      readTime: entry?.data.read_time,
      timeEstimate: (entry?.data as { time_estimate?: string } | undefined)?.time_estimate,
      prerequisites: entry?.data.prerequisites ?? [],
      related: entry?.data.related ?? [],
    };
    byHandle.set(handle, info);
    return info;
  });

  const all = parts.flatMap((p) => p.chapters);
  return {
    parts,
    appendices,
    buildGuides,
    byHandle,
    // counts cover the 30 manual chapters only; appendices/guides are extra
    writtenCount: all.filter((c) => c.written).length,
    totalCount: all.length,
  };
}
