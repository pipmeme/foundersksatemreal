import { usePageSEO } from "@/hooks/use-page-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Rocket,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";

const helpOptions = [
  "Website",
  "Instagram & Social Media",
  "Logo & Branding",
  "Posters & Flyers",
  "Business Cards",
  "Other",
];

const FreeKickstart = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    business_idea: "",
    help_needed: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  usePageSEO({
    title: "Free Kickstart — Founders KSA",
    description:
      "Get free help for your business. Website, branding, Instagram — we help founders and business owners in Saudi Arabia get online for free.",
    path: "/free-kickstart",
  });

  const toggleHelp = (item: string) => {
    setForm((prev) => ({
      ...prev,
      help_needed: prev.help_needed.includes(item)
        ? prev.help_needed.filter((h) => h !== item)
        : [...prev.help_needed, item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.help_needed.length === 0) {
      toast({ title: "Please select what help you need", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("kickstart_signups").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        business_idea: form.business_idea.trim(),
        help_needed: form.help_needed,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Kickstart submit error:", err);
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center py-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-5">
          <div className="w-16 h-16 mx-auto rounded-full gradient-bg flex items-center justify-center mb-5">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">You're In! 🎉</h1>
          <p className="text-muted-foreground text-base mb-1">
            We'll review your request and get back to you within 48 hours.
          </p>
          <p className="text-muted-foreground text-sm">Keep building — we've got your back.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-16 md:py-20">
      <div className="px-5 sm:container">
        <div className="max-w-lg mx-auto">
          {/* Hero text */}
          <motion.div initial="hidden" animate="visible" className="text-center mb-8 sm:mb-10">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-5">
              <Rocket className="h-4 w-4" /> 100% Free — No Catch
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              We'll Build Your <br className="sm:hidden" /><span className="gradient-text">First Step</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Need a website, logo, or social media? We volunteer our time to give founders their first push — <strong>completely free</strong>.
            </motion.p>
          </motion.div>

          {/* How it works — inline, minimal */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full gradient-bg text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
              Tell us what you need
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full gradient-bg text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
              We reach out
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full gradient-bg text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
              We deliver
            </span>
          </motion.div>

          {/* Form */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border/60 rounded-2xl p-5 sm:p-7 shadow-sm">
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
                className="bg-background"
              />
              <Input
                placeholder="WhatsApp number"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                required
                maxLength={20}
                className="bg-background"
              />
              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                maxLength={255}
                className="bg-background"
              />
              <Textarea
                placeholder="Tell us about your business and what you need..."
                rows={3}
                value={form.business_idea}
                onChange={(e) => setForm({ ...form, business_idea: e.target.value })}
                required
                maxLength={2000}
                className="bg-background"
              />

              <div>
                <p className="text-sm text-muted-foreground mb-2">What do you need help with?</p>
                <div className="flex flex-wrap gap-2">
                  {helpOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleHelp(option)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        form.help_needed.includes(option)
                          ? "gradient-bg text-primary-foreground"
                          : "bg-background border border-border hover:border-primary/40"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="gradient-bg border-0 text-primary-foreground hover:opacity-90 w-full text-base py-5"
              >
                {submitting ? "Sending..." : "Send — It's Free"} {!submitting && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeKickstart;
