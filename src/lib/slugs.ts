/**
 * Converts a string into a URL-safe slug.
 * - Lowercases, trims, removes non-alphanumeric chars (except spaces/hyphens)
 * - Replaces spaces with hyphens, collapses multiple hyphens
 *
 * Examples:
 *   toSlug("From Teenage Coder to 5 Million Downloads") → "from-teenage-coder-to-5-million-downloads"
 *   toSlug("Sir Alain Edene") → "sir-alain-edene"
 *   toSlug("NJD   Studio!!!") → "njd-studio"
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars except spaces/hyphens
    .replace(/[\s_]+/g, "-")  // spaces/underscores → hyphens
    .replace(/-+/g, "-")      // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Validates that a slug is URL-safe.
 * Only lowercase letters, numbers, and hyphens allowed.
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
