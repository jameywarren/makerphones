/**
 * Wayfinding taxonomy — which mark each destination wears, per the
 * illustration-system icon sheet. Chrome only, never body prose;
 * nav stays text-only (design ruling).
 */
export type MpIconName =
  | 'fundamentals'
  | 'drivers'
  | 'enclosures'
  | 'materials'
  | 'build'
  | 'measure'
  | 'read'
  | 'guide'
  | 'builds'
  | 'contents'
  | 'glossary'
  | 'troubleshoot'
  | 'resources'
  | 'suppliers'
  | 'arrow';

/** Part number (1–6) → part icon. */
export const PART_ICONS: MpIconName[] = ['contents', 'fundamentals', 'drivers', 'enclosures', 'materials', 'build', 'measure'];

/** Appendix handle → its own reference mark. */
export const APPENDIX_ICONS: Record<string, MpIconName> = {
  glossary: 'glossary',
  'supplier-directory': 'suppliers',
  'design-resources': 'resources',
  'sources-and-further-reading': 'read',
  'troubleshooting-guide': 'troubleshoot',
  'community-builds': 'builds',
};

/** Mark for a manual entry: part icon, appendix mark, or guide. */
export function entryIcon(partNum: number, handle: string): MpIconName {
  if (partNum >= 1 && partNum <= 6) return PART_ICONS[partNum];
  if (partNum === 0) return APPENDIX_ICONS[handle] ?? 'contents';
  return 'guide'; // build guides (partNum === -1)
}
