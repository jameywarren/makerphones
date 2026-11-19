/**
 * Edition facts: the one place they are typed.
 *
 * The print assembler (to-book/collect.mjs), the EPUB build (to-epub/build.mjs)
 * and the renderer (to-book/render.mjs) all import from here. Before this file
 * the edition line was typed three times and the title four.
 *
 * NOT here, because they are typed in files with their own formats:
 *   - the cover (project/book/cover/): title, subtitle, spine width, trim
 *   - the running-head string in src/styles/book.css
 * The front and back matter prose (preface, acknowledgments, about the author,
 * colophon) is still written out twice, once in each script.
 */

export const BOOK_TITLE = 'The Art and Science of Headphone Design';
export const BOOK_SUBTITLE =
  'Designing and building your own headphones — the real engineering, explained plainly.';
export const AUTHOR = 'Jamey Warren';             // pen name — byline on the cover + title page
export const COPYRIGHT_HOLDER = 'James A. Warren'; // legal name — copyright line + ISBN registrant of record
export const IMPRINT = 'Warren Labs';

// Warren Labs ISBN block 979-8-9968299-x (Bowker order #2531268). Each edition
// gets its own ISBN; both are listed on the print copyright page.
export const ISBN_PAPERBACK = '979-8-9968299-0-3';
export const ISBN_EBOOK = '979-8-9968299-1-0';

/** The edition statement on the copyright page: "<EDITION> · <EDITION_YEAR>".
 *  EDITION_YEAR is also the EPUB's dc:date. */
export const EDITION = 'First edition';
export const EDITION_YEAR = '2026';

/**
 * Printing / revision line. null for the first printing.
 *
 * Set it to a string and it is printed on the copyright page of BOTH editions,
 * on its own line under the edition statement. Example:
 *
 *   export const REVISION = 'Second printing, with corrections · 2027';
 *
 * While it is null the output is byte-for-byte what it was without it.
 */
export const REVISION = null;

/**
 * Page count of the interior the cover was built for. The spine width in
 * project/book/cover/cover-print.html is typed by hand from this number
 * (KDP: pages × 0.002252 in; IngramSpark: pages × 0.0025 in). render.mjs
 * compares every render against it and says so when they differ. If a new
 * printing lands on a different count, recompute the spine, then change this.
 */
export const PRINTED_PAGE_COUNT = 282;
