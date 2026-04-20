const SITE_URL = "https://foundersksa.com";
const OG_SHARE_URL =
  "https://hjxmcovyutuvbbvytjkm.supabase.co/functions/v1/og-share";

/**
 * Returns a clean shareable URL using the foundersksa.com domain.
 * Use this for in-app navigation, copy-to-clipboard for non-social contexts,
 * and anywhere a human will read the URL.
 */
export function getShareUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Returns a social-share URL that points to the og-share edge function.
 * The function returns rich Open Graph meta tags (title, description, image)
 * for crawlers like LinkedIn, Twitter, Facebook, WhatsApp — and immediately
 * redirects real users to the canonical foundersksa.com page.
 *
 * Use this for "Share to LinkedIn", "Share to Twitter", etc. buttons so the
 * unfurled preview shows the actual story title and description instead of
 * the generic site-wide tags from index.html.
 */
export function getSocialShareUrl(path: string): string {
  return `${OG_SHARE_URL}?path=${encodeURIComponent(path)}`;
}
