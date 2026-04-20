import { useState, useEffect } from "react";
import { usePageSEO } from "@/hooks/use-page-seo";

import { ArrowRight, Search, X, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import FounderApplicationForm from "@/components/FounderApplicationForm";

const industries = ["All", "Gaming", "Healthcare", "Biotech", "Fintech", "E-Commerce", "EdTech", "Consultancy"];

interface StoryItem {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  metadata: Record<string, any> | null;
}

const FounderStories = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  usePageSEO({
    title: "Founder Stories",
    description: "Real journeys from entrepreneurs building the future of Saudi Arabia. Gaming, healthcare, fintech, and more.",
    path: "/stories",
  });

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("slug, title, excerpt, category, metadata")
          .eq("type", "founder_story")
          .eq("status", "public")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setStories((data as StoryItem[] | null) || []);
      } catch (err) {
        console.error("Failed to fetch founder stories:", err);
        // Retry once after 2 seconds
        setTimeout(async () => {
          try {
            const { data } = await supabase
              .from("articles")
              .select("slug, title, excerpt, category, metadata")
              .eq("type", "founder_story")
              .eq("status", "public")
              .order("created_at", { ascending: false });
            setStories((data as StoryItem[] | null) || []);
          } catch (retryErr) {
            console.error("Retry failed:", retryErr);
          }
          setLoading(false);
        }, 2000);
        return;
      }
      setLoading(false);
    };
    fetchStories();
  }, []);

  const fuzzyMatch = (text: string, query: string): boolean => {
    const t = text.toLowerCase();
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return words.every((word) => {
      if (t.includes(word)) return true;
      const tokens = t.split(/\s+/);
      return tokens.some((token) => {
        if (Math.abs(token.length - word.length) > 1) return false;
        let diffs = 0;
        const len = Math.max(token.length, word.length);
        for (let i = 0; i < len; i++) {
          if (token[i] !== word[i]) diffs++;
          if (diffs > 1) return false;
        }
        return true;
      });
    });
  };

  const filtered = stories.filter((s) => {
    const meta = s.metadata as Record<string, any> | null;
    const founder = meta?.founder || "";
    const company = meta?.company || "";
    const industry = s.category || "";

    const matchesIndustry = activeFilter === "All" || industry === activeFilter;
    const q = searchQuery.trim();
    if (!q) return matchesIndustry;
    const searchable = `${founder} ${company} ${s.title} ${industry}`;
    return matchesIndustry && fuzzyMatch(searchable, q);
  });

  return (
    <>
      {/* Hero — compact on mobile */}
      <section className="relative overflow-hidden py-5 sm:py-16 md:py-24">
        <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
        <div className="px-4 sm:container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
              Founder <span className="gradient-text">Stories</span>
            </h1>
            <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-8">
              Real journeys from entrepreneurs building the future of Saudi Arabia.
            </p>
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-8">
              <Link
                to="/rising-founders"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:underline"
              >
                <Rocket className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Rising Founders
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
              <span className="text-border">|</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowApplicationForm(true)}
                className="gap-1 h-7 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-4"
              >
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Get Featured
              </Button>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by founder, company, or story..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-9 sm:h-11 rounded-full border-border/60 bg-card shadow-sm focus-visible:ring-primary/30 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border sticky top-16 bg-background/80 backdrop-blur-xl z-40">
        <div className="px-4 sm:container">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-2.5 sm:py-3 no-scrollbar">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setActiveFilter(industry)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === industry
                    ? "gradient-bg text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="px-4 sm:container">
          <div className="grid gap-5 sm:gap-8 max-w-4xl mx-auto">
            {loading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">Loading stories...</p>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm sm:text-base">
                  No stories found{searchQuery && <> for "<span className="font-medium text-foreground">{searchQuery}</span>"</>}
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                  className="mt-3 text-primary text-sm font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
            {filtered.map((story) => {
              const meta = story.metadata as Record<string, any> | null;
              const founder = meta?.founder || "";
              const company = meta?.company || "";
              return (
                <Link key={story.slug} to={`/stories/${story.slug}`}>
                  <div className="group rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-5 sm:p-8 md:p-10 bg-card">
                    <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[0.65rem] sm:text-xs font-medium gradient-bg text-primary-foreground mb-3 sm:mb-4">
                      {story.category}
                    </span>
                    <h2 className="font-display text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight">
                      {story.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-5">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{founder}</span> · {company}
                      </p>
                      <span className="text-primary flex items-center gap-1 text-xs sm:text-sm font-medium sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        Read Story <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <FounderApplicationForm
        open={showApplicationForm}
        onOpenChange={setShowApplicationForm}
        defaultFeatureType="founder_story"
      />
    </>
  );
};

export default FounderStories;
