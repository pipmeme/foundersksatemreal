import { motion } from "framer-motion";

import { usePageSEO } from "@/hooks/use-page-seo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Landmark,
  FileText,
  Users,
  Rocket,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Scale,
  HandCoins,
  GraduationCap,
  Crown,
  Mail,
  Zap,
} from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* ─── Guide Cards Data ─── */

interface GuideCard {
  icon: LucideIcon;
  title: string;
  desc: string;
  to: string;
  color: string;
  tag: string;
  available: boolean;
}

const guides: GuideCard[] = [
  {
    icon: BadgeCheck,
    title: "MISA Entrepreneur License",
    desc: "The complete guide to obtaining your foreign investment permit — fees, process, documents, and eligibility.",
    to: "/startup-guide/misa-license",
    color: "from-rose-500 to-orange-400",
    tag: "Licensing",
    available: true,
  },
  {
    icon: HelpCircle,
    title: "Essential Business FAQs",
    desc: "The most common questions foreign entrepreneurs ask about setup, taxes, visas, Saudization, and more — all answered.",
    to: "/startup-guide/business-faq",
    color: "from-sky-500 to-indigo-400",
    tag: "FAQ Guide",
    available: true,
  },
  {
    icon: Crown,
    title: "Premium Residency Guide",
    desc: "Everything about Saudi Arabia's Iqama Mumayza — 7 pathways, privileges, real estate rights, and how to apply.",
    to: "/startup-guide/premium-residency",
    color: "from-amber-500 to-yellow-400",
    tag: "Residency",
    available: true,
  },
  {
    icon: Building2,
    title: "Company Registration (CR)",
    desc: "How to register your company with the Ministry of Commerce — name reservation, Articles of Association, and more.",
    to: "/startup-guide/company-registration",
    color: "from-violet-500 to-indigo-400",
    tag: "Company Setup",
    available: true,
  },
  {
    icon: FileText,
    title: "Personal License",
    desc: "Everything about the freelance and personal business license for individuals in Saudi Arabia.",
    to: "/startup-guide/personal-license",
    color: "from-emerald-500 to-teal-400",
    tag: "Freelance",
    available: false,
  },
  {
    icon: GraduationCap,
    title: "Incubators & Accelerators",
    desc: "A complete directory of approved incubators, accelerators, and VC programs recognized by MISA.",
    to: "/startup-guide/incubators",
    color: "from-amber-500 to-yellow-400",
    tag: "Programs",
    available: true,
  },
  {
    icon: Landmark,
    title: "Bank Account & ZATCA",
    desc: "How to open a corporate bank account, register with ZATCA for taxes, and set up compliance.",
    to: "/startup-guide/banking-tax",
    color: "from-sky-500 to-blue-400",
    tag: "Finance & Tax",
    available: false,
  },
  {
    icon: Users,
    title: "Visas & Work Permits",
    desc: "Iqama process, work visa sponsorship, and how to bring your team to Saudi Arabia.",
    to: "/startup-guide/visas",
    color: "from-pink-500 to-fuchsia-400",
    tag: "Immigration",
    available: false,
  },
  {
    icon: Scale,
    title: "Legal & Compliance",
    desc: "Understanding Saudi business law, contracts, IP protection, and regulatory requirements.",
    to: "/startup-guide/legal",
    color: "from-cyan-500 to-teal-400",
    tag: "Legal",
    available: false,
  },
  {
    icon: HandCoins,
    title: "Funding & Grants",
    desc: "Government grants, VC landscape, and funding options available for startups in KSA.",
    to: "/startup-guide/funding",
    color: "from-orange-500 to-red-400",
    tag: "Funding",
    available: false,
  },
  {
    icon: Rocket,
    title: "Startup Ecosystem Overview",
    desc: "How the Saudi startup ecosystem works — key players, hubs, Vision 2030 sectors, and opportunities.",
    to: "/startup-guide/ecosystem",
    color: "from-lime-500 to-green-400",
    tag: "Ecosystem",
    available: false,
  },
];

/* ─── Component ─── */

const StartupGuide = () => {
  usePageSEO({
    title: "Startup Guide",
    description: "Your complete guide to starting a business in Saudi Arabia. Licensing, company registration, incubators, funding, visas, and everything you need to know.",
    path: "/startup-guide",
  });

  const availableGuides = guides.filter((g) => g.available);
  const comingSoonGuides = guides.filter((g) => !g.available);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full gradient-bg opacity-[0.07] blur-[120px]" />

        <div className="px-4 sm:container py-20 sm:py-28 md:py-36 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">Community Knowledge Base</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
              Your Complete
              <br />
              <span className="gradient-text">Startup Guide</span> for Saudi Arabia
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Everything you need to know about starting and running a business in KSA — licensing, registration, funding, visas, and more. All in one place.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span><strong className="text-foreground">{guides.length}</strong> Topics</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span><strong className="text-foreground">{availableGuides.length}</strong> Live</span>
              </div>
              <span className="text-border">•</span>
              <span>Free & Open</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured: Founder's Playbook */}
      <section className="py-10 sm:py-14 border-t border-border/40">
        <div className="px-4 sm:container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Link to="/founders-playbook" className="group block">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
                <div className="absolute inset-0 gradient-bg opacity-[0.06] group-hover:opacity-[0.12] transition-opacity" />
                <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium gradient-bg text-white">New</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">The Real Talk</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      The Founder's Playbook
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      The brutally honest knowledge base. Real timelines vs. official timelines. Real costs vs. official costs. Common mistakes, rejection reasons, and insider tips that nobody tells you.
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:block" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Available Guides */}
      <section className="py-16 sm:py-24 border-t border-border/40">
        <div className="px-4 sm:container">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Available Now</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
              Start Reading
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
            {availableGuides.map((guide, i) => (
              <motion.div
                key={guide.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Link to={guide.to} className="group block h-full">
                  <div className="relative rounded-2xl border border-border/50 bg-card p-6 sm:p-8 h-full hover:border-primary/30 hover:shadow-lg transition-all">
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${guide.color} opacity-[0.06] blur-[60px] group-hover:opacity-[0.15] transition-opacity`} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <guide.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium bg-gradient-to-r ${guide.color} text-white`}>
                          {guide.tag}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{guide.desc}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Read guide <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Guides */}
      <section className="py-16 sm:py-24 bg-muted/30 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="px-4 sm:container relative">
          <motion.div className="mb-10 sm:mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">More Guides</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Coming Soon
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">We're building out more guides to cover every aspect of starting up in Saudi Arabia.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl">
            {comingSoonGuides.map((guide, i) => (
              <motion.div
                key={guide.title}
                className="relative rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 opacity-80"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${guide.color} opacity-60 flex items-center justify-center`}>
                    <guide.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-muted text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold mb-1">{guide.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{guide.desc}</p>
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
