import { useState, useEffect, useCallback } from "react";
import type { Json } from "@/integrations/supabase/types";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  ChevronDown,
  ChevronUp,
  FileText,
  PenLine,
  ClipboardPaste,
} from "lucide-react";
import { parseArticleText } from "@/lib/article-parser";

interface Section {
  heading: string;
  pullQuote: string;
  paragraphs: string[];
}

interface Milestone {
  label: string;
}

interface ArticleForm {
  title: string;
  slug: string;
  type: "founder_story" | "insight" | "rising_founder";
  category: string;
  status: "public" | "private" | "draft";
  excerpt: string;
  content: Section[];
  metadata: {
    founder: string;
    company: string;
    intro: string;
    milestones: Milestone[];
    readTime: string;
    stage: string;
    oneLiner: string;
    linkedin: string;
    website: string;
  };
}

const emptySection = (): Section => ({ heading: "", pullQuote: "", paragraphs: [""] });

const defaultForm: ArticleForm = {
  title: "",
  slug: "",
  type: "insight",
  category: "",
  status: "draft",
  excerpt: "",
  content: [emptySection()],
  metadata: { founder: "", company: "", intro: "", milestones: [], readTime: "", stage: "", oneLiner: "", linkedin: "", website: "" },
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type EditorMode = "choose" | "manual" | "smartpaste" | "editor";

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<ArticleForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(isEdit);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

  // AI mode state
  const [mode, setMode] = useState<EditorMode>(isEdit ? "editor" : "choose");
  const [pasteContent, setPasteContent] = useState("");
  const [pasteArticleType, setPasteArticleType] = useState<ArticleForm["type"]>("insight");

  usePageTitle(isEdit ? "Edit Article" : "New Article");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isEdit || !user || !isAdmin) return;
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        toast.error("Article not found");
        navigate("/admin", { replace: true });
        return;
      }
      const content = (data.content as unknown as Section[]) || [emptySection()];
      const meta = (data.metadata as Record<string, unknown>) || {};
      setForm({
        title: data.title,
        slug: data.slug,
        type: data.type,
        category: data.category || "",
        status: data.status,
        excerpt: data.excerpt || "",
        content,
        metadata: {
          founder: (meta.founder as string) || "",
          company: (meta.company as string) || "",
          intro: (meta.intro as string) || "",
          milestones: (meta.milestones as Milestone[]) || [],
          readTime: (meta.readTime as string) || "",
          stage: (meta.stage as string) || "",
          oneLiner: (meta.oneLiner as string) || "",
          linkedin: (meta.linkedin as string) || "",
          website: (meta.website as string) || "",
        },
      });
      setLoadingArticle(false);
    };
    fetchArticle();
  }, [id, isEdit, user, isAdmin, navigate]);

  // --- Smart Paste (fully client-side) ---
  const handleSmartPaste = () => {
    if (!pasteContent.trim()) {
      toast.error("Paste your content first");
      return;
    }

    const article = parseArticleText(pasteContent);

    setForm({
      title: article.title || "",
      slug: article.slug || slugify(article.title || ""),
      type: pasteArticleType,
      category: article.category || "",
      status: "draft",
      excerpt: article.excerpt || "",
      content: article.content.length > 0 ? article.content : [emptySection()],
      metadata: {
        founder: article.metadata.founder || "",
        company: article.metadata.company || "",
        intro: article.metadata.intro || "",
        milestones: article.metadata.milestones || [],
        readTime: article.metadata.readTime || "5 min read",
        stage: article.metadata.stage || "",
        oneLiner: article.metadata.oneLiner || "",
        linkedin: article.metadata.linkedin || "",
        website: article.metadata.website || "",
      },
    });

    toast.success("Article parsed! Review and edit below.");
    setMode("editor");
  };

  const updateField = useCallback(
    <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "title" && !isEdit) {
          next.slug = slugify(value as string);
        }
        return next;
      });
    },
    [isEdit]
  );

  const updateMetadata = useCallback(
    (key: string, value: unknown) => {
      setForm((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, [key]: value },
      }));
    },
    []
  );

  const updateSection = useCallback((idx: number, patch: Partial<Section>) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    }));
  }, []);

  const addSection = () =>
    setForm((prev) => ({ ...prev, content: [...prev.content, emptySection()] }));

  const removeSection = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== idx),
    }));

  const moveSection = (idx: number, dir: -1 | 1) => {
    setForm((prev) => {
      const arr = [...prev.content];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...prev, content: arr };
    });
  };

  const updateParagraph = (sIdx: number, pIdx: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.map((s, i) =>
        i === sIdx
          ? { ...s, paragraphs: s.paragraphs.map((p, j) => (j === pIdx ? value : p)) }
          : s
      ),
    }));
  };

  const addParagraph = (sIdx: number) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.map((s, i) =>
        i === sIdx ? { ...s, paragraphs: [...s.paragraphs, ""] } : s
      ),
    }));
  };

  const removeParagraph = (sIdx: number, pIdx: number) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.map((s, i) =>
        i === sIdx
          ? { ...s, paragraphs: s.paragraphs.filter((_, j) => j !== pIdx) }
          : s
      ),
    }));
  };

  const addMilestone = () =>
    updateMetadata("milestones", [...form.metadata.milestones, { label: "" }]);

  const removeMilestone = (idx: number) =>
    updateMetadata(
      "milestones",
      form.metadata.milestones.filter((_, i) => i !== idx)
    );

  const updateMilestone = (idx: number, label: string) =>
    updateMetadata(
      "milestones",
      form.metadata.milestones.map((m, i) => (i === idx ? { label } : m))
    );

  const toggleCollapse = (idx: number) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);

    const cleanContent = form.content.map((s) => ({
      ...(s.heading ? { heading: s.heading } : {}),
      ...(s.pullQuote ? { pullQuote: s.pullQuote } : {}),
      paragraphs: s.paragraphs.filter((p) => p.trim()),
    }));

    const metadata =
      form.type === "founder_story"
        ? {
            founder: form.metadata.founder,
            company: form.metadata.company,
            intro: form.metadata.intro,
            milestones: form.metadata.milestones.filter((m) => m.label.trim()),
          }
        : form.type === "rising_founder"
        ? {
            founder: form.metadata.founder,
            company: form.metadata.company,
            stage: form.metadata.stage,
            oneLiner: form.metadata.oneLiner,
            ...(form.metadata.linkedin ? { linkedin: form.metadata.linkedin } : {}),
            ...(form.metadata.website ? { website: form.metadata.website } : {}),
          }
        : { readTime: form.metadata.readTime || "5 min read" };

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      type: form.type as any,
      category: form.category.trim() || null,
      status: form.status,
      excerpt: form.excerpt.trim() || null,
      content: cleanContent as unknown as Json,
      metadata: metadata as unknown as Json,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("articles").update(payload).eq("id", id));
    } else {
      ({ error } = await supabase.from("articles").insert(payload));
    }

    if (error) {
      toast.error(error.message || "Failed to save");
    } else {
      toast.success(isEdit ? "Article updated" : "Article created");
      navigate("/admin");
    }
    setSaving(false);
  };

  if (authLoading || loadingArticle) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading...</div>
    );
  }
  if (!user || !isAdmin) return null;

  // ─── MODE: Choose ───
  if (mode === "choose") {
    return (
      <section className="py-10 sm:py-16">
        <div className="px-4 sm:container max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-display text-xl sm:text-2xl font-bold">New Article</h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            How would you like to create this article?
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Manual */}
            <button
              onClick={() => setMode("manual")}
              className="group relative rounded-2xl border border-border bg-card p-6 sm:p-8 text-left hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <PenLine className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1.5">Manual</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Write your article section by section with full control over headings, pull quotes, and paragraphs.
              </p>
            </button>

            {/* Smart Paste */}
            <button
              onClick={() => setMode("smartpaste")}
              className="group relative rounded-2xl border border-border bg-card p-6 sm:p-8 text-left hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ClipboardPaste className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1.5">Smart Paste</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Paste formatted text using simple markers (## Heading, &gt; Quote) and it auto-fills sections, metadata, and pull quotes — no API needed.
              </p>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ─── MODE: Smart Paste ───
  if (mode === "smartpaste") {
    return (
      <section className="py-6 sm:py-10">
        <div className="px-4 sm:container max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setMode("choose")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <ClipboardPaste className="h-5 w-5 text-primary" />
              <h1 className="font-display text-xl sm:text-2xl font-bold">Smart Paste</h1>
            </div>
          </div>

          <div className="space-y-6">
            {/* Article type selector */}
            <fieldset className="rounded-xl border border-border p-4 sm:p-6 bg-card space-y-4">
              <legend className="px-2 text-sm font-semibold text-foreground">Article Type</legend>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: "insight" as const, label: "Insight" },
                  { value: "founder_story" as const, label: "Founder Story" },
                  { value: "rising_founder" as const, label: "Rising Founder" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPasteArticleType(opt.value)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      pasteArticleType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Format guide */}
            <fieldset className="rounded-xl border border-border p-4 sm:p-6 bg-card space-y-3">
              <legend className="px-2 text-sm font-semibold text-foreground">Format Guide</legend>
              <pre className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">{`# Article Title

A short excerpt sentence.

Category: Fintech
Founder: Ahmed Ali
Company: PaySA

## First Section Heading

Paragraph text goes here.

> This becomes a pull quote.

## Second Section

More content...

---
Milestone: Founded the company
Milestone: Raised seed round`}</pre>
            </fieldset>

            {/* Raw content */}
            <fieldset className="rounded-xl border border-border p-4 sm:p-6 bg-card space-y-3">
              <legend className="px-2 text-sm font-semibold text-foreground">Your Content</legend>
              <p className="text-xs text-muted-foreground">
                Paste your text using the markers above. It will be parsed instantly — no API, no credits, fully offline.
              </p>
              <Textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder={`# My Article Title\n\nShort excerpt here.\n\nCategory: Growth\n\n## Introduction\n\nFirst paragraph...\n\n> A memorable quote.`}
                className="min-h-[300px] sm:min-h-[400px] text-sm leading-relaxed font-mono"
              />
              <p className="text-xs text-muted-foreground text-right">
                {pasteContent.length > 0 ? `${pasteContent.split(/\s+/).filter(Boolean).length} words` : ""}
              </p>
            </fieldset>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setMode("choose")}>
                Back
              </Button>
              <Button
                onClick={handleSmartPaste}
                disabled={!pasteContent.trim()}
                className="min-w-[180px]"
              >
                <FileText className="h-4 w-4 mr-2" />
                Parse &amp; Fill
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── MODE: Manual (set type first) then fall through to editor ───
  if (mode === "manual") {
    setMode("editor");
  }

  // ─── MODE: Editor (full form) ───
  return (
    <>
      <section className="py-6 sm:py-10">
        <div className="px-4 sm:container max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => isEdit ? navigate("/admin") : setMode("choose")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-display text-xl sm:text-2xl font-bold">
              {isEdit ? "Edit Article" : "New Article"}
            </h1>
          </div>

          <div className="space-y-8">
            {/* Basic Info */}
            <fieldset className="space-y-4 rounded-xl border border-border p-4 sm:p-6 bg-card">
              <legend className="px-2 text-sm font-semibold text-foreground">Basic Info</legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Article title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="url-friendly-slug"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="e.g. Growth, F&B"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) =>
                      updateField("type", e.target.value as ArticleForm["type"])
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="insight">Insight</option>
                    <option value="founder_story">Founder Story</option>
                    <option value="rising_founder">Rising Founder</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) =>
                      updateField("status", e.target.value as ArticleForm["status"])
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    placeholder="Short summary (optional)"
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Metadata — conditional on type */}
            {form.type === "founder_story" && (
              <fieldset className="space-y-4 rounded-xl border border-border p-4 sm:p-6 bg-card">
                <legend className="px-2 text-sm font-semibold text-foreground">
                  Founder Metadata
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Founder Name</Label>
                    <Input
                      value={form.metadata.founder}
                      onChange={(e) => updateMetadata("founder", e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={form.metadata.company}
                      onChange={(e) => updateMetadata("company", e.target.value)}
                      placeholder="e.g. Acme Inc"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Intro Paragraph</Label>
                    <Textarea
                      value={form.metadata.intro}
                      onChange={(e) => updateMetadata("intro", e.target.value)}
                      placeholder="Opening paragraph shown before the timeline"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Timeline Milestones</Label>
                    <Button variant="outline" size="sm" onClick={addMilestone}>
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.metadata.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={m.label}
                          onChange={(e) => updateMilestone(i, e.target.value)}
                          placeholder={`Milestone ${i + 1}`}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive shrink-0"
                          onClick={() => removeMilestone(i)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {form.metadata.milestones.length === 0 && (
                      <p className="text-xs text-muted-foreground">No milestones yet</p>
                    )}
                  </div>
                </div>
              </fieldset>
            )}

            {form.type === "insight" && (
              <fieldset className="space-y-4 rounded-xl border border-border p-4 sm:p-6 bg-card">
                <legend className="px-2 text-sm font-semibold text-foreground">
                  Insight Metadata
                </legend>
                <div>
                  <Label>Read Time</Label>
                  <Input
                    value={form.metadata.readTime}
                    onChange={(e) => updateMetadata("readTime", e.target.value)}
                    placeholder="e.g. 5 min read"
                  />
                </div>
              </fieldset>
            )}

            {form.type === "rising_founder" && (
              <fieldset className="space-y-4 rounded-xl border border-border p-4 sm:p-6 bg-card">
                <legend className="px-2 text-sm font-semibold text-foreground">
                  Rising Founder Info
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Founder Name</Label>
                    <Input
                      value={form.metadata.founder}
                      onChange={(e) => updateMetadata("founder", e.target.value)}
                      placeholder="e.g. Sarah Ahmed"
                    />
                  </div>
                  <div>
                    <Label>Company / Project</Label>
                    <Input
                      value={form.metadata.company}
                      onChange={(e) => updateMetadata("company", e.target.value)}
                      placeholder="e.g. QuickDeliver"
                    />
                  </div>
                  <div>
                    <Label>Stage</Label>
                    <select
                      value={form.metadata.stage}
                      onChange={(e) => updateMetadata("stage", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select stage</option>
                      <option value="Idea Stage">Idea Stage</option>
                      <option value="MVP">MVP</option>
                      <option value="Pre-seed">Pre-seed</option>
                      <option value="Incubator">Incubator</option>
                      <option value="Accelerator">Accelerator</option>
                      <option value="Seed">Seed</option>
                    </select>
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Input
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      placeholder="e.g. Fintech, EdTech"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>One-liner Description</Label>
                    <Input
                      value={form.metadata.oneLiner}
                      onChange={(e) => updateMetadata("oneLiner", e.target.value)}
                      placeholder="What are they building? (one sentence)"
                    />
                  </div>
                  <div>
                    <Label>LinkedIn (optional)</Label>
                    <Input
                      value={form.metadata.linkedin}
                      onChange={(e) => updateMetadata("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <Label>Website (optional)</Label>
                    <Input
                      value={form.metadata.website}
                      onChange={(e) => updateMetadata("website", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {/* Content Sections */}
            <fieldset className="space-y-4 rounded-xl border border-border p-4 sm:p-6 bg-card">
              <legend className="px-2 text-sm font-semibold text-foreground">
                Content Sections
              </legend>

              {form.content.map((section, sIdx) => {
                const isCollapsed = collapsedSections.has(sIdx);
                return (
                  <div
                    key={sIdx}
                    className="rounded-lg border border-border/60 bg-background"
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                      <span className="text-xs font-medium text-muted-foreground flex-1">
                        Section {sIdx + 1}
                        {section.heading && ` — ${section.heading}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveSection(sIdx, -1)}
                        disabled={sIdx === 0}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveSection(sIdx, 1)}
                        disabled={sIdx === form.content.length - 1}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleCollapse(sIdx)}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronUp className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeSection(sIdx)}
                        disabled={form.content.length <= 1}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Section body */}
                    {!isCollapsed && (
                      <div className="p-3 space-y-3">
                        <div>
                          <Label className="text-xs">Heading</Label>
                          <Input
                            value={section.heading}
                            onChange={(e) =>
                              updateSection(sIdx, { heading: e.target.value })
                            }
                            placeholder="Section heading (optional)"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pull Quote</Label>
                          <Textarea
                            value={section.pullQuote}
                            onChange={(e) =>
                              updateSection(sIdx, { pullQuote: e.target.value })
                            }
                            placeholder="Highlighted quote (optional)"
                            className="min-h-[50px]"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs">Paragraphs</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-[0.65rem]"
                              onClick={() => addParagraph(sIdx)}
                            >
                              <Plus className="h-3 w-3 mr-0.5" /> Paragraph
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {section.paragraphs.map((para, pIdx) => (
                              <div key={pIdx} className="flex gap-2">
                                <Textarea
                                  value={para}
                                  onChange={(e) =>
                                    updateParagraph(sIdx, pIdx, e.target.value)
                                  }
                                  placeholder={`Paragraph ${pIdx + 1}`}
                                  className="min-h-[60px] flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive shrink-0 mt-1"
                                  onClick={() => removeParagraph(sIdx, pIdx)}
                                  disabled={section.paragraphs.length <= 1}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <Button variant="outline" className="w-full" onClick={addSection}>
                <Plus className="h-4 w-4 mr-1" /> Add Section
              </Button>
            </fieldset>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ArticleEditor;
