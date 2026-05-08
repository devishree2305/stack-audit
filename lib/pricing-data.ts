import type { AuditFormValues } from "@/types/audit";
import type { ToolCatalogItem, ToolId, UsageType } from "@/types/tool";

export const usageTypeLabels: Record<UsageType, string> = {
  daily: "Daily heavy use",
  weekly: "Weekly active use",
  light: "Light occasional use",
  shared: "Shared by a team",
  experimental: "Experimental",
};

export const primaryUseCases: AuditFormValues["primaryUseCase"][] = [
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
];

export const toolCatalog: ToolCatalogItem[] = [
  {
    id: "cursor",
    name: "Cursor",
    shortName: "Cursor",
    category: "workspace",
    accent: "from-sky-400/30 via-cyan-400/20 to-transparent",
    icon: "CU",
    usageOptions: ["daily", "weekly", "shared", "experimental"],
    plans: [
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 20,
        description: "Best for individual engineers using AI every day.",
        bestFor: "Solo builders and small teams",
      },
      {
        id: "business",
        name: "Business",
        monthlyPrice: 40,
        description: "More control for security-conscious teams.",
        bestFor: "Growing engineering teams",
      },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    shortName: "Copilot",
    category: "assistant",
    accent: "from-violet-400/30 via-indigo-400/20 to-transparent",
    icon: "GH",
    usageOptions: ["daily", "weekly", "shared", "light"],
    plans: [
      {
        id: "individual",
        name: "Individual",
        monthlyPrice: 10,
        description: "Solid baseline for most developers.",
        bestFor: "Individual contributors",
      },
      {
        id: "business",
        name: "Business",
        monthlyPrice: 19,
        description: "Admin controls and policy management.",
        bestFor: "Teams needing governance",
      },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    shortName: "Claude",
    category: "assistant",
    accent: "from-orange-400/25 via-amber-400/15 to-transparent",
    icon: "CL",
    usageOptions: ["daily", "weekly", "light", "experimental"],
    plans: [
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 20,
        description: "Large context and strong writing/reasoning.",
        bestFor: "Power users and founders",
      },
      {
        id: "team",
        name: "Team",
        monthlyPrice: 30,
        description: "Collaborative workspace plan.",
        bestFor: "Internal knowledge teams",
      },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    shortName: "ChatGPT",
    category: "assistant",
    accent: "from-emerald-400/30 via-teal-400/20 to-transparent",
    icon: "GP",
    usageOptions: ["daily", "weekly", "light", "shared"],
    plans: [
      {
        id: "plus",
        name: "Plus",
        monthlyPrice: 20,
        description: "Default plan for most startup operators.",
        bestFor: "Founders and ICs",
      },
      {
        id: "team",
        name: "Team",
        monthlyPrice: 30,
        description: "Shared workspace with admin features.",
        bestFor: "Cross-functional teams",
      },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    shortName: "OpenAI API",
    category: "api",
    accent: "from-fuchsia-400/20 via-sky-400/15 to-transparent",
    icon: "OA",
    usageOptions: ["daily", "weekly", "experimental", "shared"],
    plans: [
      {
        id: "payg",
        name: "Pay as you go",
        monthlyPrice: 120,
        description: "Usage-based with wide model access.",
        bestFor: "Shipping AI product features",
      },
      {
        id: "scaled",
        name: "Scaled",
        monthlyPrice: 400,
        description: "Higher baseline spend for larger usage.",
        bestFor: "Production-grade API usage",
      },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    shortName: "Anthropic API",
    category: "api",
    accent: "from-amber-400/20 via-orange-400/15 to-transparent",
    icon: "AN",
    usageOptions: ["daily", "weekly", "experimental", "shared"],
    plans: [
      {
        id: "payg",
        name: "Pay as you go",
        monthlyPrice: 140,
        description: "Usage-based access to Claude models.",
        bestFor: "Reasoning-heavy AI features",
      },
      {
        id: "scaled",
        name: "Scaled",
        monthlyPrice: 450,
        description: "Higher monthly commitment for volume.",
        bestFor: "Large prompt workloads",
      },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    shortName: "Gemini",
    category: "assistant",
    accent: "from-blue-400/25 via-indigo-400/15 to-transparent",
    icon: "GE",
    usageOptions: ["daily", "weekly", "light", "experimental"],
    plans: [
      {
        id: "advanced",
        name: "Advanced",
        monthlyPrice: 20,
        description: "Broad Google ecosystem usage.",
        bestFor: "Workspace-heavy teams",
      },
      {
        id: "business",
        name: "Business",
        monthlyPrice: 30,
        description: "Enterprise-style controls and collaboration.",
        bestFor: "Operations and research teams",
      },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    shortName: "Windsurf",
    category: "workspace",
    accent: "from-cyan-400/25 via-blue-400/15 to-transparent",
    icon: "WS",
    usageOptions: ["daily", "weekly", "experimental", "shared"],
    plans: [
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 15,
        description: "Good alternative coding assistant price point.",
        bestFor: "Indie builders and engineers",
      },
      {
        id: "team",
        name: "Team",
        monthlyPrice: 25,
        description: "Shared setup for collaborative usage.",
        bestFor: "Small engineering orgs",
      },
    ],
  },
];

export const toolCatalogMap = new Map<ToolId, ToolCatalogItem>(
  toolCatalog.map((tool) => [tool.id, tool]),
);

export function getToolById(toolId: ToolId) {
  return toolCatalogMap.get(toolId);
}

export const trustedLogos = [
  "Northstar",
  "LaunchOS",
  "Driftline",
  "Bluecore",
  "Promptloop",
  "ScaleForge",
];

export const liveSavingsExamples = [
  {
    company: "6-person devtool startup",
    before: "$1,140/mo",
    after: "$610/mo",
    savings: "$530/mo",
  },
  {
    company: "Seed-stage AI ops team",
    before: "$780/mo",
    after: "$420/mo",
    savings: "$360/mo",
  },
  {
    company: "Research-heavy SaaS team",
    before: "$2,240/mo",
    after: "$1,520/mo",
    savings: "$720/mo",
  },
];

export const faqs = [
  {
    question: "How does Stack Audit estimate savings?",
    answer:
      "We compare the plans and seat counts you currently pay for against practical alternatives, consolidation opportunities, and lighter plans that still match your team’s usage profile.",
  },
  {
    question: "Do I need billing exports to use it?",
    answer:
      "No. You can start with quick self-reported spend and seats, then refine the audit later with deeper spend data if you want tighter recommendations.",
  },
  {
    question: "Is this only for engineering teams?",
    answer:
      "No. It is strongest for technical startups, but it also works for founders, ops, support, product, and research teams paying for overlapping AI subscriptions.",
  },
  {
    question: "What if our spend is already optimized?",
    answer:
      "The report will say so directly. We would rather show honest low savings than push weak recommendations that erode trust.",
  },
];
