import { motion } from "framer-motion";

import { usePageSEO } from "@/hooks/use-page-seo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Building2,
  Users,
  CreditCard,
  FileText,
  Upload,
  BadgeCheck,
  Landmark,
  BriefcaseBusiness,
  Rocket,
  Globe,
  HeartPulse,
  ShoppingCart,
  Cpu,
  Leaf,
  Mail,
  ChevronDown,
} from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Data ─── */

const keyBenefits = [
  { icon: Globe, title: "100% Foreign Ownership", desc: "No local partner needed. Full control of your business." },
  { icon: CreditCard, title: "No Minimum Capital", desc: "Unlike standard licenses — start lean, scale fast." },
  { icon: Building2, title: "No Parent Company", desc: "Launch directly in Saudi Arabia without a holding company." },
  { icon: Users, title: "Residency (Iqama)", desc: "Live & work permit for you and your family." },
];

const pricingTiers = [
  { years: "Years 1–3", fee: "SAR 2,000", label: "Maximum Support", color: "from-emerald-500 to-teal-400", desc: "Deeply subsidized. Validate your business model with minimal overhead." },
  { years: "Years 4–5", fee: "SAR 12,000", label: "Graduated Support", color: "from-amber-500 to-yellow-400", desc: "Moderate increase as your business matures — still far below standard." },
  { years: "Year 6+", fee: "SAR 62,000", label: "Standard Rate", color: "from-rose-500 to-orange-400", desc: "Full rate after 5 years of subsidized growth." },
];

const steps = [
  { num: 1, icon: Shield, title: "Get a Support Letter", desc: "Join an approved Incubator, Accelerator, or VC recognized by MISA. On completion, you'll receive a mandatory Support Letter.", highlight: "Critical first step" },
  { num: 2, icon: FileText, title: "Prepare Documents", desc: "Passport copies for all shareholders, Support Letter, Business Plan, and NOC if you have an existing Saudi Iqama.", highlight: "Gather before applying" },
  { num: 3, icon: Upload, title: "Submit MISA Application", desc: "Create an account on the MISA Portal (Invest Saudi). Upload all documents and submit online.", highlight: "Online process" },
  { num: 4, icon: CreditCard, title: "Pay License Fees", desc: "Once approved, pay the first year's fee of SAR 2,000 through the portal.", highlight: "SAR 2,000 first year" },
  { num: 5, icon: BadgeCheck, title: "Receive Your MISA License", desc: "Your Entrepreneur License is issued — typically within 5–7 business days. This is your Investment Permit.", highlight: "5–7 business days" },
  { num: 6, icon: Landmark, title: "Get Commercial Registration", desc: "Apply for a CR through the Ministry of Commerce. Reserve your company name and draft your Articles of Association.", highlight: "Company officially born" },
  { num: 7, icon: BriefcaseBusiness, title: "Start Operations", desc: "Open a corporate bank account, register with ZATCA, join Chamber of Commerce, register with GOSI, and issue work visas.", highlight: "You're operational!" },
];

const eligibility = [
  { icon: Rocket, label: "Foreign Entrepreneurs", desc: "Individuals with innovative, tech-focused ideas" },
  { icon: Building2, label: "Backed Startups", desc: "Companies with approved incubator / accelerator backing" },
  { icon: Cpu, label: "Technology", desc: "Software, AI, fintech, and deep tech ventures" },
  { icon: Leaf, label: "Renewable Energy", desc: "Clean energy and sustainability solutions" },
  { icon: HeartPulse, label: "Healthcare", desc: "Biotech, medtech, and health services" },
  { icon: ShoppingCart, label: "E-Commerce & Tourism", desc: "Digital commerce and tourism experiences" },
];

/* ─── Component ─── */

const StartupGuide = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  usePageSEO({
    title: "MISA Entrepreneur License Guide",
    description: "The ultimate guide to the Entrepreneur MISA License in Saudi Arabia. Process, fees, requirements, and step-by-step walkthrough for 2026.",
    path: "/startup-guide/misa-license",
  });

  const faqs = [
    { q: "Is the MISA license the same as company registration?", a: "No. The MISA license is your Investment Permit — the eligibility criterion to invest as a foreign entity. After receiving it, you must separately obtain a Commercial Registration (CR) from the Ministry of Commerce to officially establish your company." },
    { q: "Do I need a local Saudi partner?", a: "No. The Entrepreneur MISA License allows 100% foreign ownership. You have full control without any local partner requirement." },
    { q: "What's the minimum capital requirement?", a: "There is no minimum capital requirement for the Entrepreneur MISA License, unlike standard investment licenses." },
    { q: "How long does the process take?", a: "The MISA license itself is typically issued within 5–7 business days after approval. The full process (from support letter to operations) varies but can take 4–8 weeks depending on document readiness." },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-4 sm:container pt-6">
        <Link to="/startup-guide" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Startup Guide
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full gradient-bg opacity-[0.07] blur-[120px]" />

        <div className="px-4 sm:container py-16 sm:py-24 md:py-32 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 gradient-bg" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">2026 Updated Guide</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
              Your Complete Guide to
              <br />
              <span className="gradient-text">Starting a Business</span> in Saudi Arabia
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Everything you need to know about the MISA Entrepreneur License — fees, process, documents, and step-by-step walkthrough.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="gradient-bg border-0 text-primary-foreground hover:opacity-90 px-8 h-12 shadow-lg shadow-primary/20" onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}>
                See the Process <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 h-12" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is MISA */}
      <section className="py-16 sm:py-24 border-t border-border/40">
        <div className="px-4 sm:container">
          <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">What is it?</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              The <span className="gradient-text">Entrepreneur MISA License</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
              A specialized investment permit by the Ministry of Investment Saudi Arabia (MISA), designed to support startups, entrepreneurs, and innovation-driven businesses entering the Saudi market.
            </p>
          </motion.div>

          <div className="mt-12 sm:mt-16 relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="grid md:grid-cols-2 gap-5">
              {keyBenefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  className={cn(
                    "relative rounded-2xl border border-border/50 bg-card p-6 sm:p-8 group hover:border-primary/30 transition-all",
                    i % 2 === 0 ? "md:text-right" : ""
                  )}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className={cn("flex items-start gap-4", i % 2 === 0 ? "md:flex-row-reverse" : "")}>
                    <div className="shrink-0 w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                      <b.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 bg-muted/30 relative scroll-mt-20">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="px-4 sm:container relative">
          <motion.div className="text-center mb-12 sm:mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Fee Structure</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Subsidized Fees for <span className="gradient-text">5 Years</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">Scale without heavy government costs. Fees are deeply subsidized in your early years.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.years}
                className={cn(
                  "relative rounded-2xl border bg-card overflow-hidden group hover:shadow-lg transition-all",
                  i === 0 ? "border-primary/40 shadow-md shadow-primary/10" : "border-border/50"
                )}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className={`h-1.5 bg-gradient-to-r ${tier.color}`} />
                <div className="p-6 sm:p-8">
                  {i === 0 && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold gradient-bg text-primary-foreground mb-3">
                      Best Value
                    </span>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{tier.years}</p>
                  <p className="font-display text-3xl sm:text-4xl font-bold mb-1">{tier.fee}</p>
                  <p className="text-xs text-muted-foreground mb-4">per year</p>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${tier.color} text-white mb-4`}>
                    {tier.label}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process — Visual Steps */}
      <section id="process" className="py-16 sm:py-24 scroll-mt-20">
        <div className="px-4 sm:container">
          <motion.div className="text-center mb-12 sm:mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Step by Step</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              From Idea to <span className="gradient-text">Operations</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">7 clear steps to becoming a fully operational company in Saudi Arabia.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/40 to-primary/40 hidden sm:block" />

            <div className="space-y-4 sm:space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="relative flex gap-4 sm:gap-6 group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i * 0.5}
                >
                  {/* Number circle */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4 sm:pb-6">
                    <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 group-hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs font-bold gradient-text uppercase tracking-wider">Step {step.num}</span>
                        <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-accent text-accent-foreground">{step.highlight}</span>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Distinction Callout */}
      <section className="py-12 sm:py-16">
        <div className="px-4 sm:container">
          <motion.div
            className="max-w-3xl mx-auto rounded-2xl border-2 border-primary/20 bg-accent/50 p-8 sm:p-10 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full gradient-bg opacity-10 blur-[80px]" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold">Important Distinction</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                The <strong className="text-foreground">MISA License</strong> is your Investment Permit — the right to invest as a foreign entity. The <strong className="text-foreground">Commercial Registration (CR)</strong> is what officially establishes your company. You need <strong className="text-foreground">both</strong> to operate.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                <div className="flex-1 rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Step 1</p>
                  <p className="font-display font-bold text-sm">MISA License</p>
                  <p className="text-xs text-muted-foreground">Investment Permit</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary shrink-0 rotate-90 sm:rotate-0" />
                <div className="flex-1 rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1">Step 2</p>
                  <p className="font-display font-bold text-sm">Commercial Registration</p>
                  <p className="text-xs text-muted-foreground">Company Established</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary shrink-0 rotate-90 sm:rotate-0" />
                <div className="flex-1 rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Step 3</p>
                  <p className="font-display font-bold text-sm">Operations</p>
                  <p className="text-xs text-muted-foreground">You're live!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="px-4 sm:container">
          <motion.div className="text-center mb-12 sm:mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Who Can Apply</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Eligibility & <span className="gradient-text">Vision 2030 Sectors</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {eligibility.map((item, i) => (
              <motion.div
                key={item.label}
                className="rounded-2xl border border-border/50 bg-card p-6 group hover:border-primary/20 transition-all"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="px-4 sm:container">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">FAQ</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Common Questions</h2>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border/50 bg-card overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span className="font-display font-semibold text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expandedFaq === i && "rotate-180")} />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="px-4 sm:container">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

            <div className="relative p-10 sm:p-16 md:p-24 text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
                Have Questions?
              </h2>
              <p className="text-primary-foreground/80 text-sm sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                We're a community-driven guide — here to help you navigate the process. Reach out and we'll point you in the right direction.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="outline" className="bg-white text-foreground hover:bg-white/90 border-0 px-8 h-12 shadow-xl">
                  <a href="mailto:help@foundersksa.com">
                    <Mail className="mr-2 h-4 w-4" /> Ask Us Anything
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-white/10 px-8 h-12">
                  <Link to="/stories">Read Founder Stories</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StartupGuide;
