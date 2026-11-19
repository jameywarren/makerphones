/**
 * paged-guards.js — runs IN THE BROWSER, inlined into book.html by collect.mjs
 * right after the Paged.js polyfill. Not a Node module.
 *
 * Two jobs:
 *
 * 1. Never split a word across a page break.
 *    Paged.js 0.4.3 finds the break inside an auto-hyphenated word one letter
 *    late: Chrome reports the first letter after the hyphenation point with a
 *    box that still touches the old line, so the "is this letter on the next
 *    page?" test fails for it. Paged.js then cuts "con-nectors" as "conn" +
 *    "ectors", glues its own hyphen onto "conn", and the longer fragment no
 *    longer fits the last line. On a recto that prints a wrong hyphenation
 *    ("drive-rs"). On a verso the fragment wraps past the bottom of the page
 *    and is clipped: the letters are simply gone from the printed book
 *    ("basic detachable [conn]ectors"), and with widows: 2 it can take the
 *    whole previous line with it.
 *    Fix: when a break lands inside a word, move it back to the start of that
 *    word. The whole word goes to the next page. No hyphen is added, nothing
 *    is appended to the last line, so nothing can reflow off the page.
 *
 * 2. Expose window.__bookClipAudit() for render.mjs: after pagination, list
 *    any visible text that sits outside its page's content box. That is text
 *    a reader will not see. render.mjs fails the render when the list is not
 *    empty, so a lost line can never reach a press file unnoticed again.
 */
(function () {
  'use strict';

  var WORD_CHAR = /[\p{L}\p{N}\u00AD]/u;

  class KeepWordsWhole extends Paged.Handler {
    onBreakToken(breakToken, overflow) {
      if (!breakToken || !overflow) return;
      var sc = overflow.startContainer;
      if (!sc || sc.nodeType !== Node.TEXT_NODE) return;
      var text = sc.textContent;
      var off = overflow.startOffset;
      if (off <= 0 || off >= text.length) return;
      if (!WORD_CHAR.test(text[off - 1]) || !WORD_CHAR.test(text[off])) return;

      var start = off;
      while (start > 0 && !/\s/.test(text[start - 1])) start -= 1;
      var delta = off - start;
      if (!delta || typeof breakToken.offset !== 'number' || breakToken.offset < delta) return;

      breakToken.offset -= delta;
      if (start === 0) overflow.setStartBefore(sc);   // whole text node moves; no empty stub left behind
      else overflow.setStart(sc, start);
      window.__bookWordBreaksMoved = (window.__bookWordBreaksMoved || 0) + 1;
    }
  }
  Paged.registerHandlers(KeepWordsWhole);

  window.__bookClipAudit = function () {
    var found = [];
    var pages = document.querySelectorAll('.pagedjs_page');
    for (var i = 0; i < pages.length; i += 1) {
      var area = pages[i].querySelector('.pagedjs_page_content');
      if (!area || !area.firstElementChild) continue;
      var box = area.getBoundingClientRect();
      var walker = document.createTreeWalker(area.firstElementChild, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim()) continue;
        var el = node.parentElement;
        if (!el || el.closest('.sr-only, .sl-hidden, [hidden]')) continue;
        var cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        var range = document.createRange();
        range.selectNodeContents(node);
        var rects = range.getClientRects();
        for (var r = 0; r < rects.length; r += 1) {
          var rc = rects[r];
          if (rc.width === 0 || rc.height === 0) continue;
          var out = rc.left >= box.right - 1 || rc.top >= box.bottom - 1 ||
            rc.right > box.right + 2 || rc.bottom > box.bottom + 3 ||
            rc.left < box.left - 2 || rc.top < box.top - 3;
          if (out) {
            found.push({ page: i + 1, text: node.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) });
            break;
          }
        }
      }
    }
    return found;
  };

  window.PagedPolyfill.preview();
})();
