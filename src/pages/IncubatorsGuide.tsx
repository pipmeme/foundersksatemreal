import { useState } from "react";
import { motion } from "framer-motion";

import { usePageSEO } from "@/hooks/use-page-seo";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  Landmark,
  Rocket,
  Globe,
  MapPin,
  Users,
  Banknote,
  ExternalLink,
  ChevronDown,
  Cpu,
  Leaf,
  Shield,
  Zap,
  Mail,
  Search,
  Filter,
  Clock,
  Percent,
  CalendarDays,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LucideIcon } from "lucide-react";

/* ─── Types & Data ─── */

type ProgramType = "accelerator" | "incubator" | "venture-studio" | "fund";
type BackingType = "government" | "corporate" | "university" | "private";

interface ApplicationInfo {
  equity: string;
  duration: string;
  funding: string;
  eligibility: string[];
  applicationWindow: string;
  howToApply: string;
}

interface Program {
  name: string;
  type: ProgramType;
  backing: BackingType;
  city: string;
  description: string;
  sectors: string[];
  highlights: string[];
  application: ApplicationInfo;
  website?: string;
  icon: LucideIcon;
  color: string;
}

const programs: Program[] = [
  {
    name: "Badir Program (KACST)",
    type: "incubator",
    backing: "government",
    city: "Riyadh",
    description:
      "A national tech incubation program by King Abdulaziz City for Science and Technology (KACST). Badir supports technology-based startups from idea to scale, providing workspace, mentorship, training, and access to funding networks.",
    sectors: ["Technology", "ICT", "Manufacturing", "Energy"],
    highlights: [
      "600+ startups incubated",
      "SAR 3B+ in combined revenues generated",
      "Multiple sector-specific tracks",
      "Nationwide reach across Saudi Arabia",
    ],
    application: {
      equity: "0% — No equity taken",
      duration: "6–12 months (varies by track)",
      funding: "No direct funding; connects to investor networks",
      eligibility: [
        "Saudi nationals or residents with tech-based ideas",
        "Startup must be in ideation or early stage",
        "Must operate in tech, ICT, manufacturing, or energy sectors",
      ],
      applicationWindow: "Rolling applications — apply any time",
      howToApply: "Apply online at badir.com.sa; reviewed on a rolling basis",
    },
    website: "https://badir.com.sa",
    icon: Rocket,
    color: "from-emerald-500 to-teal-400",
  },
  {
    name: "Wa'ed Ventures (Aramco)",
    type: "incubator",
    backing: "corporate",
    city: "Dhahran",
    description:
      "Saudi Aramco's entrepreneurship center, providing loans, venture capital, incubation, and mentoring for Saudi founders and SMEs. Wa'ed supports startups across diverse sectors to create jobs and drive economic diversification.",
    sectors: ["Energy", "Industrial", "Technology", "Sustainability"],
    highlights: [
      "SAR 3B+ in total funding deployed",
      "Backed by Saudi Aramco",
      "Loans, VC, and incubation tracks",
      "Focus on job creation & Vision 2030",
    ],
    application: {
      equity: "Varies by track — VC investments take equity; loans do not",
      duration: "Ongoing support (no fixed cohort length)",
      funding: "$200M+ total fund; ticket sizes from $500K–$5M for VC",
      eligibility: [
        "Saudi-based or co-founded startups",
        "Must demonstrate job creation potential",
        "Open to various sectors, particularly industrial & tech",
      ],
      applicationWindow: "Rolling applications",
      howToApply: "Apply through waed.net; separate tracks for loans, VC, and incubation",
    },
    website: "https://waed.net",
    icon: Banknote,
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Monsha'at (SME Authority)",
    type: "accelerator",
    backing: "government",
    city: "Riyadh",
    description:
      "The government authority responsible for developing Saudi Arabia's SME and entrepreneurship ecosystem. Monsha'at runs and partners on various incubators, accelerators, and support programs across the Kingdom.",
    sectors: ["All Sectors", "SMEs", "Entrepreneurship"],
    highlights: [
      "Government-backed national authority",
      "Multiple accelerator & incubator programs",
      "University Startup Accelerator with CREEDA",
      "Business development & funding access",
    ],
    application: {
      equity: "0% — Government support programs",
      duration: "Varies by program (3–12 months)",
      funding: "Grants and soft loans through various programs",
      eligibility: [
        "Saudi SMEs and entrepreneurs",
        "Program-specific criteria apply",
        "Some programs open to all sectors",
      ],
      applicationWindow: "Program-dependent — check monshaat.gov.sa",
      howToApply: "Browse programs at monshaat.gov.sa and apply to specific ones",
    },
    website: "https://monshaat.gov.sa",
    icon: Landmark,
    color: "from-violet-500 to-purple-400",
  },
  {
    name: "KAUST Entrepreneurship & TAQADAM",
    type: "accelerator",
    backing: "university",
    city: "Thuwal",
    description:
      "KAUST's Entrepreneurship Center and the TAQADAM Accelerator focus on deep-tech and science-based ventures. The program provides mentorship, funding, and access to KAUST's world-class labs and research talent.",
    sectors: ["Deep Tech", "Energy", "Water", "Healthcare", "ICT"],
    highlights: [
      "Access to KAUST's $20B+ endowment ecosystem",
      "Lab access & research collaboration",
      "KAUST Innovation Fund for follow-on investment",
      "Ideal for IP-heavy, science-based startups",
    ],
    application: {
      equity: "Equity-free in accelerator; KAUST Innovation Fund invests separately",
      duration: "6 months",
      funding: "Up to $40,000 per team",
      eligibility: [
        "Open to founders globally — no nationality restriction",
        "Must have a technology or science-based venture",
        "Teams at any stage (idea to growth)",
      ],
      applicationWindow: "Annual cohorts — applications typically open Q4",
      howToApply: "Apply at innovation.kaust.edu.sa/taqadam",
    },
    website: "https://innovation.kaust.edu.sa",
    icon: GraduationCap,
    color: "from-amber-500 to-orange-400",
  },
  {
    name: "Misk Accelerator",
    type: "accelerator",
    backing: "private",
    city: "Riyadh",
    description:
      "A 12-week hybrid tech accelerator by the Misk Foundation supporting early-stage startups from across MENA. The program has supported nearly 200 startups, many of which raised follow-on funding.",
    sectors: ["Technology", "EdTech", "Social Impact"],
    highlights: [
      "~200 startups supported",
      "12-week hybrid program",
      "MENA-wide cohorts based in Riyadh",
      "Strong investor networking events",
    ],
    application: {
      equity: "0% — Zero equity accelerator",
      duration: "3 months (12 weeks)",
      funding: "No direct funding; mentorship, perks, and investor access",
      eligibility: [
        "Seed-stage tech startups",
        "Must have an MVP or early traction",
        "Open to MENA-based founders",
      ],
      applicationWindow: "Cohort-based — applications open ~2x per year",
      howToApply: "Apply through hub.misk.org.sa; selection via interviews",
    },
    website: "https://misk.org.sa",
    icon: Users,
    color: "from-rose-500 to-pink-400",
  },
  {
    name: "Flat6Labs",
    type: "accelerator",
    backing: "private",
    city: "Jeddah & Riyadh",
    description:
      "A leading regional seed investor and accelerator with programs in Jeddah and Riyadh. Selected founders receive seed funding, structured mentorship, and access to Flat6Labs' extensive MENA network. The Riyadh Seed Program has accelerated 60+ startups and deployed $17M+.",
    sectors: ["Technology", "FinTech", "E-Commerce", "SaaS"],
    highlights: [
      "60+ startups accelerated in Riyadh alone",
      "$17M+ deployed, $38M+ in follow-on funding",
      "Active in Jeddah & Riyadh",
      "Most active VC in KSA for 3 consecutive years",
    ],
    application: {
      equity: "Equity taken in exchange for seed funding (terms vary)",
      duration: "4–6 months per cycle",
      funding: "Seed funding per startup (amount varies by program)",
      eligibility: [
        "Early-stage startups with a working product or strong prototype",
        "Tech-enabled business model",
        "Saudi-based or willing to relocate",
      ],
      applicationWindow: "Multiple cycles per year — check flat6labs.com",
      howToApply: "Apply at flat6labs.com/program/riyadh-seed-program-page",
    },
    website: "https://flat6labs.com",
    icon: Zap,
    color: "from-sky-500 to-blue-400",
  },
  {
    name: "InspireU (stc)",
    type: "accelerator",
    backing: "corporate",
    city: "Riyadh",
    description:
      "stc's digital accelerator that has supported 90+ ventures with a combined valuation of SAR 12B+ since 2017. Includes specialized tracks for cybersecurity, AI, gaming, IoT, and blockchain. Now on its 11th intake.",
    sectors: ["Cybersecurity", "AI", "Gaming", "IoT", "Blockchain"],
    highlights: [
      "90+ ventures supported since 2017",
      "SAR 12B+ combined portfolio valuation",
      "Sector-specific specialized tracks",
      "Competitive financial grants from stc",
    ],
    application: {
      equity: "0% — Grant-based; no equity taken",
      duration: "3–6 months per intake",
      funding: "Financial grants (amount varies by track and stage)",
      eligibility: [
        "Early-stage digital/tech startups",
        "Must align with stc's focus sectors (AI, cybersecurity, IoT, gaming, blockchain)",
        "Saudi-based or willing to operate from Riyadh",
      ],
      applicationWindow: "Intake-based — currently on Intake 11",
      howToApply: "Apply at stc.com/inspire-u/apply-now",
    },
    website: "https://inspireu.stc.com.sa",
    icon: Shield,
    color: "from-indigo-500 to-violet-400",
  },
  {
    name: "Riyadh Techstars Accelerator",
    type: "accelerator",
    backing: "private",
    city: "Riyadh",
    description:
      "A Techstars program in partnership with MCIT, Raed Ventures, and Saudi National Bank. Offers structured mentorship, investor access, and connection to Techstars' global network of 3,800+ companies.",
    sectors: ["Technology", "FinTech", "HealthTech", "AI"],
    highlights: [
      "Part of global Techstars network (3,800+ companies)",
      "$120K investment per startup",
      "90-day intensive program",
      "Access to global mentor network",
    ],
    application: {
      equity: "~6–9% equity for $120,000 investment",
      duration: "90 days (13 weeks)",
      funding: "$120,000 per startup + $4M+ in perks",
      eligibility: [
        "High-potential startups from MENA region",
        "Must have a product and some traction",
        "Willing to be based in Riyadh for 90 days",
      ],
      applicationWindow: "Annual cohorts — applications open mid-year",
      howToApply: "Apply at techstars.com; highly competitive selection",
    },
    website: "https://techstars.com",
    icon: Globe,
    color: "from-red-500 to-rose-400",
  },
  {
    name: "Oxagon Accelerator (NEOM)",
    type: "accelerator",
    backing: "government",
    city: "NEOM",
    description:
      "NEOM's program for Saudi-based or co-founded early-stage startups in advanced industries. A 12-week hybrid program offering mentorship, pilot opportunities, and access to NEOM's innovation ecosystem. Powered by Blossom.",
    sectors: ["Robotics", "AI", "Green Hydrogen", "Water", "Supply Chain"],
    highlights: [
      "Part of NEOM's $500B megaproject",
      "12-week hybrid program",
      "Pilot opportunities within NEOM",
      "Focus on sustainability & advanced tech",
    ],
    application: {
      equity: "Non-dilutive — no equity taken",
      duration: "12 weeks",
      funding: "Mentorship, pilot access, and resources (no cash investment)",
      eligibility: [
        "Saudi-based or Saudi co-founded startups",
        "Early-stage with a working prototype",
        "Must solve challenges in NEOM's target sectors",
      ],
      applicationWindow: "Cohort-based — check neom.com for open calls",
      howToApply: "Apply through neom.com/oxagon/accelerators",
    },
    website: "https://neom.com",
    icon: Leaf,
    color: "from-lime-500 to-emerald-400",
  },
  {
    name: "BIAC (Business Incubators & Accelerators Co.)",
    type: "incubator",
    backing: "government",
    city: "Riyadh",
    description:
      "Designs and operates incubators and accelerators that support technology ventures in Saudi Arabia. Partners with universities and government entities to help founders commercialize their ideas.",
    sectors: ["Technology", "Innovation", "Research Commercialization"],
    highlights: [
      "Subsidiary of Saudi Technology Development Fund",
      "University & government partnerships",
      "Workspace, mentoring & advisory services",
      "Focus on tech commercialization",
    ],
    application: {
      equity: "Varies by program",
      duration: "6–18 months",
      funding: "Support services; some programs offer seed funding",
      eligibility: [
        "Tech-based ventures with commercialization potential",
        "University researchers and graduates welcome",
        "Must be willing to operate in Saudi Arabia",
      ],
      applicationWindow: "Rolling applications",
      howToApply: "Apply through tasama.com.sa",
    },
    website: "https://tasama.com.sa",
    icon: Building2,
    color: "from-teal-500 to-cyan-400",
  },
  {
    name: "Sanabil Venture Studio",
    type: "venture-studio",
    backing: "private",
    city: "Riyadh",
    description:
      "Partners with founders to build new ventures in sectors like e-commerce, fintech, and AI. Supports teams with product development, validation, and fundraising to scale faster in the Saudi market.",
    sectors: ["E-Commerce", "FinTech", "AI"],
    highlights: [
      "Venture studio model (co-building)",
      "Backed by Sanabil Investments (PIF)",
      "Product development & fundraising support",
      "Focus on high-growth Saudi sectors",
    ],
    application: {
      equity: "Co-founding model — significant equity stake",
      duration: "Ongoing (venture studio model)",
      funding: "Pre-seed to seed; funding and operational support",
      eligibility: [
        "Experienced founders or domain experts",
        "Must be willing to co-build with Sanabil team",
        "Focus on Saudi market opportunities",
      ],
      applicationWindow: "By invitation / direct outreach",
      howToApply: "Reach out via LinkedIn or industry connections",
    },
    icon: Cpu,
    color: "from-fuchsia-500 to-pink-400",
  },
  {
    name: "AstroLabs",
    type: "incubator",
    backing: "private",
    city: "Riyadh",
    description:
      "A Google-partnered tech hub licensed in Saudi Arabia. Supports founders through co-working, training, and programs like the Mega Green Accelerator for sustainability-focused startups.",
    sectors: ["Technology", "Sustainability", "Digital"],
    highlights: [
      "Google-partnered tech hub",
      "Co-working, training & acceleration",
      "Mega Green Accelerator program",
      "Strong international founder community",
    ],
    application: {
      equity: "0% — No equity for co-working; accelerator terms vary",
      duration: "Membership-based; accelerator programs 3–6 months",
      funding: "Some programs offer grants; co-working is paid",
      eligibility: [
        "International and local founders welcome",
        "Must be in tech or sustainability sectors",
        "For Mega Green: sustainability-focused ventures",
      ],
      applicationWindow: "Co-working: anytime; Accelerators: cohort-based",
      howToApply: "Apply at astrolabs.com",
    },
    website: "https://astrolabs.com",
    icon: Globe,
    color: "from-orange-500 to-amber-400",
  },
  {
    name: "Misk500 (Misk × 500 Global)",
    type: "accelerator",
    backing: "private",
    city: "Riyadh",
    description:
      "A MENA-focused accelerator run by Misk Innovation and 500 Global. The 14–16 week program targets early-stage, tech-enabled startups with intensive mentorship, growth training, and ~$50K in funding.",
    sectors: ["Technology", "Consumer", "B2B SaaS"],
    highlights: [
      "~$50K funding per startup",
      "14–16 week intensive program",
      "Partnership with 500 Global network",
      "MENA-focused cohorts",
    ],
    application: {
      equity: "Equity taken in exchange for funding (~$50K)",
      duration: "14–16 weeks",
      funding: "~$50,000 per startup",
      eligibility: [
        "Early-stage, tech-enabled startups",
        "Must have a product and initial traction",
        "MENA-based founders or willing to relocate",
      ],
      applicationWindow: "Annual cohorts",
      howToApply: "Apply through 500.co or Misk Innovation portal",
    },
    icon: Rocket,
    color: "from-purple-500 to-indigo-400",
  },
  {
    name: "Riyadh Valley Company (RVC)",
    type: "fund",
    backing: "university",
    city: "Riyadh",
    description:
      "The investment arm of King Saud University, focusing on the knowledge and technology economy. Invests in startups and funds aligned with KSU's research strengths and Vision 2030.",
    sectors: ["Knowledge Economy", "Technology", "Research"],
    highlights: [
      "Investment arm of King Saud University",
      "Bridge between academia & private sector",
      "Focuses on research commercialization",
      "Aligned with Vision 2030 sectors",
    ],
    application: {
      equity: "Equity investment (terms negotiated per deal)",
      duration: "Ongoing (investment fund, not cohort-based)",
      funding: "VC-style investment; ticket sizes vary",
      eligibility: [
        "Startups with ties to KSU research or Saudi innovation",
        "Must demonstrate commercialization potential",
        "Preference for knowledge-economy ventures",
      ],
      applicationWindow: "Rolling — deal flow based",
      howToApply: "Reach out via RVC's investment team or KSU network",
    },
    icon: GraduationCap,
    color: "from-cyan-500 to-blue-400",
  },
];

const typeLabels: Record<ProgramType, string> = {
  accelerator: "Accelerator",
  incubator: "Incubator",
  "venture-studio": "Venture Studio",
  fund: "Fund",
};

const backingLabels: Record<BackingType, string> = {
  government: "Government",
  corporate: "Corporate",
  university: "University",
  private: "Private",
};

const backingColors: Record<BackingType, string> = {
  government: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  corporate: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  university: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  private: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

/* ─── Component ─── */

const IncubatorsGuide = () => {
  usePageSEO({
    title: "Incubators & Accelerators in Saudi Arabia",
    description:
      "Complete directory of startup incubators, accelerators, and venture programs in Saudi Arabia — Badir, Wa'ed, Flat6Labs, KAUST, Monsha'at, and more. Includes application details, equity terms, and eligibility.",
    path: "/startup-guide/incubators",
  });

  const [search, setSearch] = useState("");
  const [selectedBacking, setSelectedBacking] = useState<BackingType | "all">("all");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filtered = programs.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.sectors.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesBacking = selectedBacking === "all" || p.backing === selectedBacking;
    return matchesSearch && matchesBacking;
  });

  const zeroEquityCount = programs.filter((p) => p.application.equity.includes("0%")).length;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/20 to-emerald-500/20 blur-[120px]" />

        <div className="px-4 sm:container py-20 sm:py-28 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link
              to="/startup-guide"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Startup Guide
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6 ml-4">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">Programs Directory</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              Incubators & Accelerators
              <br />
              <span className="gradient-text">in Saudi Arabia</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-4 leading-relaxed">
              A comprehensive directory of startup support programs across the Kingdom — with application details, equity terms, eligibility criteria, and how to apply.
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-xl">
              Data sourced from official program websites, Monsha'at (SIAN), and verified public directories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="px-4 sm:container py-6">
          <div className="flex flex-wrap gap-6 sm:gap-10 justify-center text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{programs.length}</p>
              <p className="text-muted-foreground">Programs Listed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{zeroEquityCount}</p>
              <p className="text-muted-foreground">Zero-Equity Programs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">55+</p>
              <p className="text-muted-foreground">Total in Saudi Arabia</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">SAR 3B+</p>
              <p className="text-muted-foreground">Funding Deployed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 border-b border-border/40">
        <div className="px-4 sm:container">
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "government", "corporate", "university", "private"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBacking(b)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                    selectedBacking === b
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30"
                  )}
                >
                  {b === "all" ? "All" : backingLabels[b]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 sm:py-20">
        <div className="px-4 sm:container">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No programs match your search</p>
              <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {filtered.map((program, i) => {
                const isExpanded = expandedCard === program.name;
                return (
                  <motion.div
                    key={program.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i % 4}
                  >
                    <div
                      className={cn(
                        "relative rounded-2xl border bg-card p-6 sm:p-7 transition-all cursor-pointer",
                        isExpanded
                          ? "border-primary/30 shadow-lg"
                          : "border-border/50 hover:border-primary/20 hover:shadow-md"
                      )}
                      onClick={() => setExpandedCard(isExpanded ? null : program.name)}
                    >
                      {/* Glow */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${program.color} opacity-[0.06] blur-[60px]`}
                      />

                      <div className="relative">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shrink-0`}
                            >
                              <program.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-display text-base font-bold leading-tight">{program.name}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{program.city}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform shrink-0 mt-1",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[0.6rem] font-medium",
                              backingColors[program.backing]
                            )}
                          >
                            {backingLabels[program.backing]}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-muted text-muted-foreground">
                            {typeLabels[program.type]}
                          </span>
                          {program.application.equity.includes("0%") && (
                            <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Zero Equity
                            </span>
                          )}
                        </div>

                        {/* Quick Stats (always visible) */}
                        <div className="grid grid-cols-3 gap-2 mb-3 p-3 rounded-xl bg-muted/50">
                          <div className="text-center">
                            <Percent className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                            <p className="text-[0.65rem] text-muted-foreground">Equity</p>
                            <p className="text-xs font-semibold text-foreground leading-tight">{program.application.equity.split("—")[0].trim()}</p>
                          </div>
                          <div className="text-center">
                            <Clock className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                            <p className="text-[0.65rem] text-muted-foreground">Duration</p>
                            <p className="text-xs font-semibold text-foreground leading-tight">{program.application.duration}</p>
                          </div>
                          <div className="text-center">
                            <DollarSign className="h-3.5 w-3.5 mx-auto mb-0.5 text-muted-foreground" />
                            <p className="text-[0.65rem] text-muted-foreground">Funding</p>
                            <p className="text-xs font-semibold text-foreground leading-tight truncate">{program.application.funding.split(";")[0].split("—")[0].trim()}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className={cn("text-sm text-muted-foreground leading-relaxed", !isExpanded && "line-clamp-2")}>
                          {program.description}
                        </p>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-5 space-y-5"
                          >
                            {/* Application Details */}
                            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Application Details
                              </p>

                              <div className="space-y-2.5">
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-0.5">Equity Terms</p>
                                  <p className="text-sm text-muted-foreground">{program.application.equity}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-0.5">Funding</p>
                                  <p className="text-sm text-muted-foreground">{program.application.funding}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-0.5">Application Window</p>
                                  <p className="text-sm text-muted-foreground">{program.application.applicationWindow}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-0.5">How to Apply</p>
                                  <p className="text-sm text-muted-foreground">{program.application.howToApply}</p>
                                </div>
                              </div>
                            </div>

                            {/* Eligibility */}
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Eligibility
                              </p>
                              <ul className="space-y-1.5">
                                {program.application.eligibility.map((e) => (
                                  <li key={e} className="flex items-start gap-2 text-sm text-foreground">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    {e}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Sectors */}
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Key Sectors
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {program.sectors.map((s) => (
                                  <span
                                    key={s}
                                    className="px-2.5 py-1 rounded-lg text-xs bg-muted text-foreground font-medium"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Highlights */}
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Highlights
                              </p>
                              <ul className="space-y-1.5">
                                {program.highlights.map((h) => (
                                  <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Links */}
                            {program.website && (
                              <a
                                href={program.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                              >
                                Visit Website <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-8">
        <div className="px-4 sm:container">
          <div className="max-w-3xl mx-auto rounded-xl bg-muted/50 border border-border/40 p-5 sm:p-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Sources & Disclaimer:</strong> This directory is compiled from official program websites, 
              Monsha'at's Saudi Incubators & Accelerators Network (SIAN), and verified public directories. 
              Application details, equity terms, funding amounts, and availability may change. Always verify 
              directly with the program before applying. This guide is for informational purposes only and does 
              not constitute an endorsement of any program.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="px-4 sm:container">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

            <div className="relative p-10 sm:p-16 text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
                Know a Program We're Missing?
              </h2>
              <p className="text-primary-foreground/80 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                We want this directory to be the most complete resource for founders in Saudi Arabia. If you know an 
                incubator or accelerator that should be listed here, let us know.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-foreground hover:bg-white/90 border-0 px-8 h-12 shadow-xl"
                >
                  <a href="mailto:help@foundersksa.com">
                    <Mail className="mr-2 h-4 w-4" /> Suggest a Program
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-white/10 px-8 h-12"
                >
                  <Link to="/startup-guide">Back to Startup Guide</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IncubatorsGuide;
