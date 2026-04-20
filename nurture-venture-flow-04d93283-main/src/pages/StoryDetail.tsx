import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { ArrowLeft, Share2 } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { usePageSEO } from "@/hooks/use-page-seo";
import { toast } from "sonner";
import { getShareUrl } from "@/lib/share";
import { supabase } from "@/integrations/supabase/client";
import FounderTimeline, { type TimelineMilestone } from "@/components/FounderTimeline";

// Founder photos mapped by slug
import duwitStudioPhoto from "@/assets/founders/duwit-studio.png";
import sabahjarStudioPhoto from "@/assets/founders/sabahjar-studio.png";
import ceciliaPitrePhoto from "@/assets/founders/cecilia-pitre.jpg";
const founderPhotos: Record<string, { src: string; caption: string }> = {
  "duwit-studio": { src: duwitStudioPhoto, caption: "The Duwit Studio team showcasing their games at Saudi Game Champions 2" },
  "sabahjar-studio": { src: sabahjarStudioPhoto, caption: "The Sabahjar Studio team collaborating at SGC2, Saudi Game Center" },
  "cecilia-pitre-bridging-global-business-saudi-culture": { src: ceciliaPitrePhoto, caption: "Cécilia Pitré in Riyadh — bridging global business and Saudi culture" },
};

interface StorySection {
  heading?: string;
  paragraphs: string[];
  pullQuote?: string;
}

interface StoryData {
  title: string;
  category: string | null;
  content: StorySection[];
  metadata: {
    founder: string;
    company: string;
    intro: string;
    milestones: TimelineMilestone[];
  };
}

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.5, ease: "easeOut" as const },
  }),
};

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("title, category, content, metadata")
        .eq("slug", id || "")
        .in("type", ["founder_story", "rising_founder"] as any)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setStory({
          title: data.title,
          category: data.category,
          content: data.content as unknown as StorySection[],
          metadata: data.metadata as unknown as StoryData["metadata"],
        });
      }
      setLoading(false);
    };
    fetchStory();
  }, [id]);

  usePageSEO(story ? {
    title: `${story.title} — ${story.metadata.founder}`,
    description: story.metadata.intro?.slice(0, 155) || `Read the founder story of ${story.metadata.founder} from ${story.metadata.company}.`,
    path: `/stories/${id}`,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": story.title,
      "author": { "@type": "Person", "name": story.metadata.founder },
      "publisher": { "@type": "Organization", "name": "Founders KSA", "logo": { "@type": "ImageObject", "url": "https://foundersksa.com/logo.png" } },
      "mainEntityOfPage": `https://foundersksa.com/stories/${id}`,
    },
  } : {});

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading...</div>
    );
  }

  if (notFound || !story) {
    return <Navigate to="/stories" replace />;
  }

  const { metadata } = story;

  return (
    <>
      <article>
        {/* Hero header */}
        <header className="relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12 md:pt-16 md:pb-20">
          <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" animate="visible">
              <motion.div variants={fadeUp} custom={0}>
                <Link
                  to="/stories"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors mb-5 sm:mb-8 group"
                >
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Stories
                </Link>
              </motion.div>

              <motion.span
                variants={fadeUp}
                custom={0.5}
                className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[0.65rem] sm:text-xs font-semibold tracking-wide uppercase gradient-bg text-primary-foreground mb-3 sm:mb-5"
              >
                {story.category}
              </motion.span>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.2] sm:leading-[1.15] tracking-tight mb-4 sm:mb-6"
              >
                {story.title}
              </motion.h1>

              <motion.div
                variants={fadeUp}
                custom={1.5}
                className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm shrink-0">
                  {metadata.founder[0]}
                </div>
                <div>
                  <span className="font-semibold text-foreground">{metadata.founder}</span>
                  <span className="mx-1 sm:mx-1.5 opacity-40">·</span>
                  <span>{metadata.company}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* Share Bar */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-xs text-muted-foreground">Share</span>
            <div className="flex items-center gap-1.5">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${story.title} ${getShareUrl(`/stories/${id}`)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <button
                onClick={async () => {
                  const shareUrl = getShareUrl(`/stories/${id}`);
                  if (navigator.share) {
                    try { await navigator.share({ title: story.title, url: shareUrl }); } catch {}
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied!");
                  }
                }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Founder Photo */}
        {id && founderPhotos[id] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-border/30">
              <img
                src={founderPhotos[id].src}
                alt={founderPhotos[id].caption}
                className="w-full h-auto object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-2.5 left-3.5 right-3.5 text-[0.6rem] sm:text-xs text-white/85 font-medium tracking-wide">
                {founderPhotos[id].caption}
              </p>
            </div>
          </motion.div>
        )}

        {/* Body */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-16">
          {/* Intro */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={sectionVariant}
            custom={0}
            className="text-base sm:text-lg md:text-xl text-foreground/90 leading-[1.7] sm:leading-relaxed font-medium mb-8 sm:mb-12 md:mb-16"
          >
            {metadata.intro}
          </motion.p>

          {/* Editorial chapter strip — hooks the reader before the article */}
          {metadata.milestones && metadata.milestones.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-10 sm:mb-14 md:mb-16"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-border" />
                <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  A story in {metadata.milestones.length} chapters
                </p>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4">
                {metadata.milestones.map((m: TimelineMilestone, i: number) => (
                  <div key={i} className="group relative">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="font-display text-[0.65rem] sm:text-xs font-bold text-primary/40 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                        {m.year}
                      </span>
                    </div>
                    <p className="font-display text-xs sm:text-sm font-semibold text-foreground leading-snug border-t-2 border-primary/30 pt-1.5 group-hover:border-primary transition-colors">
                      {m.title}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sections */}
          {story.content.map((section, i) => (
            <motion.section
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={sectionVariant}
              custom={i + 1}
              className="mb-8 sm:mb-12 md:mb-16 last:mb-0"
            >
              {section.heading && (
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-5 tracking-tight">
                  {section.heading}
                </h2>
              )}

              {section.pullQuote && (
                <blockquote className="relative my-5 sm:my-8 pl-4 sm:pl-6 border-l-2 sm:border-l-[3px] border-primary/40">
                  <p className="text-sm sm:text-base md:text-lg italic text-foreground/80 leading-relaxed font-medium">
                    &ldquo;{section.pullQuote}&rdquo;
                  </p>
                </blockquote>
              )}

              <div className="space-y-4 sm:space-y-5">
                {section.paragraphs.map((para, j) => (
                  <p
                    key={j}
                    className="text-sm sm:text-[0.95rem] md:text-base text-foreground/80 leading-[1.75] sm:leading-[1.8] md:leading-[1.85]"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}

          {/* At a glance — recap timeline */}
          {metadata.milestones && metadata.milestones.length > 0 && (
            <div className="mt-10 sm:mt-14 md:mt-20 pt-8 sm:pt-10 border-t border-border/50">
              <FounderTimeline milestones={metadata.milestones} />
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariant}
            custom={0}
            className="rounded-xl sm:rounded-2xl bg-muted/50 border border-border/50 p-5 sm:p-6 md:p-8 text-center"
          >
            <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              Inspired by this story? Explore more founder journeys.
            </p>
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 font-semibold text-xs sm:text-sm text-primary hover:underline underline-offset-4 transition-all"
            >
              Read more stories <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-180" />
            </Link>
          </motion.div>
        </div>
      </article>
    </>
  );
};

export default StoryDetail;
