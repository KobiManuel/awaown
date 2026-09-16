// Public-facing text tidy-ups for merchant-entered copy.
//
// Merchants type product titles and descriptions inconsistently ("ankara maxi
// dress", "SAMSUNG TV"). On public pages we present them cleanly WITHOUT
// destroying deliberate casing: any word that already contains an uppercase
// letter (iPhone, AwaOwn, XL, LED, 4K) is left exactly as typed; only fully
// lowercase words get their first letter capitalised.

/** Title-case a product name, preserving words the merchant deliberately cased. */
export function smartTitle(s) {
  if (!s) return s ?? "";
  return String(s).replace(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu, (word) =>
    /\p{Lu}/u.test(word)
      ? word
      : word.charAt(0).toUpperCase() + word.slice(1),
  );
}

/**
 * Sentence-case a block of description text: capitalise the first letter and the
 * first letter after each sentence break. Words with existing uppercase are left
 * alone, so brand names and acronyms mid-sentence are untouched.
 */
export function sentenceCase(s) {
  if (!s) return s ?? "";
  return String(s).replace(
    /(^\s*|[.!?]\s+|\n\s*)(\p{Ll})/gu,
    (_m, lead, ch) => lead + ch.toUpperCase(),
  );
}

/**
 * Plain-text version of a rich-text (HTML) product description, for contexts
 * that can't render markup - <meta> descriptions, og:description, anywhere
 * else only a short text summary is wanted rather than the formatted body.
 */
export function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|br)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
