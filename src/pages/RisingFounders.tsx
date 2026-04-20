import { useState, useEffect } from "react";
import { usePageSEO } from "@/hooks/use-page-seo";

import { Search, X, Rocket, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import FounderApplicationForm from "@/components/FounderApplicationForm";

const stages = ["All", "Idea Stage", "MVP", "Pre-seed", "Incubator", "Accelerator", "Seed"];
const industries = ["All", "Gaming", "Healthcare", "Biotech", "Fintech", "E-Commerce", "EdTech", "Consultancy", "SaaS", "AI"];

interface RisingFounder {
  slug: string;
  title: string;
  category: string | null;
  excerpt: string | null;
  metadata: {
    founder: string;
    company: string;
    stage: string;
    oneLiner: string;
    linkedin?: string;
    website?: string;
  } | null;
}

const RisingFounders = () => {
  const [founders, setFounders] = useState<RisingFounder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStage, setActiveStage] = useState("All");
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  usePageSEO({
    title: "Rising Founders",
    description: "Discover early-stage entrepreneurs building the next wave of innovation in Saudi Arabia. MVP builders, incubator startups, and rising talent.",
    path: "/rising-founders",
  });

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("slug, title, category, excerpt, metadata")
          .eq("type", "rising_founder" as any)
          .eq("status", "public")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setFounders((data as unknown as RisingFounder[]) || []);
      } catch (err) {
        console.error("Failed to fetch rising founders:", err);
        // Retry once after 2 seconds
        setTimeout(async () => {
          try {
            const { data } = await supabase
              .from("articles")
              .select("slug, title, category, excerpt, metadata")
              .eq("type", "rising_founder" as any)
              .eq("status", "public")
              .order("created_at", { ascending: false });
            setFounders((data as unknown as RisingFounder[]) || []);
          } catch (retryErr) {
            console.error("Retry failed:", retryErr);
          }
          setLoading(false);
        }, 2000);
        return;
      }
      setLoading(false);
    };
    fetchFounders();
  }, []);

  const filtered = founders.filter((f) => {
    const meta = f.metadata;
    const stage = meta?.stage || "";
    const matchesStage = activeStage === "All" || stage === activeStage;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesStage;
    const searchable = `${meta?.founder} ${meta?.company} ${f.title} ${f.category} ${stage}`.toLowerCase();
    return matchesStage && searchable.includes(q);
  });

  return (
    <>
      {/* Hero — compact on mobile */}
      <section className="relative overflow-hidden py-5 sm:py-16 md:py-24">
        <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
        <div className="px-4 sm:container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h1 className="font-display text-xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                Rising <span className="gradient-text">Founders</span>
              </h1>
              <p className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-5">
                Meet the entrepreneurs just getting started — building MVPs, joining incubators, and shaping the future.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowApplicationForm(true)}
                className="gap-1 h-7 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-4 mb-3 sm:mb-8"
              >
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Get Featured
              </Button>

              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search founder, company, or industry..."
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stage Filters */}
      <section className="border-b border-border sticky top-16 bg-background/80 backdrop-blur-xl z-40">
        <div className="px-4 sm:container">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-2.5 sm:py-3 no-scrollbar">
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeStage === stage
                    ? "gradient-bg text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Grid */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="px-4 sm:container">
          {loading && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">Loading rising founders...</p>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm sm:text-base">
                No rising founders found{searchQuery && <> for "<span className="font-medium text-foreground">{searchQuery}</span>"</>}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveStage("All"); }}
                className="mt-3 text-primary text-sm font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {filtered.map((founder, i) => {
              const meta = founder.metadata;
              return (
              <Link key={founder.slug} to={`/stories/${founder.slug}`}>
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-5 sm:p-6 bg-card h-full"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                        {meta?.founder?.[0] || "?"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight">
                          {meta?.founder}
                        </h3>
                        <p className="text-xs text-muted-foreground">{meta?.company}</p>
                      </div>
                    </div>
                    {meta?.linkedin && (
                      <a
                        href={meta.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                        aria-label="LinkedIn"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex gap-1.5 mb-3">
                    {meta?.stage && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[0.6rem] sm:text-[0.65rem] font-semibold gradient-bg text-primary-foreground">
                        {meta.stage}
                      </span>
                    )}
                    {founder.category && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[0.6rem] sm:text-[0.65rem] font-medium bg-muted text-muted-foreground">
                        {founder.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    {meta?.oneLiner || founder.excerpt}
                  </p>
                </motion.div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>
      <FounderApplicationForm
        open={showApplicationForm}
        onOpenChange={setShowApplicationForm}
        defaultFeatureType="rising_founder"
      />
    </>
  );
};

export default RisingFounders;
