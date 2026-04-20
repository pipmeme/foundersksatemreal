import { useState } from "react";
import { motion } from "framer-motion";

import { usePageSEO } from "@/hooks/use-page-seo";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Building2,
  Landmark,
  MapPin,
  Users,
  ShieldCheck,
  Rocket,
  ChevronDown,
  HelpCircle,
  Mail,
} from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

/* ─── FAQ Data ─── */

interface FAQ {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  icon: LucideIcon;
  label: string;
  emoji: string;
  color: string;
  faqs: FAQ[];
}

const categories: FAQCategory[] = [
  {
    id: "setup",
    icon: Building2,
    label: "Setup & Structure",
    emoji: "🏗️",
    color: "from-violet-500 to-indigo-400",
    faqs: [
      { q: "How long does it really take to get my company up and running?", a: "Realistically, expect a timeline of 1 to 3 months. While the MISA license itself can be issued in days, the subsequent steps — commercial registration, bank account opening, and government file activation — take time." },
      { q: "What are the most common legal structures for foreign companies?", a: "The \"Big Three\" for 2026 are:\n\n• **LLC (Limited Liability Company):** Most popular for startups.\n• **Branch Office:** Perfect for expanding an existing global brand.\n• **Joint Stock Company (JSC):** Better suited for large-scale operations eyeing an IPO." },
      { q: "Is a local Saudi partner still mandatory?", a: "No. This is a common myth. Most sectors now allow 100% foreign ownership, especially under the Entrepreneur and Foreign Investor licenses championed by MISA." },
      { q: "Branch vs. LLC: Which one should I choose?", a: "Think of it this way: An LLC protects your parent company from liability (it's a separate entity). A Branch is legally tied to your parent company, meaning the parent accepts all liability but keeps the branding identical." },
      { q: "Are there any \"no-go\" zones for foreign investors?", a: "Yes, a few rigid sectors remain off-limits, primarily in oil exploration, drilling, and military equipment manufacturing. Almost everything else is open." },
      { q: "What exact documents do I need to open a Branch?", a: "It's a bit paperwork-heavy. You'll need:\n\n• Standard Certificate of Incorporation\n• Memorandum of Association (MoA)\n• Board Resolution authorizing the Saudi branch\n• Last year's Audited Financials\n• Power of Attorney (PoA) for your local consultant\n\n**Note:** All must be Apostilled (or attested by the Saudi Embassy if your country isn't in the Hague Convention)." },
      { q: "What are the main license types I can apply for?", a: "• **Service License:** For consulting, IT, agencies, and regional HQs.\n• **Industrial License:** For manufacturing and factories.\n• **Commercial/Trading License:** For retail, e-commerce, and import/export." },
      { q: "Is the \"Entrepreneur License\" right for me?", a: "If you are a startup with a tech angle or an innovative business model, absolutely. You need a support letter from a MISA-approved incubator or VC, but the fees are significantly subsidized (starting at 2,000 SAR/year)." },
      { q: "Does one license cover everything?", a: "No. Licenses are activity-specific. You cannot open a factory with a Service License, and you can't trade goods with a Consulting License." },
      { q: "Do I need millions in capital to start?", a: "Not anymore. For most LLCs and specifically for the Entrepreneur License, there is no minimum capital requirement. You can literally start with as little as SAR 5,000 on paper." },
    ],
  },
  {
    id: "finance",
    icon: Landmark,
    label: "Taxes, Fees & Banking",
    emoji: "💰",
    color: "from-amber-500 to-yellow-400",
    faqs: [
      { q: "What exactly constitutes the \"Tax Bill\" for a foreign company?", a: "For 2026, plan for:\n\n• **Corporate income tax:** 20% on net profits (non-oil activities).\n• **VAT:** 15% on sales (if revenue > SAR 375k).\n• **Withholding Tax:** 5% to 20% on payments sent abroad. Consulting/Technical services dropped to 5% in recent updates." },
      { q: "Can I open a bank account before I finish my registration?", a: "No. The bank needs to see your Commercial Registration (CR) and MISA License before they will open an account." },
      { q: "What does the bank need from me?", a: "Prepare a thick folder:\n\n• MISA License & CR\n• Articles of Association (AoA)\n• Passports & Iqamas of owners\n• National Address proof\n• Company Stamp\n\n**Pro Tip:** Some digital-first banks now allow online setup." },
      { q: "Can I send my profits back home?", a: "Yes. There are no restrictions on repatriating capital or profits, provided you have paid your taxes and have a tax clearance certificate." },
    ],
  },
  {
    id: "office",
    icon: MapPin,
    label: "Office & Locations",
    emoji: "🏢",
    color: "from-emerald-500 to-teal-400",
    faqs: [
      { q: "Do I really need a physical office?", a: "Yes, but with flexibility. MISA requires a physical address for the license. However, for 2026, \"Commercial Service Offices\" (serviced/co-working spaces) are fully legal and cost-effective solutions for startups." },
      { q: "What if I want to just work from home?", a: "You legally need a registered National Address for the company. A virtual office contract with a licensed center is the minimum requirement to satisfy the municipality and MISA." },
    ],
  },
  {
    id: "visas",
    icon: Users,
    label: "Visas & Saudization",
    emoji: "👥",
    color: "from-sky-500 to-blue-400",
    faqs: [
      { q: "What is a \"GM Visa\"?", a: "This is the General Manager (GM) Visa. As soon as you get your license, you can apply for this to bring the primary manager to Saudi Arabia immediately." },
      { q: "Can I sponsor my employees?", a: "Yes. Your company acts as the sponsor (Kafeel) for all your foreign employees, allowing them to get their work visas and Iqamas." },
      { q: "What is an \"Iqama\"?", a: "It is the Residency Permit (ID card) for foreign residents. You cannot open a personal bank account, rent a house, or get a SIM card without it." },
      { q: "How fast can I get an Iqama for a new hire?", a: "Once they land in KSA, it typically takes 1 week. They need to pass a medical test, and you need to pay the fees via the Qiwa/Muqeem portals." },
      { q: "What are the costs to hire an expat?", a: "Budget for:\n\n• **Visa Fees:** ~2,000 SAR\n• **Work Permit Fee:** ~9,600 SAR/year\n• **Medical Insurance:** Varies (mandatory)\n• **Iqama Issuance:** ~650 SAR" },
      { q: "What is \"Saudization\" (Nitaqat)?", a: "It is the requirement to hire Saudi nationals. The system classifies your company (Red, Green, Platinum) based on the percentage of Saudis you employ." },
      { q: "Are the rules strictly enforced for startups?", a: "Yes. Updates for 2025/2026 abolished the \"Yellow\" zone — you are either compliant (Green/Platinum) or non-compliant (Red). Red means you cannot renew visas or hire new staff." },
      { q: "What are the new Saudization quotas I should know?", a: "Recent updates raised targets for specific roles:\n\n• **Consulting:** 40%\n• **Engineering:** 30%\n• **Sales/Marketing:** ~60% depending on team size." },
      { q: "What happens if I ignore Saudization?", a: "You will hit a wall. You won't be able to renew your own visa or your employees' visas, effectively halting your business." },
    ],
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    label: "Insurance & Compliance",
    emoji: "🏥",
    color: "from-rose-500 to-pink-400",
    faqs: [
      { q: "Is medical insurance mandatory?", a: "Yes, for every single non-Saudi employee and their dependents. You cannot issue or renew an Iqama without it." },
      { q: "When do I need to register for VAT?", a: "Mandatory registration kicks in once your annual revenue hits SAR 375,000. If you earn less, it's optional (but often recommended to claim back VAT on expenses)." },
      { q: "Do I need an auditor?", a: "Yes. All foreign-owned companies must submit annual audited financial statements to MISA and the tax authority (ZATCA)." },
      { q: "Can I do E-commerce with my license?", a: "Yes, but your MISA license activity must explicitly list \"E-commerce.\" You will also need to register with Maroof (the e-commerce trust platform)." },
    ],
  },
  {
    id: "growth",
    icon: Rocket,
    label: "Growth & Exit",
    emoji: "🚀",
    color: "from-orange-500 to-red-400",
    faqs: [
      { q: "How do I protect my brand logo?", a: "Register your trademark with the Saudi Authority for Intellectual Property (SAIP). It protects your brand across the GCC in many cases." },
      { q: "Is it hard to close a business?", a: "It is harder than opening one. Liquidation involves clearing all debts, cancelling visas, obtaining tax clearance, and formally dissolving the entity. It can take 6+ months." },
      { q: "What is the \"Premium Residency\" Entrepreneur Track?", a: "2026 Pro Tip: If your startup attracts SAR 400,000 in investment from an accredited body, you can apply for a 5-year renewable Premium Residency for yourself, bypassing the need for a standard work visa." },
      { q: "What support does the government give for hiring Saudis?", a: "The Human Resources Development Fund (HRDF) helps pay up to 30-50% of a Saudi employee's salary for the first few years to support training and retention." },
      { q: "What happens if I miss a tax filing?", a: "Fines. ZATCA is strict. Penalties range from fixed amounts to percentages of the unpaid tax. Always file on time." },
      { q: "Why is \"National Address\" so important?", a: "It is your digital legal ID for location. You cannot open a bank account, get a license, or receive mail without a registered National Address (Spl.online)." },
      { q: "What are the common pitfalls for new founders?", a: "• Underestimating setup time.\n• Ignoring Saudization until visa renewal time.\n• Not budgeting for government fees (iqama, levies).\n• Trying to cut corners on the \"Audit\" requirement." },
    ],
  },
];

const totalFAQs = categories.reduce((sum, c) => sum + c.faqs.length, 0);

/* ─── Accordion Item ─── */

const FAQItem = ({ faq, index }: { faq: FAQ; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full text-left rounded-xl border bg-card p-4 sm:p-5 transition-all group",
          open ? "border-primary/30 shadow-md" : "border-border/50 hover:border-primary/20 hover:shadow-sm"
        )}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.65rem] font-bold text-primary">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-sm sm:text-base font-semibold leading-snug pr-2">{faq.q}</h3>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
            </div>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                open ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
              )}
            >
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-t border-border/40 pt-3">
                {faq.a.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

/* ─── Page ─── */

const BusinessFAQ = () => {
  usePageSEO({
    title: "Essential FAQs — Starting a Business in Saudi Arabia",
    description:
      "The most comprehensive FAQ guide for foreign entrepreneurs in Saudi Arabia. Licensing, taxes, visas, Saudization, and everything you need to know.",
    path: "/startup-guide/business-faq",
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCategories = categories
    .filter((c) => !activeCategory || c.id === activeCategory)
    .map((c) => ({
      ...c,
      faqs: c.faqs.filter(
        (f) =>
          !search ||
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((c) => c.faqs.length > 0);

  let globalIndex = 0;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full gradient-bg opacity-[0.07] blur-[120px]" />

        <div className="px-4 sm:container py-16 sm:py-24 md:py-32 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link
              to="/startup-guide"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Startup Guide
            </Link>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">2026 Edition</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
                Essential FAQs for
                <br />
                <span className="gradient-text">Foreign Businesses</span> in KSA
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
                Everything foreign entrepreneurs ask before, during, and after setting up in Saudi Arabia — answered clearly.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <strong className="text-foreground">{totalFAQs}</strong> Questions
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  <strong className="text-foreground">{categories.length}</strong> Categories
                </span>
                <span className="text-border">•</span>
                <span>Free & Updated</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search + Category Filter */}
      <section className="border-t border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
        <div className="px-4 sm:container py-3 sm:py-4">
          {/* Search */}
          <div className="relative max-w-md mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-background pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>

          {/* Category pills — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap shrink-0",
                !activeCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border/60 hover:border-primary/30"
              )}
            >
              All ({totalFAQs})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 whitespace-nowrap shrink-0",
                  activeCategory === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border/60 hover:border-primary/30"
                )}
              >
                <span>{c.emoji}</span> {c.label} ({c.faqs.length})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 sm:py-16">
        <div className="px-4 sm:container max-w-4xl">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No questions match your search.</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="mb-12 last:mb-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">{category.emoji} {category.label}</h2>
                    <p className="text-xs text-muted-foreground">{category.faqs.length} questions</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.faqs.map((faq) => {
                    globalIndex++;
                    return <FAQItem key={faq.q} faq={faq} index={globalIndex} />;
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="px-4 sm:container">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

            <div className="relative p-10 sm:p-14 text-center">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-3 leading-tight">
                Still Have Questions?
              </h2>
              <p className="text-primary-foreground/80 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
                Every situation is unique. Reach out and we'll help you figure out the best path forward.
              </p>
              <Button asChild size="lg" variant="outline" className="bg-white text-foreground hover:bg-white/90 border-0 px-8 h-12 shadow-xl">
                <a href="mailto:help@foundersksa.com">
                  <Mail className="mr-2 h-4 w-4" /> Ask Us Anything
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BusinessFAQ;
