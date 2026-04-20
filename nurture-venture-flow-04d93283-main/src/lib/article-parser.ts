/**
 * Client-side article parser — no AI, no API.
 *
 * FORMAT GUIDE (paste this kind of text):
 * ──────────────────────────────────────
 * # Article Title
 * 
 * A short excerpt or summary sentence.
 *
 * Category: Fintech
 * Founder: Ahmed Ali
 * Company: PaySA
 * Stage: Seed
 * OneLiner: Payments for the next generation
 * LinkedIn: https://linkedin.com/in/ahmed
 * Website: https://paysa.com
 *
 * ## First Section Heading
 *
 * First paragraph of this section goes here.
 *
 * Another paragraph in the same section.
 *
 * > This is a pull quote — a key insight or memorable line.
 *
 * ## Second Section Heading
 *
 * More paragraphs here...
 *
 * ---
 * Milestone: Founded the company
 * Milestone: Raised seed round
 * Milestone: Launched MVP
 */

interface ParsedSection {
  heading: string;
  pullQuote: string;
  paragraphs: string[];
}

interface ParsedMilestone {
  label: string;
}

export interface ParsedArticle {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: ParsedSection[];
  metadata: {
    founder: string;
    company: string;
    intro: string;
    milestones: ParsedMilestone[];
    readTime: string;
    stage: string;
    oneLiner: string;
    linkedin: string;
    website: string;
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function parseArticleText(raw: string): ParsedArticle {
  const lines = raw.split("\n");

  let title = "";
  let excerpt = "";
  let category = "";
  let founder = "";
  let company = "";
  let stage = "";
  let oneLiner = "";
  let linkedin = "";
  let website = "";
  const milestones: ParsedMilestone[] = [];
  const sections: ParsedSection[] = [];

  let currentSection: ParsedSection | null = null;
  let introLines: string[] = [];
  let passedTitle = false;
  let inMetaBlock = false;

  const pushCurrentSection = () => {
    if (currentSection) {
      // Clean up empty paragraphs
      currentSection.paragraphs = currentSection.paragraphs.filter((p) => p.trim());
      if (currentSection.paragraphs.length > 0 || currentSection.heading) {
        sections.push(currentSection);
      }
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Title: # Title
    if (!passedTitle && /^#\s+(.+)$/.test(line)) {
      title = line.replace(/^#\s+/, "").trim();
      passedTitle = true;
      continue;
    }

    // Section heading: ## Heading
    if (/^##\s+(.+)$/.test(line)) {
      pushCurrentSection();
      currentSection = {
        heading: line.replace(/^##\s+/, "").trim(),
        pullQuote: "",
        paragraphs: [],
      };
      inMetaBlock = false;
      continue;
    }

    // Milestone line (can appear anywhere)
    const milestoneMatch = line.match(/^Milestone:\s*(.+)$/i);
    if (milestoneMatch) {
      milestones.push({ label: milestoneMatch[1].trim() });
      continue;
    }

    // Metadata key-value lines
    const metaMatch = line.match(/^(Category|Founder|Company|Stage|OneLiner|LinkedIn|Website|Intro):\s*(.+)$/i);
    if (metaMatch) {
      const key = metaMatch[1].toLowerCase();
      const val = metaMatch[2].trim();
      if (key === "category") category = val;
      else if (key === "founder") founder = val;
      else if (key === "company") company = val;
      else if (key === "stage") stage = val;
      else if (key === "oneliner") oneLiner = val;
      else if (key === "linkedin") linkedin = val;
      else if (key === "website") website = val;
      else if (key === "intro") introLines.push(val);
      inMetaBlock = true;
      continue;
    }

    // Horizontal rule (section divider or just visual break)
    if (/^---+$/.test(line.trim())) {
      inMetaBlock = false;
      continue;
    }

    // Skip blank lines in meta block
    if (inMetaBlock && !line.trim()) continue;
    inMetaBlock = false;

    // Pull quote: > Quote text
    if (/^>\s+(.+)$/.test(line) && currentSection) {
      currentSection.pullQuote = line.replace(/^>\s+/, "").trim();
      continue;
    }

    // Blank line — skip
    if (!line.trim()) continue;

    // If no section started yet, treat as excerpt or intro
    if (!currentSection) {
      if (!excerpt) {
        excerpt = line.trim();
      } else {
        introLines.push(line.trim());
      }
      continue;
    }

    // Regular paragraph
    currentSection.paragraphs.push(line.trim());
  }

  // Push last section
  pushCurrentSection();

  // If no sections were created, wrap everything into one
  if (sections.length === 0 && (excerpt || introLines.length > 0)) {
    sections.push({
      heading: "",
      pullQuote: "",
      paragraphs: [excerpt, ...introLines].filter(Boolean),
    });
    excerpt = sections[0].paragraphs[0] || "";
  }

  return {
    title,
    slug: slugify(title),
    category,
    excerpt,
    content: sections,
    metadata: {
      founder,
      company,
      intro: introLines.join(" "),
      milestones,
      readTime: estimateReadTime(raw),
      stage,
      oneLiner,
      linkedin,
      website,
    },
  };
}
