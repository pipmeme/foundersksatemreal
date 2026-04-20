import { useState } from "react";
import { motion } from "framer-motion";

import { usePageSEO } from "@/hooks/use-page-seo";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Crown,
  Home,
  Briefcase,
  Rocket,
  Building2,
  GraduationCap,
  Palette,
  TrendingUp,
  CheckCircle2,
  Users,
  Plane,
  ShieldCheck,
  Mail,
  ExternalLink,
  ChevronDown,
  Star,
  Clock,
  Banknote,
  FileCheck,
  Send,
  Award,
} from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

/* ─── Data ─── */

const privileges = [
  { icon: Users, label: "Family Sponsorship" },
  { icon: Briefcase, label: "100% Business Ownership" },
  { icon: Home, label: "Property Ownership" },
  { icon: Plane, label: "Visa-Free Travel" },
  { icon: ShieldCheck, label: "No Expat Levies" },
  { icon: TrendingUp, label: "Career Freedom" },
];

interface Pathway {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  cost: string;
  duration: string;
  bestFor: string;
  requirements: string[];
  highlight?: boolean;
}

const pathways: Pathway[] = [
  {
    icon: Clock,
    title: "Limited Duration",
    subtitle: "Flexible",
    color: "from-amber-500 to-yellow-400",
    cost: "SAR 100K/yr",
    duration: "Annual renewal",
    bestFor: "Professionals on contracts",
    requirements: ["Pay-as-you-go annual model", "Full privileges while active", "Renew each year"],
  },
  {
    icon: Star,
    title: "Unlimited Duration",
    subtitle: "Permanent",
    color: "from-violet-500 to-purple-400",
    cost: "SAR 800K once",
    duration: "Lifetime",
    bestFor: "Individuals seeking permanent home",
    requirements: ["One-time payment", "No renewal needed", "Lifetime validity"],
    highlight: true,
  },
  {
    icon: Rocket,
    title: "Entrepreneur",
    subtitle: "For Founders",
    color: "from-emerald-500 to-teal-400",
    cost: "SAR 400K–15M",
    duration: "5yr → Permanent",
    bestFor: "Startup founders in KSA",
    requirements: [
      "Cat A: SAR 400K investment + 20% equity → 5yr",
      "Cat B: SAR 15M + 10% equity + 10 jobs → Permanent",
    ],
  },
  {
    icon: Building2,
    title: "Real Estate Owner",
    subtitle: "Property",
    color: "from-sky-500 to-blue-400",
    cost: "Property ≥ SAR 4M",
    duration: "Tied to ownership",
    bestFor: "Property owners in KSA",
    requirements: ["Own developed residential property ≥ SAR 4M", "Must be mortgage-free"],
  },
  {
    icon: GraduationCap,
    title: "Special Talent",
    subtitle: "Executives & Experts",
    color: "from-rose-500 to-pink-400",
    cost: "Salary-based",
    duration: "5yr → Permanent",
    bestFor: "Healthcare, science, leadership",
    requirements: [
      "Executives: salary > SAR 80K/mo",
      "Healthcare/Science: > SAR 35K/mo",
      "Researchers: > SAR 14K/mo + patents",
    ],
  },
  {
    icon: Palette,
    title: "Gifted",
    subtitle: "Arts & Sports",
    color: "from-orange-500 to-amber-400",
    cost: "Award-based",
    duration: "5yr → Permanent",
    bestFor: "Exceptional cultural/sports talent",
    requirements: ["Nominated/recipient of approved Exceptional Award", "Verified by Ministry of Culture or Sports"],
  },
  {
    icon: TrendingUp,
    title: "Investor",
    subtitle: "Capital Deployers",
    color: "from-indigo-500 to-violet-400",
    cost: "SAR 7M investment",
    duration: "Permanent",
    bestFor: "Major capital investors",
    requirements: ["Invest SAR 7M in KSA economic activities", "Create at least 10 jobs"],
  },
];

const steps = [
  { icon: CheckCircle2, title: "Eligibility", desc: "Age 21+, valid passport, clean record" },
  { icon: FileCheck, title: "Documents", desc: "Passport, bank statements, medical, category proofs" },
  { icon: Send, title: "Apply Online", desc: "Submit via saprc.gov.sa — SAR 4,000 fee" },
  { icon: Award, title: "Approval", desc: "Pay residency fee & receive your PR ID" },
];

const faqs = [
  { q: "Can I own property in Makkah?", a: "Yes. Muslim PR holders can buy freehold in designated zones. All PR holders get 99-year leasehold rights." },
  { q: "Does this replace my Iqama?", a: "Yes. The Premium Residency ID replaces the standard Iqama and grants full independence from any employer." },
  { q: "Can I invest in the stock market?", a: "Yes. Full access to the Saudi Stock Exchange (Tadawul) as a resident." },
];

/* ─── Pathway Row ─── */

const PathwayRow = ({ pathway, index }: { pathway: Pathway; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={Math.min(index, 3)}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full text-left rounded-2xl border transition-all group",
          pathway.highlight
            ? "border-primary/30 bg-primary/[0.03] shadow-sm"
            : "border-border/50 bg-card hover:border-primary/20",
          open && "shadow-md border-primary/30"
        )}
      >
        <div className="p-5 sm:p-6">
          {/* Top row: icon + title + cost + duration */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Left: icon + name */}
            <div className="flex items-center gap-3 sm:w-[220px] shrink-0">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pathway.color} flex items-center justify-center shrink-0`}>
                <pathway.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold leading-tight">{pathway.title}</h3>
                  {pathway.highlight && (
                    <span className="px-1.5 py-0.5 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{pathway.subtitle}</p>
              </div>
            </div>

            {/* Middle: cost + duration pills */}
            <div className="flex items-center gap-2 flex-1">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/60 text-xs font-semibold">
                <Banknote className="h-3 w-3 text-muted-foreground" />
                {pathway.cost}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/60 text-xs font-semibold">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {pathway.duration}
              </span>
            </div>

            {/* Right: chevron */}
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
          </div>

          {/* Expanded content */}
          <div className={cn("overflow-hidden transition-all duration-300", open ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0")}>
            <div className="border-t border-border/40 pt-4">
              <p className="text-xs text-muted-foreground mb-3">
                <strong className="text-foreground">Best for:</strong> {pathway.bestFor}
              </p>
              <div className="space-y-1.5">
                {pathway.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{req}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

/* ─── Page ─── */

const PremiumResidency = () => {
  usePageSEO({
    title: "Premium Residency Guide — Saudi Arabia (2026)",
    description: "The ultimate guide to Saudi Arabia's Premium Residency (Iqama Mumayza). Explore 7 pathways, privileges, real estate rights, and how to apply.",
    path: "/startup-guide/premium-residency",
  });

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full gradient-bg opacity-[0.07] blur-[120px]" />

        <div className="px-4 sm:container py-16 sm:py-24 md:py-32 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link to="/startup-guide" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Startup Guide
            </Link>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
                <Crown className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">2026 Edition</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
                Premium Residency
                <br />
                <span className="gradient-text">Iqama Mumayza</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Live, work, invest, and own assets in Saudi Arabia — <strong className="text-foreground">independently, without a sponsor</strong>. Here's everything you need to know.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Privilege Strip ── */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="px-4 sm:container py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {privileges.map((p) => (
              <div key={p.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <p.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 Pathways (stacked rows) ── */}
      <section className="py-16 sm:py-24">
        <div className="px-4 sm:container">
          <motion.div className="mb-10 sm:mb-14 max-w-2xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Choose Your Track</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              7 Pathways to Premium Residency
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Each pathway has different costs, durations, and requirements. Tap any to see full details.
            </p>
          </motion.div>

          <div className="max-w-3xl space-y-3">
            {pathways.map((p, i) => (
              <PathwayRow key={p.title} pathway={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Apply ── */}
      <section className="py-16 sm:py-24">
        <div className="px-4 sm:container">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">4 Simple Steps</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">How to Apply</h2>
          </motion.div>

          <div className="max-w-3xl">
            <div className="grid sm:grid-cols-4 gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="relative"
                >
                  <div className="rounded-xl border border-border/50 bg-card p-5 h-full text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-primary mb-1">Step {i + 1}</p>
                    <h3 className="font-display text-sm font-bold mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                  {/* Arrow connector on desktop */}
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 text-border">→</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick FAQ ── */}
      <section className="py-16 sm:py-24 bg-muted/30 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="px-4 sm:container relative">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Quick Answers</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Common Questions</h2>
          </motion.div>

          <div className="max-w-2xl space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className={cn(
                    "w-full text-left rounded-xl border bg-card p-4 sm:p-5 transition-all",
                    faqOpen === i ? "border-primary/30 shadow-md" : "border-border/50 hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-sm sm:text-base font-semibold">{faq.q}</h3>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", faqOpen === i && "rotate-180")} />
                  </div>
                  <div className={cn("overflow-hidden transition-all duration-300", faqOpen === i ? "max-h-[200px] opacity-100 mt-3" : "max-h-0 opacity-0")}>
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">{faq.a}</p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="px-4 sm:container">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

            <div className="relative p-10 sm:p-16 md:p-24 text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
                Ready to Apply?
              </h2>
              <p className="text-primary-foreground/80 text-sm sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                We specialize in Entrepreneur & Investor tracks. Let us guide you through the process.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="outline" className="bg-white text-foreground hover:bg-white/90 border-0 px-8 h-12 shadow-xl">
                  <a href="mailto:help@foundersksa.com">
                    <Mail className="mr-2 h-4 w-4" /> Get Help Applying
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-white/10 px-8 h-12">
                  <a href="https://saprc.gov.sa" target="_blank" rel="noopener noreferrer">
                    Apply on saprc.gov.sa <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PremiumResidency;
