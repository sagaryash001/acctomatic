import type { ComponentType } from "react";
import { Link2, ShieldCheck, Workflow } from "lucide-react";
import type { TransitionEffect } from "@/components/DoorsTransition";
import type { PuzzleFill } from "@/components/Puzzle";
import { ACT_FILL, CONNECT_FILL, TRUST_FILL } from "@/lib/puzzleFills";

export interface FeatureDetail {
  slug: string;
  title: string;
  description: string;
  longDescription: string[];
  points: string[];
  icon: ComponentType<{ className?: string }>;
  fill: PuzzleFill;
  accent?: boolean;
  transitionEffect: TransitionEffect;
}

export const FEATURES: FeatureDetail[] = [
  {
    slug: "connect",
    title: "Connect",
    description:
      "Documents arrive through email, Drive, Slack, Teams, or a direct upload — Acctomatic reads them without changing how your team already works.",
    longDescription: [
      "Acctomatic sits behind the tools you already use. There's no new inbox to check, no portal to log into, and nothing for your team to learn — documents keep arriving exactly the way they always have.",
      "Email attachments, shared Drive folders, Slack uploads, Teams channels, or a direct drag-and-drop: Acctomatic watches all of it continuously, reading every document the moment it lands.",
    ],
    points: [
      "Works with email, Drive, Slack, Teams, and direct upload",
      "No workflow changes for your team",
      "Documents are read the moment they arrive",
    ],
    icon: Link2,
    fill: CONNECT_FILL,
    transitionEffect: "doors",
  },
  {
    slug: "trust",
    title: "AI proposes. Acctomatic proves.",
    description:
      "Every extracted field is checked against the document itself — evidence, arithmetic, format, and your company's own rules — before it's ever trusted.",
    longDescription: [
      "A model reading a document is a proposal, not a fact. Acctomatic's Trust Engine checks every extracted field against the evidence in the document itself — the arithmetic, the formatting, and your own company's rules — before anything is treated as true.",
      "Fields that pass move forward on their own. Anything that doesn't is flagged as an exception for a human to look at, with the evidence attached, instead of quietly slipping through.",
    ],
    points: [
      "Every field is checked against the source document",
      "Arithmetic, format, and evidence are verified, not assumed",
      "Only genuine exceptions ever reach a person",
    ],
    icon: ShieldCheck,
    fill: TRUST_FILL,
    accent: true,
    transitionEffect: "blinds",
  },
  {
    slug: "act",
    title: "Act",
    description:
      "Verified fields file themselves and update the books. You only see what needs a second look — exceptions, not everything.",
    longDescription: [
      "Once a field is verified, Acctomatic doesn't wait around for approval on the obvious cases — it files itself and updates the books, the same way a trusted employee would.",
      "Your team's attention goes to the exceptions that actually need a second look, not to re-checking work that's already been proven correct.",
    ],
    points: [
      "Verified fields file and update the books automatically",
      "Exceptions are surfaced, not everything",
      "Your team reviews less, not more",
    ],
    icon: Workflow,
    fill: ACT_FILL,
    transitionEffect: "wipe",
  },
];

export function getFeature(slug: string | undefined): FeatureDetail | undefined {
  return FEATURES.find((feature) => feature.slug === slug);
}
