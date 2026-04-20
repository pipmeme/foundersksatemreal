import { useEffect } from "react";

const SITE_NAME = "Founders KSA";
const DEFAULT_TITLE = `${SITE_NAME} — Real Stories from Saudi Arabia's Boldest Entrepreneurs`;

/**
 * Sets the document title and cleans up on unmount.
 * Usage: usePageTitle("Story Title") → "Story Title | Founders KSA"
 * Usage: usePageTitle() → default title
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
