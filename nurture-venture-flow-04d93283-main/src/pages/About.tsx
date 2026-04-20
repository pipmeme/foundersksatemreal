import { usePageSEO } from "@/hooks/use-page-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Mail,
  MapPin,
  Send,
  BookOpen,
  Mic,
  Rocket,
  Lightbulb,
  Shield,
  ArrowRight,
  Globe,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const pillars = [
  {
    icon: BookOpen,
    title: "Startup Guide",
    desc: "The most comprehensive free resource for starting a business in KSA — licensing, registration, visas, and funding.",
    color: "from-rose-500 to-orange-400",
    to: "/startup-guide",
  },
  {
    icon: Mic,
    title: "Founder Stories",
    desc: "In-depth editorial features on the founders behind Saudi Arabia's most ambitious companies.",
    color: "from-emerald-500 to-teal-400",
    to: "/stories",
  },
  {
    icon: Rocket,
    title: "Rising Founders",
    desc: "A curated spotlight on early-stage founders making moves in the Kingdom.",
    color: "from-violet-500 to-indigo-400",
    to: "/rising-founders",
  },
  {
    icon: Lightbulb,
    title: "Ecosystem Insights",
    desc: "Data-driven analysis on Saudi Arabia's startup ecosystem and Vision 2030 impact.",
    color: "from-amber-500 to-yellow-400",
    to: "/insights",
  },
];

const dataSources = [
  { name: "MISA", full: "Ministry of Investment", icon: Globe },
  { name: "Ministry of Commerce", full: "Commercial Registration", icon: FileText },
  { name: "GOSI", full: "General Organization for Social Insurance", icon: Users },
  { name: "ZATCA", full: "Zakat, Tax & Customs Authority", icon: BarChart3 },
];

const values = [
  {
    icon: Target,
    title: "Mission",
    description:
      "To empower aspiring entrepreneurs with the knowledge, resources, and inspiration they need to build successful businesses in Saudi Arabia.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "A thriving Saudi entrepreneurial ecosystem where every founder has access to clear guidance and a supportive community.",
  },
  {
    icon: Heart,
    title: "Values",
    description:
      "Transparency, accessibility, and authenticity. We believe real stories and practical guides make the difference.",
  },
];

const About = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  usePageSEO({
    title: "About Founders KSA",
    description:
      "Learn about Founders KSA — our mission to make entrepreneurship in Saudi Arabia accessible, transparent, and inspiring for everyone.",
    path: "/about",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await supabase.functions.invoke("send-subscription", {
        body: { ...formData, type: "contact" },
      });
      if (res.error) throw res.error;
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero — bold, editorial */}
      <section className="relative overflow-hidden py-14 sm:py-24 md:py-32">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full gradient-bg opacity-[0.06] blur-[120px]" />
        <div className="px-4 sm:container relative">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              About the Platform
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight">
              The Definitive Platform for{" "}
              <span className="gradient-text">Saudi Entrepreneurship</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Founders KSA connects, educates, and amplifies the founders shaping Saudi Arabia's future economy. We provide the resources that didn't exist when we needed them.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Why We Exist — origin story without personal info */}
      <section className="py-14 sm:py-20 border-t border-border/40">
        <div className="px-4 sm:container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                Why We Exist
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                The Information Gap <span className="gradient-text">Had to Close</span>
              </motion.h2>
              <motion.div variants={fadeUp} custom={2} className="text-sm sm:text-base text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  Finding clear, reliable information about starting a business in Saudi Arabia was unnecessarily difficult. Government portals, scattered blog posts, and word-of-mouth advice left aspiring entrepreneurs confused.
                </p>
                <p>
                  Founders KSA was built to change that — a single destination with comprehensive licensing guides, authentic founder stories, and real ecosystem data. No fluff, no gatekeeping.
                </p>
              </motion.div>
            </motion.div>

            {/* Values cards — stacked on the right */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
              {values.map((v, i) => (
                <motion.div key={v.title} variants={fadeUp} custom={i} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card">
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                    <v.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold mb-0.5">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do — Platform Pillars */}
      <section className="py-14 sm:py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full gradient-bg opacity-[0.03] blur-[100px]" />
        <div className="px-4 sm:container relative">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">What We Do</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Four Pillars. <span className="gradient-text">One Platform.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Everything a founder needs to navigate the Saudi ecosystem — from day one to scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {pillars.map((p, i) => (
              <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={p.to} className="group block">
                  <div className="relative rounded-2xl border border-border/50 bg-card p-5 sm:p-7 h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${p.color} opacity-[0.06] blur-[40px] group-hover:opacity-[0.15] transition-opacity`} />
                    <div className="relative flex gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <p.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources We Trust */}
      <section className="py-14 sm:py-20 border-t border-border/40">
        <div className="px-4 sm:container">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
              <Shield className="h-3.5 w-3.5" /> Verified Information
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Data Sources We <span className="gradient-text">Trust</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Every guide and resource on Founders KSA is built from official government data and verified institutional sources.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {dataSources.map((s, i) => (
              <motion.div key={s.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="text-center p-4 sm:p-6 rounded-xl border border-border/50 bg-card"
              >
                <div className="w-10 h-10 mx-auto rounded-lg gradient-bg flex items-center justify-center mb-3">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="font-display text-sm font-bold mb-0.5">{s.name}</p>
                <p className="text-[0.65rem] sm:text-xs text-muted-foreground leading-tight">{s.full}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-14 sm:py-20 bg-muted/30">
        <div className="px-4 sm:container">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-2xl sm:text-3xl font-bold mb-2">
                Get in <span className="gradient-text">Touch</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-sm sm:text-base">
                Have a question, want to share your story, or collaborate? We'd love to hear from you.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-6 sm:gap-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-2 space-y-4">
                <motion.div variants={fadeUp} custom={0} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm mb-0.5">Email</h4>
                    <p className="text-xs text-muted-foreground">info@foundersksa.com</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} custom={1} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm mb-0.5">Location</h4>
                    <p className="text-xs text-muted-foreground">Riyadh, Saudi Arabia</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="md:col-span-3">
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Input placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Input type="email" placeholder="Your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                      </div>
                      <Textarea placeholder="Your message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                      <Button type="submit" disabled={submitting} className="gradient-bg border-0 text-primary-foreground hover:opacity-90 w-full sm:w-auto">
                        {submitting ? "Sending..." : "Send Message"} {!submitting && <Send className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
