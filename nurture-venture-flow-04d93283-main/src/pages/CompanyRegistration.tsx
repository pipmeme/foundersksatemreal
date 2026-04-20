import { useState } from "react";
import { motion } from "framer-motion";

import { usePageSEO } from "@/hooks/use-page-seo";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  FileText,
  Landmark,
  CreditCard,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Globe,
  Mail,
  ArrowRight,
  Shield,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Data ─── */

interface Phase {
  phase: number;
  title: string;
  timeline: string;
  steps: {
    title: string;
    description: string;
    details: string[];
    tip?: string;
  }[];
}

const phases: Phase[] = [
  {
    phase: 1,
    title: "Legal Entity Establishment",
    timeline: "~1 month",
    steps: [
      {
        title: "Obtain a MISA Investment License",
        description: "This is the mandatory first step for any foreign investor. You cannot proceed without it.",
        details: [
          "Register on the Invest Saudi platform (investsaudi.sa)",
          "Upload: parent company CR (attested by MOFA & Saudi Embassy), audited financial statements, Articles of Association, board resolution & POA, shareholders' passport copies, and a business plan",
          "For startups: letter of intent, pitch deck, and a support letter from a licensed VC or incubator",
          "Pay government fee: SAR 2,000",
          "Processing time: 7–14 business days",
        ],
        tip: "Already have a MISA license? Check our detailed MISA License Guide for the full breakdown.",
      },
      {
        title: "Reserve Your Trade Name",
        description: "Select and reserve a unique business name through the Ministry of Commerce.",
        details: [
          "Name must comply with Saudi naming rules (no blasphemy, no existing trademarks)",
          "Reserve via Ministry of Commerce portal (mc.gov.sa)",
          "Name reservation is valid for a limited period — proceed quickly",
        ],
      },
      {
        title: "Draft Local Articles of Association (AoA)",
        description: "The AoA is established by law — companies can only adjust their General Manager's powers.",
        details: [
          "Must follow the standard template set by Ministry of Commerce",
          "Defines ownership structure, management powers, and business objectives",
          "Must be notarized and signed by all shareholders or their representatives",
          "Typically prepared by a local law firm or PRO",
        ],
        tip: "The AoA is a legal template — you're mainly customizing the GM's powers and shareholder percentages. Don't overthink it.",
      },
      {
        title: "Secure Commercial Registration (CR)",
        description: "Apply for and receive your official CR number from the Ministry of Commerce.",
        details: [
          "Submit via Ministry of Commerce portal with all documents",
          "Attach: MISA license, name reservation, AoA, shareholder IDs",
          "Select your business activities (must match MISA license activities)",
          "Your CR number is your company's legal identity in Saudi Arabia",
        ],
      },
      {
        title: "Register with Chamber of Commerce (CoC)",
        description: "Obtain your Chamber of Commerce membership to complete Phase 1.",
        details: [
          "Required for most business activities in Saudi Arabia",
          "Registration done online or at your local chamber office",
          "Annual membership fee: SAR 500–2,000 depending on category",
        ],
      },
    ],
  },
  {
    phase: 2,
    title: "Authorization & Hiring",
    timeline: "~2 months",
    steps: [
      {
        title: "Obtain Company Seal",
        description: "A company seal is required for official documents and contracts.",
        details: [
          "Order from an authorized seal maker with your CR number",
          "Required for signing contracts and official correspondence",
        ],
      },
      {
        title: "Register with Ministry of Human Resources (MOHR)",
        description: "Required for hiring employees and meeting Saudization (Nitaqat) requirements.",
        details: [
          "Register your company on the Qiwa portal (qiwa.sa)",
          "Set up your Nitaqat (Saudization) account",
          "Understand your sector's Saudization quota requirements",
        ],
      },
      {
        title: "Register with GOSI (Social Insurance)",
        description: "Mandatory registration for all companies with employees.",
        details: [
          "Register at gosi.gov.sa",
          "Required before you can process any employee visas or salaries",
          "Both Saudi and non-Saudi employees must be registered",
        ],
      },
      {
        title: "Register a National Address",
        description: "Every company must have a registered national address via Saudi Post (SPL).",
        details: [
          "Register at splonline.com.sa",
          "Required for bank account opening and government correspondence",
          "Must be a physical address — PO Boxes are not accepted",
        ],
      },
      {
        title: "Issue General Manager (GM) Visa",
        description: "If the GM is a non-Saudi, you need to issue their work visa.",
        details: [
          "Apply through the Ministry of Human Resources",
          "GM must enter Saudi Arabia on this visa",
          "Required before the GM can apply for their Iqama (residency permit)",
        ],
      },
      {
        title: "Register with ZATCA (Tax Authority)",
        description: "Register for Zakat, Income Tax, and VAT with ZATCA.",
        details: [
          "Register at zatca.gov.sa",
          "VAT registration mandatory if annual revenue exceeds SAR 375,000",
          "Voluntary registration available below that threshold",
          "You'll receive your Tax Identification Number (TIN)",
        ],
        tip: "Register for VAT early even if below the threshold — many B2B clients require VAT invoices.",
      },
    ],
  },
  {
    phase: 3,
    title: "Residency & Banking",
    timeline: "~3 months",
    steps: [
      {
        title: "Activate Chamber of Commerce Account",
        description: "Ensure your CoC membership is fully active and linked to your CR.",
        details: [
          "Activate online through the local chamber portal",
          "Required for various government services and tenders",
        ],
      },
      {
        title: "Obtain Health Insurance & Medical Check-up",
        description: "Health insurance is mandatory for the GM and all employees.",
        details: [
          "Purchase from a CCHI-approved insurance provider",
          "Medical check-up required for Iqama processing",
          "Insurance must be valid before Iqama issuance",
        ],
      },
      {
        title: "Issue GM Iqama (Residency Permit)",
        description: "The GM's Iqama is issued after medical check-up and insurance.",
        details: [
          "Applied through the Muqeem portal (muqeem.sa)",
          "Requires: GM visa entry, health insurance, medical check, company CR",
          "Iqama is essential for banking, driving, and daily life in Saudi Arabia",
        ],
      },
      {
        title: "Register on Government Portals",
        description: "Set up accounts on key government platforms for ongoing operations.",
        details: [
          "Muqeem (muqeem.sa) — visa and residency management for foreign employees",
          "Absher (absher.sa) — e-government services (mandatory for the GM)",
          "Qiwa (qiwa.sa) — labor and business services for SMEs",
          "Mudad (mudad.com.sa) — payroll processing and wage protection system (WPS)",
        ],
        tip: "Each portal serves a different purpose. Mudad (WPS) is particularly critical — salaries must be paid through the Wage Protection System.",
      },
      {
        title: "Open Corporate Bank Account",
        description: "The final step — you can now open your company's bank account.",
        details: [
          "Documents needed: MISA license, CR, national address proof, GM Iqama, AoA (with GM's banking powers), VAT certificate",
          "Choose from: SNB, Al Rajhi, Riyad Bank, SABB, or fintech-friendly options",
          "Minimum capital deposit varies — some banks accept SAR 25,000, others require more",
          "Parent company docs may also be needed (attested CR, ownership chart, shareholder IDs)",
        ],
        tip: "Bank account opening is often the longest step. Apply to 2–3 banks simultaneously to speed things up.",
      },
    ],
  },
];

interface EntityType {
  name: string;
  arabic: string;
  bestFor: string;
  minCapital: string;
  shareholders: string;
  foreignOwnership: string;
  liability: string;
  notes: string;
}

const entityTypes: EntityType[] = [
  {
    name: "Limited Liability Company (LLC)",
    arabic: "شركة ذات مسؤولية محدودة",
    bestFor: "Most foreign investors, SMEs, and trading businesses",
    minCapital: "No statutory minimum (banks may require SAR 25,000+)",
    shareholders: "1–50 partners",
    foreignOwnership: "100% allowed in most sectors",
    liability: "Limited to each partner's share in capital",
    notes: "Most popular structure for foreign investors. Flexible and straightforward.",
  },
  {
    name: "Simplified Joint Stock Company (SJSC)",
    arabic: "شركة مساهمة مبسطة",
    bestFor: "Startups, tech ventures, and companies planning future fundraising",
    minCapital: "SAR 1 (nominal)",
    shareholders: "1+ shareholders",
    foreignOwnership: "100% allowed",
    liability: "Limited to share value",
    notes: "New structure introduced for startups. Very flexible share classes and investor-friendly terms.",
  },
  {
    name: "Joint Stock Company (JSC)",
    arabic: "شركة مساهمة",
    bestFor: "Large enterprises planning IPO or public offering",
    minCapital: "SAR 500,000",
    shareholders: "2+ shareholders (5+ for public offering)",
    foreignOwnership: "100% allowed",
    liability: "Limited to share value",
    notes: "Required for companies seeking public listing on Tadawul.",
  },
  {
    name: "Branch of a Foreign Company",
    arabic: "فرع شركة أجنبية",
    bestFor: "Expanding existing international operations into KSA",
    minCapital: "No separate requirement — parent company is liable",
    shareholders: "Parent company is sole owner",
    foreignOwnership: "100% — extension of parent company",
    liability: "Parent company bears full liability",
    notes: "Simpler setup if you have an established parent company abroad.",
  },
  {
    name: "Regional Headquarters (RHQ)",
    arabic: "المقر الإقليمي",
    bestFor: "Multinational companies managing MENA operations from Saudi Arabia",
    minCapital: "Varies — typically requires significant presence",
    shareholders: "Parent company",
    foreignOwnership: "100% allowed",
    liability: "Parent company liable",
    notes: "Mandatory from 2024 for companies with Saudi government contracts. Significant tax incentives available.",
  },
];

/* ─── Component ─── */

const CompanyRegistration = () => {
  usePageSEO({
    title: "Company Registration (CR) Guide — Saudi Arabia",
    description:
      "Complete 3-phase guide to registering a foreign company in Saudi Arabia. MISA license, Commercial Registration, GM visa, ZATCA, banking — every step from official sources.",
    path: "/startup-guide/company-registration",
  });

  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 blur-[120px]" />

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
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">Company Setup</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              Company Registration
              <br />
              <span className="gradient-text">(CR) Guide</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-4 leading-relaxed">
              The complete 3-phase process to register a foreign company in Saudi Arabia — from MISA license to bank account opening. Based on official sources and verified by practitioners.
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-xl">
              Sources: Ministry of Commerce (mc.gov.sa), MISA (investsaudi.sa), ZATCA, AstroLabs, and verified professional service providers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="px-4 sm:container py-6">
          <div className="flex flex-wrap gap-6 sm:gap-10 justify-center text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">3 Phases</p>
              <p className="text-muted-foreground">~6 Months Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalSteps}</p>
              <p className="text-muted-foreground">Total Steps</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-muted-foreground">Foreign Ownership</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-muted-foreground">Entity Types</p>
            </div>
          </div>
        </div>
      </section>

      {/* Entity Types */}
      <section className="py-16 sm:py-24">
        <div className="px-4 sm:container">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Before You Start</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Choose Your Entity Type
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Saudi Arabia offers several legal structures for foreign investors. Your choice affects capital requirements, liability, and future flexibility.
            </p>
          </motion.div>

          <div className="space-y-4 max-w-4xl">
            {entityTypes.map((entity, i) => (
              <motion.div
                key={entity.name}
                className="rounded-2xl border border-border/50 bg-card overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold">{entity.name}</h3>
                      <p className="text-xs text-muted-foreground/60 font-medium mt-0.5">{entity.arabic}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-medium bg-primary/10 text-primary shrink-0">
                      {entity.bestFor.split(",")[0]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-muted/50">
                      <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mb-0.5">Capital</p>
                      <p className="text-xs font-semibold text-foreground">{entity.minCapital}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/50">
                      <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mb-0.5">Shareholders</p>
                      <p className="text-xs font-semibold text-foreground">{entity.shareholders}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/50">
                      <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mb-0.5">Foreign Ownership</p>
                      <p className="text-xs font-semibold text-foreground">{entity.foreignOwnership}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/50">
                      <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mb-0.5">Liability</p>
                      <p className="text-xs font-semibold text-foreground">{entity.liability}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{entity.notes}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Phase Process */}
      <section className="py-16 sm:py-24 bg-muted/30 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="px-4 sm:container relative">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Registration Process</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              3 Phases to Full Registration
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              The complete process takes approximately 6 months. It's divided into 3 phases — each with its own timeline and deliverables.
            </p>
          </motion.div>

          {/* Phase Timeline Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto mb-12">
            {phases.map((phase) => (
              <button
                key={phase.phase}
                onClick={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}
                className={cn(
                  "rounded-xl p-4 text-center border transition-all",
                  expandedPhase === phase.phase
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "bg-card border-border/50 hover:border-primary/30"
                )}
              >
                <p className={cn("text-xs font-medium mb-1", expandedPhase === phase.phase ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  Phase {phase.phase}
                </p>
                <p className={cn("text-sm font-bold mb-0.5", expandedPhase !== phase.phase && "text-foreground")}>
                  {phase.title}
                </p>
                <p className={cn("text-xs", expandedPhase === phase.phase ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {phase.timeline}
                </p>
              </button>
            ))}
          </div>

          {/* Phase Detail */}
          {phases.map((phase) => (
            expandedPhase === phase.phase && (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-5"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm">
                    {phase.phase}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground">Projected timeline: {phase.timeline}</p>
                  </div>
                </div>

                {phase.steps.map((step, si) => (
                  <div key={si} className="relative">
                    {/* Connector */}
                    {si < phase.steps.length - 1 && (
                      <div className="absolute left-[1.125rem] top-[3.5rem] bottom-[-1.25rem] w-px bg-border/60" />
                    )}
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-xs">
                          {phase.phase}.{si + 1}
                        </div>
                      </div>
                      <div className="flex-1 rounded-xl border border-border/50 bg-card p-5">
                        <h4 className="font-display text-sm sm:text-base font-bold mb-1.5">{step.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                        <ul className="space-y-1.5 mb-3">
                          {step.details.map((d) => (
                            <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              {d}
                            </li>
                          ))}
                        </ul>
                        {step.tip && (
                          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                              <strong>Tip:</strong> {step.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )
          ))}
        </div>
      </section>

      {/* Key Documents Checklist */}
      <section className="py-16 sm:py-24">
        <div className="px-4 sm:container">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Prepare in Advance</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Document Checklist
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Have these ready before you start. Documents from abroad must be attested by MOFA and the Saudi Embassy in your country.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl">
            {[
              {
                title: "For Startups",
                icon: Briefcase,
                docs: [
                  "Commercial Registration (attested by MOFA & Saudi Embassy)",
                  "Memorandum of Association & Articles of Association (attested)",
                  "Letter of Intent & Startup Brief",
                  "Pitch Deck",
                  "Support letter from a licensed VC or incubator",
                  "Shareholders' passport copies",
                  "Business plan",
                ],
              },
              {
                title: "For Established Businesses",
                icon: Building2,
                docs: [
                  "Commercial Registration (attested by MOFA & Saudi Embassy)",
                  "Memorandum of Association & Articles of Association (attested)",
                  "Audited Financial Statements (last 2–3 years)",
                  "Board Resolution authorizing Saudi entity",
                  "Power of Attorney (POA) for representative",
                  "Shareholders' passport copies",
                  "Ownership structure chart with names, nationalities, and percentages",
                ],
              },
            ].map((group) => (
              <motion.div
                key={group.title}
                className="rounded-2xl border border-border/50 bg-card p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex items-center gap-2 mb-4">
                  <group.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-base font-bold">{group.title}</h3>
                </div>
                <ul className="space-y-2">
                  {group.docs.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 max-w-4xl">
            <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong>Important:</strong> All documents from outside Saudi Arabia must be attested by the Ministry of Foreign Affairs (MOFA) and the Saudi Embassy in your home country. This process can take 2–4 weeks — start early.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Government Portals Reference */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="px-4 sm:container">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Essential Portals</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Government Portals You'll Need
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Bookmark these — you'll use them throughout the registration process and for ongoing compliance.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {[
              { name: "Invest Saudi (MISA)", url: "investsaudi.sa", purpose: "Investment license application" },
              { name: "Ministry of Commerce", url: "mc.gov.sa", purpose: "CR registration & name reservation" },
              { name: "ZATCA", url: "zatca.gov.sa", purpose: "Tax & VAT registration" },
              { name: "GOSI", url: "gosi.gov.sa", purpose: "Social insurance for employees" },
              { name: "Qiwa", url: "qiwa.sa", purpose: "Labor & SME services" },
              { name: "Muqeem", url: "muqeem.sa", purpose: "Visa & residency management" },
              { name: "Absher", url: "absher.sa", purpose: "E-government services" },
              { name: "Mudad", url: "mudad.com.sa", purpose: "Payroll & Wage Protection System" },
              { name: "Saudi Post (SPL)", url: "splonline.com.sa", purpose: "National address registration" },
            ].map((portal) => (
              <motion.div
                key={portal.name}
                className="rounded-xl border border-border/50 bg-card p-4 hover:border-primary/20 transition-colors"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Globe className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">{portal.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{portal.purpose}</p>
                <p className="text-xs text-primary font-medium">{portal.url}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="py-12 sm:py-16 border-t border-border/40">
        <div className="px-4 sm:container">
          <h3 className="font-display text-lg font-bold mb-6">Related Guides</h3>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
            {[
              { title: "MISA License Guide", to: "/startup-guide/misa-license", desc: "Get your foreign investment permit first" },
              { title: "Business FAQs", to: "/startup-guide/business-faq", desc: "Common questions about setup, taxes & visas" },
              { title: "Premium Residency", to: "/startup-guide/premium-residency", desc: "Entrepreneur residency pathways" },
            ].map((guide) => (
              <Link key={guide.to} to={guide.to} className="group rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-all">
                <h4 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{guide.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{guide.desc}</p>
                <span className="text-xs text-primary font-medium flex items-center gap-1">
                  Read guide <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
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
                Need Help With Registration?
              </h2>
              <p className="text-primary-foreground/80 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                We're a community-driven guide — reach out and we'll point you in the right direction or connect you with trusted service providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="outline" className="bg-white text-foreground hover:bg-white/90 border-0 px-8 h-12 shadow-xl">
                  <a href="mailto:help@foundersksa.com">
                    <Mail className="mr-2 h-4 w-4" /> Ask Us Anything
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-white/10 px-8 h-12">
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

export default CompanyRegistration;
