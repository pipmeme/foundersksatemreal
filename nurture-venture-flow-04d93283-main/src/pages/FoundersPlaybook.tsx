import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { usePageSEO } from "@/hooks/use-page-seo";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  Clock,
  DollarSign,
  XCircle,
  CheckCircle2,
  Lightbulb,
  Shield,
  ChevronDown,
  ChevronUp,
  Zap,
  BookOpen,
  ArrowRight,
  Mail,
  Filter,
  BadgeCheck,
  Building2,
  CreditCard,
  Users,
  FileText,
  Landmark,
  Globe,
  Scale,
  Briefcase,
} from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ─── Types ─── */

type Severity = "critical" | "warning" | "info";
type Stage =
  | "pre-launch"
  | "misa-license"
  | "company-registration"
  | "hiring-compliance"
  | "banking-finance"
  | "visas-iqama"
  | "ongoing-compliance";

interface PlaybookEntry {
  id: string;
  stage: Stage;
  title: string;
  subtitle: string;
  severity: Severity;
  officialTimeline: string;
  realTimeline: string;
  officialCost: string;
  realCost: string;
  whatTheyTellYou: string;
  whatActuallyHappens: string;
  commonMistakes: string[];
  rejectionReasons?: string[];
  proTips: string[];
  gotchas: string[];
  tags: string[];
}

/* ─── Stage Metadata ─── */

const stageConfig: Record<Stage, { label: string; icon: typeof Building2; color: string }> = {
  "pre-launch": { label: "Pre-Launch", icon: Lightbulb, color: "from-amber-500 to-yellow-400" },
  "misa-license": { label: "MISA License", icon: BadgeCheck, color: "from-rose-500 to-orange-400" },
  "company-registration": { label: "Company Registration", icon: Building2, color: "from-violet-500 to-indigo-400" },
  "hiring-compliance": { label: "Hiring & Compliance", icon: Users, color: "from-emerald-500 to-teal-400" },
  "banking-finance": { label: "Banking & Finance", icon: Landmark, color: "from-sky-500 to-blue-400" },
  "visas-iqama": { label: "Visas & Iqama", icon: Globe, color: "from-pink-500 to-fuchsia-400" },
  "ongoing-compliance": { label: "Ongoing Compliance", icon: Shield, color: "from-cyan-500 to-teal-400" },
};

/* ─── Playbook Data ─── */

const playbookEntries: PlaybookEntry[] = [
  // PRE-LAUNCH
  {
    id: "choosing-entity-type",
    stage: "pre-launch",
    title: "Choosing the Wrong Entity Type",
    subtitle: "The most expensive mistake founders make before they even start",
    severity: "critical",
    officialTimeline: "Quick decision",
    realTimeline: "Should take 2–4 weeks of research",
    officialCost: "No cost to decide",
    realCost: "SAR 50,000–200,000+ to fix later (re-registration, new MISA license, legal fees)",
    whatTheyTellYou: "Just pick an LLC — it works for everyone.",
    whatActuallyHappens: "LLCs are great for trading and services, but if you're a tech startup planning to raise VC funding, the Simplified Joint Stock Company (SJSC) is far better. It supports share classes, ESOP structures, and investor-friendly governance. Switching later means dissolving and re-registering — months of delays and tens of thousands in legal costs.",
    commonMistakes: [
      "Registering as an LLC when planning VC fundraising — LLCs can't issue different share classes easily",
      "Opening a Branch when you should have formed a new entity — Branches carry full parent liability",
      "Ignoring the RHQ requirement — multinationals with Saudi government contracts must have an RHQ from 2024",
      "Choosing entity type based on advice from home country lawyers who don't understand Saudi law",
    ],
    proTips: [
      "If raising VC: go SJSC. Minimum capital is SAR 1 and it supports ESOP and convertible notes",
      "If bootstrapped services/trading: LLC is fine with no statutory minimum capital",
      "If already have a global company: consider Branch only if you don't want a separate legal entity",
      "Talk to a Saudi-licensed lawyer before filing — not your home country advisor",
    ],
    gotchas: [
      "The 'no minimum capital' for LLCs is misleading — banks typically require SAR 25,000+ deposited to open an account",
      "SJSC is newer and some older banks/government portals don't handle it well yet",
      "RHQ has significant local hiring requirements (30% Saudi, including C-level positions)",
    ],
    tags: ["entity", "LLC", "SJSC", "RHQ", "structure", "fundraising"],
  },
  {
    id: "wrong-cr-activity-code",
    stage: "pre-launch",
    title: "Selecting the Wrong CR Activity Code",
    subtitle: "Your business activities must exactly match what you actually do",
    severity: "critical",
    officialTimeline: "Part of CR registration",
    realTimeline: "Fixing it takes 2–6 weeks",
    officialCost: "Free to select",
    realCost: "SAR 5,000–15,000 in legal fees to amend, plus potential fines",
    whatTheyTellYou: "Just pick the activity that's closest to what you do.",
    whatActuallyHappens: "Saudi Arabia has a very specific activity classification system (ISIC Rev 4). If your CR activities don't match what you're actually doing, you can face license revocation, inability to invoice certain services, and issues with ZATCA (tax authority). Some activities are restricted for foreign companies entirely.",
    commonMistakes: [
      "Picking a broad category like 'general trading' without checking if your specific service is allowed",
      "Not realizing some activities are restricted for foreign companies (e.g., certain retail, real estate)",
      "Adding too many activities — each additional activity may require separate permits",
      "CR activities not matching MISA license activities — these MUST align",
    ],
    rejectionReasons: [
      "Activity code mismatch between MISA license and CR application",
      "Selecting restricted activities for foreign investors without required permits",
      "Description too vague — Ministry of Commerce requires specificity",
    ],
    proTips: [
      "Cross-reference your MISA license activities with the Ministry of Commerce ISIC codes BEFORE applying for CR",
      "If unsure, use the Ministry of Commerce online tool to look up activity codes",
      "Less is more — start with 2–3 core activities. You can add more later (for a fee)",
      "Some activities require additional sector-specific licenses (e.g., SDAIA for data, CMA for financial services)",
    ],
    gotchas: [
      "Adding 'consulting' as an activity is very common, but if you bill it as 'IT services', your invoices won't match your CR",
      "E-commerce requires a separate e-commerce license in addition to your CR",
      "Some banks check your CR activities against your invoices — mismatches delay payments",
    ],
    tags: ["CR", "activity code", "ISIC", "registration", "compliance"],
  },
  {
    id: "document-attestation",
    stage: "pre-launch",
    title: "Document Attestation — The Hidden 4-Week Blocker",
    subtitle: "Nobody tells you this takes a month before you can even start",
    severity: "warning",
    officialTimeline: "Not usually mentioned",
    realTimeline: "3–6 weeks from start to finish",
    officialCost: "Varies by country",
    realCost: "SAR 2,000–8,000 total (embassy fees, courier, notarization, translation)",
    whatTheyTellYou: "Just submit your documents.",
    whatActuallyHappens: "ALL documents from outside Saudi Arabia must go through a multi-step attestation process: Notarization in home country → MOFA attestation in home country → Saudi Embassy attestation → MOFA attestation in Saudi Arabia. Miss one step and your MISA application gets rejected. Different countries have different requirements and timelines.",
    commonMistakes: [
      "Starting the MISA application before getting documents attested — you can't submit without them",
      "Not translating documents to Arabic by a certified translator",
      "Using regular notarization instead of apostille (Hague Convention countries)",
      "Forgetting that EACH document needs attestation separately — board resolution, AoA, financials, passports",
    ],
    proTips: [
      "Start attestation immediately — don't wait until you're ready to apply for MISA",
      "Use a professional attestation service (Tasheer is commonly used for Saudi Embassy)",
      "Keep multiple attested copies — you'll need them for MISA, bank, and other registrations",
      "Digital attestation via the Saudi MOFA e-service (mofa.gov.sa) can speed things up once docs reach Saudi Arabia",
    ],
    gotchas: [
      "Attestation in some countries (e.g., India, Pakistan, Egypt) takes 4–6 weeks. Plan accordingly",
      "Some Saudi Embassies only accept documents on specific days — check the schedule",
      "If your parent company is in a country without a Saudi Embassy, you need to go through the nearest one",
    ],
    tags: ["documents", "attestation", "MOFA", "embassy", "preparation"],
  },

  // MISA LICENSE
  {
    id: "misa-application-process",
    stage: "misa-license",
    title: "MISA License Application — The Real Process",
    subtitle: "What happens after you click 'Submit' on the Invest Saudi portal",
    severity: "warning",
    officialTimeline: "5–7 business days",
    realTimeline: "2–6 weeks depending on sector and completeness",
    officialCost: "SAR 2,000 government fee",
    realCost: "SAR 15,000–40,000 (including legal consultant, PRO services, and document prep)",
    whatTheyTellYou: "Submit your application online and get approved in a week.",
    whatActuallyHappens: "The online submission is just the beginning. MISA reviews your application, often comes back with queries (additional documents, clarifications on business plan, questions about capital source). Each round of queries adds 1–2 weeks. Certain sectors (fintech, healthcare, education) require additional approvals from sector regulators BEFORE MISA will process.",
    commonMistakes: [
      "Submitting incomplete applications — missing even one document triggers a rejection/query loop",
      "Business plan too vague — MISA wants specifics: target market, revenue model, job creation plans",
      "Not having a Saudi legal representative — you need one for the application",
      "Applying for restricted activities without realizing they need sector-specific pre-approvals",
    ],
    rejectionReasons: [
      "Incomplete documentation (most common — 40% of first-time applications)",
      "Business plan doesn't demonstrate value-add to Saudi economy",
      "Parent company financial statements show losses (MISA wants stable investors)",
      "Applying for activities on the restricted/negative list for foreign investors",
      "Capital source concerns — especially if using personal funds without proper documentation",
    ],
    proTips: [
      "Hire a licensed Saudi law firm or MISA-specialized consultant — they know the reviewers' expectations",
      "In your business plan, emphasize job creation for Saudis, technology transfer, and Vision 2030 alignment",
      "If you're a startup without audited financials: get a support letter from a recognized VC or incubator (MISA accepts this)",
      "Apply during Q1 or Q3 — Q4 is slowest due to holidays and year-end reviews",
    ],
    gotchas: [
      "MISA license ≠ permission to operate. You still need CR, ZATCA, and potentially sector licenses",
      "License is valid for 1 year initially and must be renewed — many founders forget this",
      "If your MISA license expires before you complete CR, you have to restart the entire process",
      "MISA license activity list must EXACTLY match what you put in your CR — no exceptions",
    ],
    tags: ["MISA", "license", "application", "rejection", "invest saudi"],
  },

  // COMPANY REGISTRATION
  {
    id: "cr-registration-process",
    stage: "company-registration",
    title: "Commercial Registration — More Than Just Paperwork",
    subtitle: "The Ministry of Commerce process has hidden complexities",
    severity: "warning",
    officialTimeline: "1–3 business days",
    realTimeline: "1–3 weeks (including name reservation, AoA notarization)",
    officialCost: "SAR 1,200/year for CR + SAR 500–2,000 for CoC",
    realCost: "SAR 8,000–20,000 (including lawyer for AoA, notarization, PRO services)",
    whatTheyTellYou: "Quick digital process through mc.gov.sa.",
    whatActuallyHappens: "The CR itself can be issued digitally in days, but that's only after your AoA is notarized (requires in-person visit or authorized representative), trade name is approved (can be rejected multiple times), and all documents are properly linked. The notarization process alone can take a week if the notary public schedule is full.",
    commonMistakes: [
      "Choosing a trade name that's already registered or too similar to existing names",
      "Not including the legal entity type in the trade name (required: 'LLC', 'SJSC', etc.)",
      "AoA not giving the GM proper powers — this causes banking issues later",
      "Not printing the CR certificate — some government offices and banks still want physical copies",
    ],
    rejectionReasons: [
      "Trade name conflicts with existing registrations",
      "AoA doesn't comply with Saudi Companies Law requirements",
      "Mismatch between MISA license details and CR application",
      "Missing shareholder information or documentation",
    ],
    proTips: [
      "Reserve 3–5 name options upfront — your first choice will likely be taken",
      "Make sure your AoA gives the GM FULL banking powers (signing authority, account opening, fund transfers) — banks are very strict about this",
      "Get your CR number as soon as possible — you need it for EVERY other registration",
      "Set up a Watheq account for electronic CR — makes renewals much easier",
    ],
    gotchas: [
      "CR must be renewed annually. Set a calendar reminder — expired CR = business shutdown",
      "If you change shareholders or GM later, you need to update the CR (and it's not instant)",
      "Your CR city should match where you'll actually operate — changing it later is bureaucratic",
    ],
    tags: ["CR", "commercial registration", "Ministry of Commerce", "trade name", "AoA"],
  },

  // BANKING
  {
    id: "opening-bank-account",
    stage: "banking-finance",
    title: "Opening a Corporate Bank Account — The #1 Bottleneck",
    subtitle: "This is where most founders get stuck for months",
    severity: "critical",
    officialTimeline: "2–3 weeks",
    realTimeline: "4–12 weeks (yes, really)",
    officialCost: "Free",
    realCost: "SAR 0 for the account, but opportunity cost of months of delayed operations",
    whatTheyTellYou: "Just visit a bank with your CR and open an account.",
    whatActuallyHappens: "Saudi banks have extremely strict KYC (Know Your Customer) requirements for foreign-owned companies. You'll need: MISA license, CR, National Address proof, GM Iqama, AoA with explicit banking powers for the GM, VAT certificate, parent company documents (attested), ownership structure chart, source of funds documentation. Some banks reject foreign startups entirely. Others take 2–3 months of back-and-forth document requests.",
    commonMistakes: [
      "Applying to only one bank — you should apply to 2–3 simultaneously",
      "Not having the GM's Iqama before applying — most banks require it",
      "AoA doesn't grant GM sufficient banking authority — bank rejects the application",
      "Not having a National Address registered before applying",
      "Expecting to open an account with just a passport (only works for personal accounts)",
    ],
    rejectionReasons: [
      "Insufficient documentation — banks want EVERYTHING before they start reviewing",
      "Company too new with no revenue — some banks want 6 months of operation history",
      "Parent company from a high-risk jurisdiction (certain countries face extra scrutiny)",
      "GM doesn't have Iqama yet (critical blocker for most banks)",
      "Activity type doesn't match bank's appetite (some banks avoid certain sectors)",
    ],
    proTips: [
      "SNB (formerly NCB) and SABB are generally more open to working with foreign-owned startups",
      "Al Rajhi is popular but can be stricter with compliance for new companies",
      "Get a relationship manager assigned — don't just walk into a branch",
      "Prepare a comprehensive company profile document: business plan, expected transaction volumes, funding sources",
      "Some fintech solutions (e.g., Lendo, Hala) can provide interim banking services while you wait",
      "If your GM doesn't have Iqama yet, some banks accept a Premium Residency ID instead",
    ],
    gotchas: [
      "Bank won't let you deposit the initial capital until the account is opened — chicken-and-egg problem",
      "Some banks charge monthly maintenance fees of SAR 500–2,000 for corporate accounts",
      "International transfers from your account may require separate approval from the bank's compliance team",
      "If the GM changes, you need to update ALL bank signatories — this can take weeks",
    ],
    tags: ["bank account", "KYC", "banking", "corporate account", "SNB", "SABB", "Al Rajhi"],
  },
  {
    id: "zatca-vat-registration",
    stage: "banking-finance",
    title: "ZATCA & VAT — The Tax Trap Nobody Warns You About",
    subtitle: "Missing deadlines here means automatic penalties starting at SAR 10,000",
    severity: "critical",
    officialTimeline: "Same-day registration",
    realTimeline: "1–2 weeks to get everything set up properly",
    officialCost: "Free to register",
    realCost: "SAR 5,000–25,000/year for accounting software and VAT compliance",
    whatTheyTellYou: "Register for VAT if you exceed SAR 375,000 in revenue.",
    whatActuallyHappens: "The SAR 375,000 threshold applies to mandatory registration, but many B2B clients won't work with you unless you have a VAT number. Filing is quarterly for small businesses, monthly for larger ones. E-invoicing (Fatoorah) is now mandatory for all VAT-registered businesses. ZATCA's penalties are automatic and non-negotiable: SAR 10,000 for late registration, 5–25% of unpaid tax for late filing, SAR 5,000 per non-compliant invoice.",
    commonMistakes: [
      "Not registering for VAT because you're 'still small' — then getting penalized when you cross the threshold retroactively",
      "Filing VAT returns late — even one day late triggers a minimum SAR 1,000 fine",
      "Not implementing ZATCA-compliant e-invoicing (Fatoorah) — fines up to SAR 50,000",
      "Charging VAT on exempt services or not charging on taxable ones",
      "Not keeping proper records — ZATCA requires 6 years of record retention",
    ],
    proTips: [
      "Register for VAT voluntarily from day one if doing B2B — clients expect VAT invoices",
      "Use ZATCA-approved e-invoicing software (Wafeq, Cleartax, Zoho) from the start",
      "Hire a Saudi-experienced accountant, not just any accountant — ZATCA rules are specific",
      "Set aside 15% of every invoice for VAT — don't spend it and scramble at filing time",
      "File your returns early — don't wait until the last day",
    ],
    gotchas: [
      "Withholding tax (15–20%) applies when paying foreign service providers — this catches many startups by surprise",
      "Zakat (2.5% on net assets) applies to Saudi/GCC shareholders; corporate income tax (20%) applies to foreign shareholders",
      "If you have mixed ownership, you pay both Zakat AND income tax on their respective portions",
      "ZATCA can audit you at any time in the first 5 years — keep immaculate records",
    ],
    tags: ["ZATCA", "VAT", "tax", "Fatoorah", "e-invoicing", "penalty", "compliance"],
  },

  // HIRING & COMPLIANCE
  {
    id: "nitaqat-saudization",
    stage: "hiring-compliance",
    title: "Nitaqat (Saudization) — The System That Controls Your Visa Power",
    subtitle: "Your ability to hire foreigners depends entirely on your Nitaqat color",
    severity: "critical",
    officialTimeline: "Ongoing obligation",
    realTimeline: "Must be planned from your very first hire",
    officialCost: "No direct fee",
    realCost: "SAR 3,000–10,000/month per Saudi employee (salary expectations are high)",
    whatTheyTellYou: "Hire some Saudi employees to meet the quota.",
    whatActuallyHappens: "Nitaqat is a color-coded system (Platinum → Green → Yellow → Red) based on your ratio of Saudi to foreign employees. Your color determines everything: can you issue new visas? Can you renew existing visas? Can you change employee professions? Red zone companies are essentially frozen — no new visas, no transfers, no renewals. Many startups fall into Red immediately because they hire 2–3 expat founders/developers without any Saudi employees.",
    commonMistakes: [
      "Hiring all expatriate team first and falling into Red zone immediately",
      "Hiring 'ghost' Saudi employees just for Nitaqat (illegal — penalties up to SAR 100,000 per employee)",
      "Not understanding that different sectors have different Saudization ratios",
      "Ignoring the sector-specific requirements — tech has different ratios than retail",
      "Assuming you can fix Nitaqat quickly — it takes 3–6 months to recover from Red zone",
    ],
    proTips: [
      "Hire at least 1 Saudi employee for every 2–3 expats from the very beginning",
      "Saudi fresh graduates are eligible for Tamheer (government-subsidized training program — you pay little, government pays the rest)",
      "HRDF (Human Resources Development Fund) offers wage subsidies of 30–50% for first 2 years of Saudi hires",
      "Tech companies should register under the 'IT' sector with MOHR for more favorable ratios",
      "Consider hiring Saudi part-time employees — they count as 0.5 toward Nitaqat",
    ],
    gotchas: [
      "Minimum salary for a Saudi employee to count in Nitaqat is SAR 4,000/month (SAR 3,000 for part-time)",
      "Saudi employees must be registered in GOSI within 15 days of hire — or they don't count",
      "If a Saudi employee resigns, your Nitaqat drops immediately — have a replacement plan",
      "Working from home Saudi employees still count — but they must be properly registered",
    ],
    tags: ["Nitaqat", "Saudization", "hiring", "quota", "MOHR", "visas"],
  },
  {
    id: "gosi-wps-compliance",
    stage: "hiring-compliance",
    title: "GOSI & Wage Protection System (WPS) — Payroll Is Not Optional",
    subtitle: "All salaries must go through WPS — no exceptions, no workarounds",
    severity: "warning",
    officialTimeline: "Register immediately upon hiring",
    realTimeline: "1–2 weeks for initial setup, then monthly compliance",
    officialCost: "2% of salary (employee) + 12% (employer) for Saudis; 2% (employer) for expats",
    realCost: "Additional SAR 2,000–5,000/month for payroll software and compliance",
    whatTheyTellYou: "Register with GOSI and pay salaries on time.",
    whatActuallyHappens: "GOSI registration is mandatory for ALL employees, Saudi and expat. You must register within 15 days of hiring. Salaries MUST be paid through the Wage Protection System (Mudad) — cash payments, personal transfers, or even direct bank transfers outside WPS are violations. Late salary payment triggers automatic complaints and can freeze your company's services.",
    commonMistakes: [
      "Paying salaries directly to employee bank accounts instead of through WPS/Mudad",
      "Registering employees late in GOSI (15-day deadline from hire date)",
      "Not paying GOSI contributions on time (monthly, by the 15th of the following month)",
      "Misclassifying employees as contractors to avoid GOSI — MOHR actively investigates this",
    ],
    proTips: [
      "Set up Mudad (mudad.com.sa) account immediately after getting your CR",
      "Use integrated payroll software (Jisr, ZenHR, Bayzat) that handles GOSI calculations automatically",
      "For expatriates, only employer contribution of 2% is required (occupational hazards insurance)",
      "For Saudis, total GOSI contribution is 21.5% (9.75% employee + 11.75% employer) — budget for this",
    ],
    gotchas: [
      "GOSI contributions for Saudi employees are much higher than for expats — factor this into your hiring costs",
      "If you terminate an employee, you still owe outstanding GOSI contributions",
      "End-of-service benefits (gratuity) are calculated based on GOSI-registered salary — not actual compensation",
      "GOSI violations can block you from Nitaqat improvements and visa processing",
    ],
    tags: ["GOSI", "WPS", "Mudad", "payroll", "salary", "compliance"],
  },

  // VISAS & IQAMA
  {
    id: "gm-visa-iqama",
    stage: "visas-iqama",
    title: "GM Visa & Iqama — Your Ticket to Actually Living in Saudi",
    subtitle: "Without Iqama, you can't open a bank account, sign contracts, or even rent an apartment",
    severity: "critical",
    officialTimeline: "2–4 weeks",
    realTimeline: "6–12 weeks from visa application to Iqama in hand",
    officialCost: "SAR 2,000–4,000 (visa + Iqama fees)",
    realCost: "SAR 8,000–15,000 (including medical, insurance, PRO services, Absher registration)",
    whatTheyTellYou: "Apply for your visa and Iqama through MOHR.",
    whatActuallyHappens: "The process has many sequential steps that can't be parallelized: 1) Company files visa request to MISA → 2) MISA coordinates with MOHR (2 weeks) → 3) Visa issued to Saudi Embassy in your country → 4) You visit Embassy for visa stamping → 5) Enter Saudi Arabia → 6) Medical checkup (1–3 days) → 7) Get health insurance → 8) Apply for Iqama through Muqeem → 9) Register on Absher and Nafath. Each step has its own requirements and can introduce delays.",
    commonMistakes: [
      "Not entering Saudi Arabia within 90 days of visa issuance — visa expires",
      "Trying to get Iqama without medical checkup or health insurance first",
      "Not registering on Absher immediately after getting Iqama — delays access to government services",
      "Forgetting that Iqama must be renewed annually (not every 5 years like the card suggests)",
      "Not getting a Saudi phone number — required for Nafath digital identity (mandatory for banking)",
    ],
    proTips: [
      "You can only get your visa stamped at the Saudi Embassy in your country of LEGAL RESIDENCE — not just any country",
      "Get a Saudi SIM card on day 1 — you need it for Nafath, which you need for everything",
      "Register at an Absher kiosk immediately (check absher.sa for nearest location) — it validates your fingerprints",
      "Medical checkup is done at GAMCA-approved centers — some are faster than others, ask your PRO for recommendations",
      "If you have Premium Residency, you can skip the company-sponsored visa process entirely",
    ],
    gotchas: [
      "Your Iqama is tied to your company (sponsor/kafeel). If you close the company, your Iqama becomes invalid",
      "Transferring visa/Iqama between companies requires exit from Saudi Arabia and re-entry on new visa",
      "Family visa (dependents) requires minimum salary of SAR 5,000/month + adequate housing proof",
      "Some services (e.g., Absher) require in-person registration — can't be done remotely",
    ],
    tags: ["visa", "Iqama", "GM", "residency", "Absher", "Nafath", "medical", "sponsor"],
  },

  // ONGOING COMPLIANCE
  {
    id: "renewal-deadlines",
    stage: "ongoing-compliance",
    title: "Annual Renewals — The Calendar That Runs Your Business",
    subtitle: "Miss ONE renewal and your entire operation can freeze",
    severity: "critical",
    officialTimeline: "Annual",
    realTimeline: "Start renewal process 2 months before expiry — not the month of",
    officialCost: "SAR 5,000–15,000/year total (MISA + CR + CoC + Insurance + Iqama)",
    realCost: "SAR 10,000–30,000/year (including PRO services and fines for late renewals)",
    whatTheyTellYou: "Renew your licenses annually.",
    whatActuallyHappens: "You have 6–8 different renewals per year, each with different deadlines and different portals. Miss the MISA license renewal? You can't renew your CR. Miss the CR renewal? You can't renew employee Iqamas. Miss Iqama renewal? Fines of SAR 500/month per expired Iqama, plus potential deportation. It's a chain — one missed link breaks everything.",
    commonMistakes: [
      "Not tracking renewal dates — each document has a different expiry date",
      "Assuming you'll get a reminder — most government portals DON'T send renewal notifications",
      "Waiting until the last minute — MISA license renewal can take 2–4 weeks",
      "Not budgeting for renewal costs — they add up to SAR 15,000–30,000/year",
    ],
    proTips: [
      "Create a renewal calendar with alerts 60 days before each expiry",
      "Renewal order matters: MISA → CR → CoC → Iqama → Insurance → ZATCA",
      "Hire a PRO service for annual renewals — costs SAR 500–1,000/month but saves you from fines worth 10x that",
      "Some items can be renewed for multiple years (e.g., CR for up to 5 years) — do it to reduce annual admin burden",
    ],
    gotchas: [
      "MISA license renewal requires updated financial statements from the parent company",
      "If your MISA license lapses, you technically lose your right to operate as a foreign entity",
      "CoC membership renewal requires updated GOSI compliance certificate",
      "Health insurance must be renewed BEFORE Iqama renewal — otherwise Iqama renewal is blocked",
    ],
    tags: ["renewal", "MISA", "CR", "Iqama", "deadline", "compliance", "annual"],
  },
  {
    id: "government-portals",
    stage: "ongoing-compliance",
    title: "Government Portals — 10+ Platforms You Must Master",
    subtitle: "Each portal serves a different purpose and none of them talk to each other",
    severity: "info",
    officialTimeline: "One-time setup",
    realTimeline: "2–4 weeks to set up all portals properly",
    officialCost: "Free",
    realCost: "Time cost — each portal takes 1–3 hours to set up and learn",
    whatTheyTellYou: "Everything is digital now.",
    whatActuallyHappens: "Saudi Arabia has made incredible progress in digitization, but each ministry has its own portal with its own login, its own document requirements, and its own quirks. You'll need accounts on at least 10 different platforms. Some require the GM to be in Saudi Arabia to register (Absher kiosks). Some require a Saudi phone number. Some only work on certain browsers.",
    commonMistakes: [
      "Using different email addresses for different portals — use one consistent email",
      "Not saving login credentials securely — you'll have 10+ sets of credentials",
      "Trying to set up portals before having all prerequisites (CR, Iqama, National Address)",
      "Ignoring the 'Mofawtar' (authorized person) setup — some portals let you delegate, which is critical",
    ],
    proTips: [
      "Set up portals in this order: Absher → Nafath → Muqeem → Qiwa → Mudad → GOSI → ZATCA → SPL",
      "Keep a spreadsheet with all portal URLs, login credentials, and what each portal is used for",
      "Nafath (digital identity) is the master key — most other portals use it for 2FA",
      "Some portals have Arabic-only interfaces — keep Google Translate handy or use a bilingual PRO",
    ],
    gotchas: [
      "Absher registration requires physical presence at a kiosk — can't be done online",
      "Nafath requires a Saudi SIM card registered to your Iqama — not just any Saudi number",
      "Some portals have maintenance windows on weekends (Friday–Saturday is the Saudi weekend)",
      "If your Iqama expires, many portal accounts freeze until renewal — handle this proactively",
    ],
    tags: ["portals", "Absher", "Nafath", "Muqeem", "Qiwa", "Mudad", "digital", "setup"],
  },
];

/* ─── Component ─── */

const FoundersPlaybook = () => {
  usePageSEO({
    title: "Founder's Playbook — The Real Guide to Starting Up in Saudi Arabia",
    description:
      "The brutally honest, stage-by-stage knowledge base for starting a business in Saudi Arabia. Real timelines, common mistakes, rejection reasons, and insider tips from the field.",
    path: "/founders-playbook",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<Stage | "all">("all");
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleEntry = (id: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredEntries = useMemo(() => {
    return playbookEntries.filter((entry) => {
      const matchesStage = selectedStage === "all" || entry.stage === selectedStage;
      if (!searchQuery.trim()) return matchesStage;

      const q = searchQuery.toLowerCase();
      const searchableText = [
        entry.title,
        entry.subtitle,
        entry.whatActuallyHappens,
        ...entry.commonMistakes,
        ...entry.proTips,
        ...entry.gotchas,
        ...(entry.rejectionReasons || []),
        ...entry.tags,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStage && searchableText.includes(q);
    });
  }, [searchQuery, selectedStage]);

  const severityConfig: Record<Severity, { label: string; bg: string; text: string; border: string }> = {
    critical: {
      label: "Critical",
      bg: "bg-red-500/10",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-500/20",
    },
    warning: {
      label: "Important",
      bg: "bg-amber-500/10",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-500/20",
    },
    info: {
      label: "Good to Know",
      bg: "bg-sky-500/10",
      text: "text-sky-700 dark:text-sky-400",
      border: "border-sky-500/20",
    },
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-rose-500/20 to-amber-500/20 blur-[120px]" />

        <div className="px-4 sm:container py-12 sm:py-28 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link
              to="/startup-guide"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Startup Guide
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6 ml-4">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">
                The Real Talk
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              The Founder's
              <br />
              <span className="gradient-text">Playbook</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-4 leading-relaxed">
              The brutally honest, stage-by-stage knowledge base for starting a business in Saudi Arabia. 
              Real timelines vs. official timelines. Real costs vs. official costs. Common mistakes that cost founders months and thousands of riyals.
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-xl">
              Based on real founder experiences, practitioner insights, government sources, and verified consultancy data. This is the guide nobody gives you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="px-4 sm:container py-6">
          <div className="flex flex-wrap gap-6 sm:gap-10 justify-center text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{playbookEntries.length}</p>
              <p className="text-muted-foreground">Real Insights</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">7</p>
              <p className="text-muted-foreground">Journey Stages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {playbookEntries.reduce((s, e) => s + e.commonMistakes.length, 0)}+
              </p>
              <p className="text-muted-foreground">Mistakes Documented</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {playbookEntries.reduce((s, e) => s + e.proTips.length, 0)}+
              </p>
              <p className="text-muted-foreground">Pro Tips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-4 sm:py-8 border-b border-border/40 sm:sticky sm:top-0 z-30 bg-background/95 sm:backdrop-blur-md">
        <div className="px-4 sm:container">
          <div className="relative max-w-lg mb-3 sm:mb-0 sm:float-left sm:mr-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search — 'bank account', 'VAT', 'Iqama'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 sm:h-11"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap sm:gap-2 sm:clear-none">
            <button
              onClick={() => setSelectedStage("all")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap shrink-0",
                selectedStage === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              All Stages
            </button>
            {(Object.entries(stageConfig) as [Stage, typeof stageConfig[Stage]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedStage(selectedStage === key ? "all" : key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap shrink-0",
                  selectedStage === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border/50 text-muted-foreground hover:border-primary/30"
                )}
              >
                {config.label}
              </button>
            ))}
          </div>
          <div className="clear-both" />

          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-3">
              {filteredEntries.length} result{filteredEntries.length !== 1 ? "s" : ""} for "{searchQuery}"
              {selectedStage !== "all" && ` in ${stageConfig[selectedStage].label}`}
            </p>
          )}
        </div>
      </section>

      {/* Playbook Entries */}
      <section className="py-12 sm:py-16">
        <div className="px-4 sm:container max-w-4xl">
          <AnimatePresence mode="wait">
            {filteredEntries.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground/70">Try a different search term or clear the filters</p>
              </motion.div>
            ) : (
              <motion.div key="results" className="space-y-4">
                {filteredEntries.map((entry, i) => {
                  const isExpanded = expandedEntries.has(entry.id);
                  const stage = stageConfig[entry.stage];
                  const sev = severityConfig[entry.severity];

                  return (
                    <motion.div
                      key={entry.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      custom={Math.min(i, 5)}
                      className={cn(
                        "rounded-2xl border bg-card overflow-hidden transition-all",
                        isExpanded ? "border-primary/30 shadow-lg" : "border-border/50 hover:border-primary/20"
                      )}
                    >
                      {/* Header — always visible */}
                      <button
                        onClick={() => toggleEntry(entry.id)}
                        className="w-full text-left p-5 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-[0.6rem] font-medium bg-gradient-to-r text-white",
                                stage.color
                              )}
                            >
                              {stage.label}
                            </span>
                            <span
                              className={cn("px-2 py-0.5 rounded-full text-[0.6rem] font-medium border", sev.bg, sev.text, sev.border)}
                            >
                              {sev.label}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-bold mb-1">{entry.title}</h3>
                        <p className="text-sm text-muted-foreground">{entry.subtitle}</p>

                        {/* Timeline & Cost Preview */}
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Official:</span>
                            <span className="line-through text-muted-foreground/50">{entry.officialTimeline}</span>
                            <span className="text-primary font-medium">→ Real: {entry.realTimeline}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Official:</span>
                            <span className="line-through text-muted-foreground/50">{entry.officialCost}</span>
                            <span className="text-primary font-medium">→ Real: {entry.realCost}</span>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-6 space-y-6 border-t border-border/40 pt-5">
                              {/* What They Tell You vs Reality */}
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="rounded-xl bg-muted/50 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                    📢 What They Tell You
                                  </p>
                                  <p className="text-sm text-foreground italic">"{entry.whatTheyTellYou}"</p>
                                </div>
                                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                                    🔥 What Actually Happens
                                  </p>
                                  <p className="text-sm text-foreground">{entry.whatActuallyHappens}</p>
                                </div>
                              </div>

                              {/* Common Mistakes */}
                              <div>
                                <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  Common Mistakes
                                </h4>
                                <ul className="space-y-2">
                                  {entry.commonMistakes.map((m, mi) => (
                                    <li key={mi} className="flex items-start gap-2 text-sm text-foreground">
                                      <span className="text-destructive shrink-0 mt-0.5">✗</span>
                                      {m}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Rejection Reasons */}
                              {entry.rejectionReasons && entry.rejectionReasons.length > 0 && (
                                <div>
                                  <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Top Rejection Reasons
                                  </h4>
                                  <ul className="space-y-2">
                                    {entry.rejectionReasons.map((r, ri) => (
                                      <li key={ri} className="flex items-start gap-2 text-sm text-foreground">
                                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                        {r}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Pro Tips */}
                              <div>
                                <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-primary" />
                                  Pro Tips
                                </h4>
                                <ul className="space-y-2">
                                  {entry.proTips.map((t, ti) => (
                                    <li key={ti} className="flex items-start gap-2 text-sm text-foreground">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                      {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Gotchas */}
                              <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
                                <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-300">
                                  <Zap className="h-4 w-4" />
                                  Gotchas & Hidden Details
                                </h4>
                                <ul className="space-y-2">
                                  {entry.gotchas.map((g, gi) => (
                                    <li
                                      key={gi}
                                      className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300"
                                    >
                                      <span className="shrink-0 mt-0.5">⚡</span>
                                      {g}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {entry.tags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSearchQuery(tag);
                                    }}
                                    className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Related Guides */}
      <section className="py-12 sm:py-16 border-t border-border/40 bg-muted/30">
        <div className="px-4 sm:container">
          <h3 className="font-display text-lg font-bold mb-6">Deep Dive Guides</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
            {[
              { title: "MISA License Guide", to: "/startup-guide/misa-license", desc: "Full step-by-step process" },
              { title: "Company Registration", to: "/startup-guide/company-registration", desc: "3-phase registration guide" },
              { title: "Incubators & Accelerators", to: "/startup-guide/incubators", desc: "Directory of programs" },
              { title: "Business FAQs", to: "/startup-guide/business-faq", desc: "Quick answers to common questions" },
            ].map((guide) => (
              <Link
                key={guide.to}
                to={guide.to}
                className="group rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-all"
              >
                <h4 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">
                  {guide.title}
                </h4>
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
                Know Something We Don't?
              </h2>
              <p className="text-primary-foreground/80 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                This playbook is built from real founder experiences. If you've been through the process and have tips, corrections, or horror stories to share — we want to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-foreground hover:bg-white/90 border-0 px-8 h-12 shadow-xl"
                >
                  <a href="mailto:help@foundersksa.com">
                    <Mail className="mr-2 h-4 w-4" /> Share Your Experience
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

export default FoundersPlaybook;
