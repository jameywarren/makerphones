/**
 * Puppeteer config (used by pagedjs-cli's puppeteer dependency).
 *
 * Skip the bundled-Chromium download — the book render uses a SYSTEM Chrome
 * instead (auto-detected, or via PUPPETEER_EXECUTABLE_PATH / CHROME_PATH).
 * This keeps `npm ci` fast and reliable in CI, where the runner's
 * preinstalled google-chrome is used. See scripts/to-book/render.mjs.
 */
module.exports = { skipDownload: true };
