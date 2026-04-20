import { useState, useEffect } from "react";
import { usePageSEO } from "@/hooks/use-page-seo";

import { ArrowRight, Search, X, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface InsightItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  created_at: string;
  metadata: Record<string, string> | null;
}

const categories = ["All", "Business Strategy", "Regulation", "Market Entry", "Vision 2030", "Talent"];

const Insights = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  usePageSEO({
    title: "Insights",
    description: "Strategic knowledge, regulatory breakdowns, and market intelligence for building and scaling in Saudi Arabia.",
    path: "/insights",
  });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, slug, title, excerpt, category, created_at, metadata")
        .eq("type", "insight")
        .eq("status", "public")
        .order("created_at", { ascending: false });
      setArticles((data as InsightItem[] | null) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = articles.filter((item) => {
    const matchesCategory = activeFilter === "All" || item.category === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesCategory;
    const searchable = `${item.title} ${item.category || ""} ${item.excerpt || ""}`.toLowerCase();
    return matchesCategory && searchable.includes(q);
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-24">
        <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
        <div className="px-4 sm:container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Knowledge & Analysis</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
              Strategic knowledge, regulatory breakdowns, and market intelligence for building and scaling in Saudi Arabia.
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-full border-border/60 bg-card shadow-sm focus-visible:ring-primary/30"
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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === cat
                    ? "gradient-bg text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="px-4 sm:container">
          <div className="grid gap-5 sm:gap-8 max-w-4xl mx-auto">
            {loading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">Loading insights...</p>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm sm:text-base">
                  No insights found
                  {searchQuery && (
                    <> for "<span className="font-medium text-foreground">{searchQuery}</span>"</>
                  )}
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                  className="mt-3 text-primary text-sm font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
            {filtered.map((insight) => {
              const meta = insight.metadata as Record<string, string> | null;
              const readTime = meta?.readTime || "5 min read";
              return (
                <Link key={insight.id} to={`/insights/${insight.slug}`}>
                  <div className="group rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-5 sm:p-8 md:p-10 bg-card">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[0.65rem] sm:text-xs font-medium gradient-bg text-primary-foreground">
                        {insight.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {readTime}
                      </span>
                    </div>
                    <h2 className="font-display text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight">
                      {insight.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-5">
                      {insight.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(insight.created_at).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                      <span className="text-primary flex items-center gap-1 text-xs sm:text-sm font-medium sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        Read More <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Insights;
