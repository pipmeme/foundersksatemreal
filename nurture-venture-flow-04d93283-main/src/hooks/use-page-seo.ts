import { useEffect } from "react";

const SITE_NAME = "Founders KSA";
const DOMAIN = "https://foundersksa.com";
const DEFAULT_TITLE = `${SITE_NAME} — Real Stories from Saudi Arabia's Boldest Entrepreneurs`;
const DEFAULT_DESCRIPTION =
  "Discover real founder stories from Saudi Arabia's boldest entrepreneurs. Real lessons, failures, and wins — your playbook for building in the Kingdom.";

interface SEOOptions {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  /** JSON-LD structured data object to inject */
  jsonLd?: Record<string, unknown>;
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setJsonLd(data: Record<string, unknown>) {
  let el = document.getElementById("page-jsonld");
  if (!el) {
    el = document.createElement("script");
    el.id = "page-jsonld";
    el.setAttribute("type", "application/ld+json");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd() {
  document.getElementById("page-jsonld")?.remove();
}

export function usePageSEO(options: SEOOptions = {}) {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    path = "/",
    type = "website",
    jsonLd,
  } = options;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = `${DOMAIN}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", type, true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setCanonical(canonicalUrl);

    if (jsonLd) {
      setJsonLd(jsonLd);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("description", DEFAULT_DESCRIPTION);
      setMeta("og:title", DEFAULT_TITLE, true);
      setMeta("og:description", DEFAULT_DESCRIPTION, true);
      setMeta("og:url", DOMAIN, true);
      setMeta("og:type", "website", true);
      setMeta("twitter:title", DEFAULT_TITLE);
      setMeta("twitter:description", DEFAULT_DESCRIPTION);
      setCanonical(DOMAIN);
      removeJsonLd();
    };
  }, [fullTitle, description, canonicalUrl, type, jsonLd]);
}
