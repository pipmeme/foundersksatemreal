import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  X,
  CornerDownLeft,
  Rocket,
  SkipForward,
  Sparkles,
  User,
  Building2,
  Banknote,
  MessageSquare,
} from "lucide-react";

interface FounderApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFeatureType?: "founder_story" | "rising_founder";
}

// ── Section definitions ───────────────────────────────────────────
type Section = "welcome" | "startup" | "you" | "funding" | "final";
const SECTION_META: Record<Section, { label: string; icon: typeof Rocket; color: string }> = {
  welcome: { label: "Welcome", icon: Sparkles, color: "text-primary" },
  startup: { label: "Your Startup", icon: Building2, color: "text-primary" },
  you: { label: "About You", icon: User, color: "text-primary" },
  funding: { label: "Funding & Support", icon: Banknote, color: "text-primary" },
  final: { label: "Final Thoughts", icon: MessageSquare, color: "text-primary" },
};

// ── Step definitions ──────────────────────────────────────────────
interface Step {
  id: string;
  section: Section;
  question: string;
  subtitle?: string;
  type: "text" | "email" | "select" | "textarea" | "choice" | "cofounder" | "welcome" | "group";
  field: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  maxLength?: number;
  conditional?: (form: Record<string, any>) => boolean;
  // For "group" type — multiple fields in one step
  fields?: {
    field: string;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
  }[];
}

const STEPS: Step[] = [
  // ── Welcome ─────────────────────────────────────────────────────
  {
    id: "welcome",
    section: "welcome",
    question: "Get featured on Founders KSA",
    subtitle: "We'll ask a few questions about your startup and you. Takes about 3 minutes. Your answers help us craft the best feature for you.",
    type: "welcome",
    field: "_welcome",
  },
  // ── Feature type ────────────────────────────────────────────────
  {
    id: "feature_type",
    section: "startup",
    question: "How would you like to be featured?",
    subtitle: "Choose the spotlight that fits your journey.",
    type: "choice",
    field: "feature_type",
    required: true,
    options: [
      { value: "rising_founder", label: "🚀 Rising Founders — Early-stage spotlight" },
      { value: "founder_story", label: "📖 Founder Story — In-depth feature" },
    ],
  },
  // ── Startup details (the exciting part first) ───────────────────
  {
    id: "company_name",
    section: "startup",
    question: "What's your startup called?",
    type: "text",
    field: "company_name",
    required: true,
    placeholder: "e.g. Tamara, Salla, Foodics",
  },
  {
    id: "one_liner",
    section: "startup",
    question: "Describe it in one sentence ✍️",
    subtitle: "The elevator pitch. Make it count.",
    type: "text",
    field: "one_liner",
    required: true,
    placeholder: "We help [who] do [what] by [how]",
    maxLength: 200,
  },
  {
    id: "industry",
    section: "startup",
    question: "What industry are you in?",
    type: "choice",
    field: "industry",
    required: true,
    options: [
      "Fintech", "E-Commerce", "SaaS", "AI",
      "Healthcare", "EdTech", "Gaming", "Biotech",
      "Consultancy", "Travel & Tourism", "Logistics",
      "Real Estate", "Food & Beverage", "Other",
    ].map((i) => ({ value: i, label: i })),
  },
  {
    id: "stage",
    section: "startup",
    question: "What stage is your startup at?",
    type: "choice",
    field: "stage",
    required: true,
    options: [
      { value: "idea", label: "💡 Idea Stage" },
      { value: "mvp", label: "🛠 MVP" },
      { value: "pre_seed", label: "🌱 Pre-seed" },
      { value: "seed", label: "🌿 Seed" },
      { value: "series_a", label: "📈 Series A" },
      { value: "series_b_plus", label: "🚀 Series B+" },
      { value: "profitable", label: "💰 Profitable" },
    ],
  },
  {
    id: "startup_details",
    section: "startup",
    question: "A few more startup details",
    subtitle: "All optional — share what you're comfortable with.",
    type: "group",
    field: "_startup_details",
    fields: [
      { field: "founded_date", label: "When did you start?", placeholder: "e.g. Jan 2024" },
      { field: "team_size", label: "Total team size", placeholder: "e.g. 5" },
      { field: "company_website", label: "Website", placeholder: "https://yoursite.com" },
      { field: "social_media", label: "Social media", placeholder: "@handle or URL" },
    ],
  },
  // ── Founders ────────────────────────────────────────────────────
  {
    id: "num_cofounders",
    section: "you",
    question: "How many founders in total?",
    subtitle: "Including yourself.",
    type: "choice",
    field: "num_cofounders",
    required: true,
    options: ["1", "2", "3", "4", "5"].map((n) => ({
      value: n,
      label: n === "1" ? "Solo founder" : `${n} founders`,
    })),
  },
  {
    id: "founder_role",
    section: "you",
    question: "What's your role in the company?",
    type: "choice",
    field: "founder_role",
    required: true,
    options: [
      { value: "CEO", label: "🎯 CEO — Chief Executive Officer" },
      { value: "CTO", label: "💻 CTO — Chief Technology Officer" },
      { value: "COO", label: "⚙️ COO — Chief Operating Officer" },
      { value: "CFO", label: "💰 CFO — Chief Financial Officer" },
      { value: "CPO", label: "📦 CPO — Chief Product Officer" },
      { value: "CMO", label: "📣 CMO — Chief Marketing Officer" },
      { value: "Other", label: "✏️ Other" },
    ],
  },
  {
    id: "cofounders",
    section: "you",
    question: "Tell us about your co-founders",
    subtitle: "Name, role, age, and education for each co-founder.",
    type: "cofounder",
    field: "cofounders",
    conditional: (form) => parseInt(form.num_cofounders || "1") > 1,
  },
  // ── Personal details ────────────────────────────────────────────
  {
    id: "founder_name",
    section: "you",
    question: "What's your full name?",
    subtitle: "The lead founder's name.",
    type: "text",
    field: "founder_name",
    required: true,
    placeholder: "e.g. Ahmed Al-Farsi",
  },
  {
    id: "email",
    section: "you",
    question: "What's your email?",
    subtitle: "We'll only use this to reach out about your feature.",
    type: "email",
    field: "email",
    required: true,
    placeholder: "you@example.com",
  },
  {
    id: "personal_details",
    section: "you",
    question: "A bit more about you",
    subtitle: "All optional — helps us personalize your feature.",
    type: "group",
    field: "_personal_details",
    fields: [
      { field: "phone", label: "Phone", placeholder: "+966 5XX XXX XXXX" },
      { field: "age", label: "Age", placeholder: "e.g. 28" },
      { field: "education", label: "Education", placeholder: "e.g. BSc CS, KAUST" },
      { field: "linkedin_url", label: "LinkedIn", placeholder: "linkedin.com/in/..." },
    ],
  },
  {
    id: "location",
    section: "you",
    question: "Where are you based?",
    type: "group",
    field: "_location",
    fields: [
      { field: "country", label: "Country", placeholder: "e.g. Saudi Arabia", required: true },
      { field: "city", label: "City", placeholder: "e.g. Riyadh" },
    ],
  },
  {
    id: "gender",
    section: "you",
    question: "Your gender?",
    type: "choice",
    field: "gender",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  // ── Funding & Support ───────────────────────────────────────────
  {
    id: "is_incubated",
    section: "funding",
    question: "Are you part of an incubator or accelerator?",
    type: "choice",
    field: "is_incubated",
    options: [
      { value: "yes", label: "✅ Yes" },
      { value: "no", label: "Not yet" },
    ],
  },
  {
    id: "incubator_name",
    section: "funding",
    question: "Which one?",
    subtitle: "Name the incubator or accelerator.",
    type: "text",
    field: "incubator_name",
    placeholder: "e.g. Flat6Labs, KAUST Innovation",
    conditional: (form) => form.is_incubated === "yes",
  },
  {
    id: "funding_type",
    section: "funding",
    question: "How are you funded?",
    type: "choice",
    field: "funding_type",
    options: [
      { value: "bootstrapped", label: "🏗 Bootstrapped" },
      { value: "angel", label: "👼 Angel" },
      { value: "vc", label: "🏦 VC" },
      { value: "grant", label: "🎁 Grant" },
      { value: "mixed", label: "🔀 Mixed" },
    ],
  },
  {
    id: "funding_details",
    section: "funding",
    question: "Funding & revenue details",
    subtitle: "All optional — skip if you prefer.",
    type: "group",
    field: "_funding_details",
    conditional: (form) => !!form.funding_type,
    fields: [
      { field: "funding_amount", label: "Amount raised", placeholder: "e.g. $100K, SAR 500K" },
      { field: "grants_received", label: "Grants received", placeholder: "e.g. Monsha'at, SIDF" },
      { field: "revenue", label: "Monthly revenue", placeholder: "e.g. $5K or Pre-revenue" },
    ],
  },
  // ── Final ───────────────────────────────────────────────────────
  {
    id: "message",
    section: "final",
    question: "Anything else you'd like us to know?",
    subtitle: "Your story, vision, biggest challenge — anything that makes you unique.",
    type: "textarea",
    field: "message",
    placeholder: "Share what makes your journey special...",
    maxLength: 1000,
  },
];

// ── Component ─────────────────────────────────────────────────────
const FounderApplicationForm = ({
  open,
  onOpenChange,
  defaultFeatureType = "rising_founder",
}: FounderApplicationFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<Record<string, any>>({
    feature_type: defaultFeatureType,
    num_cofounders: "1",
  });
  const [cofounders, setCofounders] = useState<{ name: string; role: string; age: string; education: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const visibleSteps = STEPS.filter(
    (step) => !step.conditional || step.conditional(form)
  );
  const step = visibleSteps[currentStep];
  const totalSteps = visibleSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const sectionMeta = step ? SECTION_META[step.section] : null;

  // Section progress
  const sections: Section[] = ["startup", "you", "funding", "final"];
  const currentSectionIndex = step ? sections.indexOf(step.section) : 0;

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  // Auto-focus input
  useEffect(() => {
    if (open && step && !["choice", "cofounder", "welcome"].includes(step.type)) {
      const timer = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [currentStep, open, step?.type]);

  // Sync cofounders
  useEffect(() => {
    const count = Math.max(0, parseInt(form.num_cofounders || "1") - 1);
    setCofounders((prev) => {
      const updated = [...prev];
      while (updated.length < count) updated.push({ name: "", role: "", age: "", education: "" });
      return updated.slice(0, count);
    });
  }, [form.num_cofounders]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canProceed = useCallback(() => {
    if (!step) return false;
    if (step.type === "welcome") return true;
    if (step.type === "cofounder") return true;
    if (step.type === "group") {
      const requiredFields = step.fields?.filter((f) => f.required) || [];
      return requiredFields.every((f) => form[f.field]?.trim());
    }
    if (!step.required) return true;
    const val = form[step.field];
    if (!val || (typeof val === "string" && !val.trim())) return false;
    if (step.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    return true;
  }, [step, form]);

  const next = useCallback(() => {
    if (!canProceed()) {
      toast.error("Please fill in the required fields to continue");
      return;
    }
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [canProceed, currentStep, totalSteps]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!canProceed()) {
      toast.error("Please fill in the required fields");
      return;
    }
    setSubmitting(true);
    const filteredCofounders = cofounders.filter((c) => c.name.trim());

    const { error } = await supabase.from("founder_applications" as any).insert({
      founder_name: form.founder_name || "",
      email: form.email || "",
      phone: form.phone || null,
      country: form.country || "",
      city: form.city || null,
      linkedin_url: form.linkedin_url || null,
      age: form.age || null,
      gender: form.gender || null,
      education: form.education || null,
      company_name: form.company_name || "",
      company_website: form.company_website || null,
      industry: form.industry || "",
      one_liner: form.one_liner || "",
      num_cofounders: parseInt(form.num_cofounders) || 1,
      founded_date: form.founded_date || null,
      stage: form.stage || "",
      is_incubated: form.is_incubated === "yes",
      incubator_name: form.is_incubated === "yes" ? form.incubator_name || null : null,
      funding_amount: form.funding_amount || null,
      funding_type: form.funding_type || null,
      grants_received: form.grants_received || null,
      team_size: form.team_size || null,
      revenue: form.revenue || null,
      social_media: form.social_media || null,
      feature_type: form.feature_type || defaultFeatureType,
      message: form.message || null,
      founder_role: form.founder_role === "Other" ? (form.founder_role_custom || "Other") : (form.founder_role || null),
      cofounder_details: filteredCofounders.length > 0 ? filteredCofounders : null,
    } as any);

    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  }, [canProceed, cofounders, form, defaultFeatureType]);

  // Keyboard: Enter, ESC, A-Z shortcuts
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      // ESC to close
      if (e.key === "Escape") { handleClose(); return; }

      // Back navigation with Backspace (only when not typing in an input)
      if (e.key === "Backspace" && currentStep > 0) {
        const tag = (e.target as HTMLElement)?.tagName;
        const isInput = tag === "INPUT" || tag === "TEXTAREA";
        const inputVal = isInput ? (e.target as HTMLInputElement).value : "";
        if (!isInput || !inputVal) {
          e.preventDefault();
          prev();
          return;
        }
      }

      // Letter shortcuts for choice steps
      if (step?.type === "choice" && step.options && !e.metaKey && !e.ctrlKey) {
        const idx = e.key.toUpperCase().charCodeAt(0) - 65;
        if (idx >= 0 && idx < step.options.length) {
          e.preventDefault();
          update(step.field, step.options[idx].value);
          setTimeout(() => {
            if (currentStep < totalSteps - 1) {
              setDirection(1);
              setCurrentStep((s) => s + 1);
            }
          }, 200);
          return;
        }
      }

      // Enter to advance
      if (e.key === "Enter" && !e.shiftKey) {
        if (step?.type === "textarea") return;
        e.preventDefault();
        if (currentStep === totalSteps - 1) {
          handleSubmit();
        } else {
          next();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, next, currentStep, totalSteps, step, handleSubmit]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setCurrentStep(0);
      setForm({ feature_type: defaultFeatureType, num_cofounders: "1" });
      setCofounders([]);
    }, 300);
  };

  if (!open) return null;

  // ── Success Screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <button onClick={handleClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-6 w-6" />
        </button>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6 max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">You're in! 🎉</h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
            We've received your application. Our editorial team will review it and reach out within <span className="font-semibold text-foreground">48 hours</span> if you're selected.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Keep building. Your story matters.
          </p>
          <Button onClick={handleClose} size="lg" className="gradient-bg text-primary-foreground px-8">
            Back to stories
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Renderers ───────────────────────────────────────────────────
  const updateCofounder = (index: number, field: string, value: string) => {
    setCofounders((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const isOptionalStep = !step?.required && step?.type !== "welcome" && step?.type !== "group";
  const hasGroupRequired = step?.type === "group" && step.fields?.some((f) => f.required);

  const renderInput = () => {
    if (!step) return null;

    // Welcome screen
    if (step.type === "welcome") {
      return (
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {sections.map((s) => {
              const meta = SECTION_META[s];
              const Icon = meta.icon;
              return (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  <Icon className="h-3 w-3" />
                  {meta.label}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            ⌨️ Pro tip: <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[0.6rem]">Enter</kbd> to advance · <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[0.6rem]">Backspace</kbd> to go back · Letter keys <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[0.6rem]">A</kbd> <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[0.6rem]">B</kbd> <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[0.6rem]">C</kbd> to pick options.
          </p>
        </div>
      );
    }

    // Choice
    if (step.type === "choice" && step.options) {
      const manyOptions = step.options.length > 6;
      const isOtherSelected = form[step.field] === "Other";
      const hasOtherOption = step.options.some((o) => o.value === "Other");
      return (
        <div className="w-full max-w-lg">
          <div className={`${manyOptions ? "grid grid-cols-2 gap-2" : "space-y-2.5"}`}>
            {step.options.map((opt, i) => {
              const selected = form[step.field] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    update(step.field, opt.value);
                    // Don't auto-advance if "Other" is selected — wait for custom input
                    if (opt.value === "Other") {
                      // Clear custom value so user can type fresh
                      update(`${step.field}_custom`, form[`${step.field}_custom`] || "");
                      return;
                    }
                    // Clear any custom value when picking a preset
                    update(`${step.field}_custom`, "");
                    setTimeout(() => {
                      if (currentStep < totalSteps - 1) {
                        setDirection(1);
                        setCurrentStep((s) => s + 1);
                      }
                    }, 200);
                  }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-2.5 group ${
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-md text-[0.65rem] font-bold shrink-0 transition-colors ${
                    selected ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {selected ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className={`text-sm font-medium ${selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Custom "Other" text input */}
          {hasOtherOption && isOtherSelected && (
            <div className="mt-4">
              <Input
                autoFocus
                value={form[`${step.field}_custom`] || ""}
                onChange={(e) => update(`${step.field}_custom`, e.target.value)}
                placeholder="Type your role, e.g. Director, Managing Partner..."
                className="h-12 text-base border-2 border-primary/30 rounded-xl px-4 focus-visible:ring-0 focus-visible:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && form[`${step.field}_custom`]?.trim()) {
                    e.preventDefault();
                    next();
                  }
                }}
              />
              <div className="mt-3 flex items-center gap-2.5">
                <Button
                  onClick={next}
                  disabled={!form[`${step.field}_custom`]?.trim()}
                  className="gradient-bg text-primary-foreground px-6 h-10 text-sm font-semibold gap-2"
                >
                  OK <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {currentStep > 0 && (
            <button
              onClick={prev}
              className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Go back & edit
            </button>
          )}
        </div>
      );
    }

    // Co-founder inputs
    if (step.type === "cofounder") {
      const count = Math.max(0, parseInt(form.num_cofounders || "1") - 1);
      const roleOptions = ["CEO", "CTO", "COO", "CFO", "CPO", "CMO", "Other"];
      return (
        <div className="space-y-4 w-full max-w-lg">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-3 bg-card">
              <p className="text-sm font-semibold text-foreground">Co-founder {i + 1}</p>
              <Input
                placeholder="Full name"
                value={cofounders[i]?.name || ""}
                onChange={(e) => updateCofounder(i, "name", e.target.value)}
                className="h-11 text-sm"
              />
              <select
                value={["CEO", "CTO", "COO", "CFO", "CPO", "CMO"].includes(cofounders[i]?.role || "") ? cofounders[i]?.role : cofounders[i]?.role ? "custom" : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateCofounder(i, "role", val === "custom" ? "" : val);
                }}
                className="w-full h-11 text-sm rounded-md border border-input bg-background px-3 text-foreground"
              >
                <option value="">Select role...</option>
                {["CEO", "CTO", "COO", "CFO", "CPO", "CMO"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="custom">Other (type your own)</option>
              </select>
              {!["", "CEO", "CTO", "COO", "CFO", "CPO", "CMO"].includes(cofounders[i]?.role || "") && (
                <Input
                  autoFocus
                  placeholder="Type role, e.g. Director, VP of Sales..."
                  value={cofounders[i]?.role === "custom" ? "" : cofounders[i]?.role || ""}
                  onChange={(e) => updateCofounder(i, "role", e.target.value || "")}
                  className="h-11 text-sm"
                />
              )}
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  placeholder="Age"
                  value={cofounders[i]?.age || ""}
                  onChange={(e) => updateCofounder(i, "age", e.target.value)}
                  className="h-11 text-sm"
                />
                <Input
                  placeholder="Education"
                  value={cofounders[i]?.education || ""}
                  onChange={(e) => updateCofounder(i, "education", e.target.value)}
                  className="h-11 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Group — multiple fields in one step
    if (step.type === "group" && step.fields) {
      return (
        <div className="space-y-4 w-full max-w-lg">
          {step.fields.map((f) => (
            <div key={f.field} className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                {f.label}
                {f.required && <span className="text-primary text-xs">*</span>}
              </label>
              <Input
                value={form[f.field] || ""}
                onChange={(e) => update(f.field, e.target.value)}
                placeholder={f.placeholder}
                className="h-12 text-base border-border bg-card"
              />
            </div>
          ))}
        </div>
      );
    }

    // Textarea
    if (step.type === "textarea") {
      const val = form[step.field] || "";
      return (
        <div className="w-full max-w-lg">
          <Textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={val}
            onChange={(e) => update(step.field, e.target.value)}
            placeholder={step.placeholder}
            maxLength={step.maxLength}
            rows={5}
            className="text-base bg-transparent border-2 border-border rounded-xl px-4 py-3 focus-visible:ring-0 focus-visible:border-primary resize-none placeholder:text-muted-foreground/50"
          />
          {step.maxLength && (
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {val.length} / {step.maxLength}
            </p>
          )}
        </div>
      );
    }

    // Text / email input
    const val = form[step.field] || "";
    return (
      <div className="w-full max-w-lg">
        <Input
          ref={inputRef as React.Ref<HTMLInputElement>}
          type={step.type === "email" ? "email" : "text"}
          value={val}
          onChange={(e) => update(step.field, e.target.value)}
          placeholder={step.placeholder}
          maxLength={step.maxLength}
          className="h-14 text-lg sm:text-xl bg-transparent border-0 border-b-2 border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/40 font-medium"
        />
        {step.maxLength && (
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {val.length} / {step.maxLength}
          </p>
        )}
      </div>
    );
  };

  const isLastStep = currentStep === totalSteps - 1;
  const showActionButtons = step && !["choice", "welcome"].includes(step.type);
  const showWelcomeCTA = step?.type === "welcome";

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Rocket className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-sm">Get Featured</span>
        </div>
        <div className="flex items-center gap-3">
          {step?.section !== "welcome" && sectionMeta && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              {(() => { const Icon = sectionMeta.icon; return <Icon className="h-3.5 w-3.5" />; })()}
              {sectionMeta.label}
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground tabular-nums">
            {Math.round(progress)}%
          </span>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted relative">
        <motion.div
          className="h-full gradient-bg"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Section breadcrumbs (desktop) */}
      {step?.section !== "welcome" && (
        <div className="hidden sm:flex items-center gap-1 px-8 pt-3">
          {sections.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              {i > 0 && <span className="text-border mx-0.5">›</span>}
              <span className={`text-[0.65rem] font-medium ${
                s === step?.section
                  ? "text-primary"
                  : i < currentSectionIndex
                  ? "text-muted-foreground"
                  : "text-muted-foreground/40"
              }`}>
                {SECTION_META[s].label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step?.id}
            custom={direction}
            initial={{ opacity: 0, y: direction * 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-2xl py-8"
          >
            {/* Step number + required badge */}
            {step?.section !== "welcome" && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-muted-foreground/60">
                  {currentStep} →
                </span>
                {step?.required && (
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-primary">
                    Required
                  </span>
                )}
              </div>
            )}

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {step?.question}
            </h2>
            {step?.subtitle && (
              <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
                {step.subtitle}
              </p>
            )}
            {!step?.subtitle && <div className="mb-8" />}

            {renderInput()}

            {/* Action buttons */}
            {showActionButtons && (
              <div className="mt-8 flex items-center gap-2.5 flex-wrap">
                <Button
                  onClick={isLastStep ? handleSubmit : next}
                  disabled={submitting || (step?.required && !canProceed()) || (hasGroupRequired && !canProceed())}
                  className="gradient-bg text-primary-foreground px-6 h-11 text-sm font-semibold gap-2"
                >
                  {submitting ? "Submitting..." : isLastStep ? (
                    <>Submit <Check className="h-4 w-4" /></>
                  ) : (
                    <>OK <Check className="h-4 w-4" /></>
                  )}
                </Button>
                {isOptionalStep && !isLastStep && (
                  <Button
                    variant="ghost"
                    onClick={next}
                    className="text-muted-foreground gap-1.5 h-11 text-sm"
                  >
                    Skip <SkipForward className="h-3.5 w-3.5" />
                  </Button>
                )}
                <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1 ml-1">
                  press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[0.6rem]">Enter ↵</kbd>
                </span>
              </div>
            )}
            {showWelcomeCTA && (
              <div className="mt-8">
                <Button
                  onClick={next}
                  size="lg"
                  className="gradient-bg text-primary-foreground px-8 h-12 text-base font-semibold gap-2"
                >
                  Let's go <ArrowRight className="h-5 w-5" />
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  or press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[0.6rem]">Enter ↵</kbd>
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={prev}
          disabled={currentStep === 0}
          className="gap-1.5 text-muted-foreground h-9"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        {/* Section dots — one per section, not per step */}
        <div className="flex gap-1.5">
          {sections.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step?.section
                  ? "w-8 gradient-bg"
                  : i < currentSectionIndex
                  ? "w-3 bg-primary/30"
                  : "w-3 bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={isLastStep ? handleSubmit : next}
          disabled={submitting || (step?.required && !canProceed())}
          className="gap-1.5 text-muted-foreground h-9"
        >
          <span className="hidden sm:inline">{isLastStep ? "Submit" : "Next"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FounderApplicationForm;
