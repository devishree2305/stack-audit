import type { AuditFormValues } from "@/types/audit";
import type { ToolCatalogItem, ToolId, UsageType } from "@/types/tool";

export const REAL_PRICING_REFERENCE = {
  cursor: {
    source: "https://cursor.com/pricing",
    plans: [
      { name: "Hobby", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Business", price: 40 },
      { name: "Enterprise", price: null },
    ],
  },
  githubCopilot: {
    source: "https://github.com/features/copilot/plans",
    plans: [
      { name: "Individual", price: 10 },
      { name: "Business", price: 19 },
      { name: "Enterprise", price: 39 },
    ],
  },
  claude: {
    source: "https://www.anthropic.com/pricing",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 17 },
      { name: "Max", price: 100 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: null },
      { name: "API Direct", price: null },
    ],
  },
  chatgpt: {
    source: "https://openai.com/chatgpt/pricing/",
    plans: [
      { name: "Plus", price: 20 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: null },
      { name: "API Direct", price: null },
    ],
  },
  anthropicApi: {
    source: "https://www.anthropic.com/pricing#api",
    plans: [{ name: "API Direct", price: null }],
  },
  openaiApi: {
    source: "https://openai.com/api/pricing/",
    plans: [{ name: "API Direct", price: null }],
  },
  gemini: {
    source: "https://one.google.com/about/ai-premium/",
    plans: [
      { name: "Pro", price: 20 },
      { name: "Ultra", price: 42 },
      { name: "API", price: null },
    ],
  },
  windsurf: {
    source: "https://windsurf.com/pricing",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Team", price: 40 },
      { name: "Enterprise", price: null },
    ],
  },
} as const;

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
    source: REAL_PRICING_REFERENCE.cursor.source,
    category: "workspace",
    accent: "from-sky-400/30 via-cyan-400/20 to-transparent",
    icon: "CU",
    usageOptions: ["daily", "weekly", "shared", "experimental"],
    plans: [
      {
        id: "hobby",
        name: "Hobby",
        monthlyPrice: 0,
        description: "Free entry point for occasional solo usage.",
        bestFor: "Exploration and personal projects",
      },
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
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPrice: null,
        description: "Custom enterprise pricing handled directly by Cursor.",
        bestFor: "Larger teams needing procurement support",
      },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    shortName: "Copilot",
    source: REAL_PRICING_REFERENCE.githubCopilot.source,
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
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPrice: 39,
        description: "Enterprise plan with broader controls and support.",
        bestFor: "Larger organizations",
      },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    shortName: "Claude",
    source: REAL_PRICING_REFERENCE.claude.source,
    category: "assistant",
    accent: "from-orange-400/25 via-amber-400/15 to-transparent",
    icon: "CL",
    usageOptions: ["daily", "weekly", "light", "experimental"],
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPrice: 0,
        description: "No-cost access for light personal use.",
        bestFor: "Occasional users",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 17,
        description: "Large context and strong writing/reasoning.",
        bestFor: "Power users and founders",
      },
      {
        id: "max",
        name: "Max",
        monthlyPrice: 100,
        description: "Higher-usage personal plan for power users.",
        bestFor: "Heavy individual usage",
      },
      {
        id: "team",
        name: "Team",
        monthlyPrice: 20,
        description: "Collaborative workspace plan.",
        bestFor: "Internal knowledge teams",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPrice: null,
        description: "Custom enterprise pricing for larger organizations.",
        bestFor: "Procurement-led teams",
      },
      {
        id: "api-direct",
        name: "API Direct",
        monthlyPrice: null,
        description: "Usage-based API pricing depends on model traffic.",
        bestFor: "Product teams using Claude via API",
      },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    shortName: "ChatGPT",
    source: REAL_PRICING_REFERENCE.chatgpt.source,
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
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPrice: null,
        description: "Custom enterprise pricing and procurement terms.",
        bestFor: "Larger organizations",
      },
      {
        id: "api-direct",
        name: "API Direct",
        monthlyPrice: null,
        description: "API usage is billed separately from ChatGPT seats.",
        bestFor: "Teams combining chat and API workflows",
      },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    shortName: "OpenAI API",
    source: REAL_PRICING_REFERENCE.openaiApi.source,
    category: "api",
    accent: "from-fuchsia-400/20 via-sky-400/15 to-transparent",
    icon: "OA",
    usageOptions: ["daily", "weekly", "experimental", "shared"],
    plans: [
      {
        id: "api-direct",
        name: "API Direct",
        monthlyPrice: null,
        description: "Usage-based API pricing varies by model and traffic.",
        bestFor: "Shipping AI product features",
      },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    shortName: "Anthropic API",
    source: REAL_PRICING_REFERENCE.anthropicApi.source,
    category: "api",
    accent: "from-amber-400/20 via-orange-400/15 to-transparent",
    icon: "AN",
    usageOptions: ["daily", "weekly", "experimental", "shared"],
    plans: [
      {
        id: "api-direct",
        name: "API Direct",
        monthlyPrice: null,
        description: "Usage-based API pricing depends on model mix and volume.",
        bestFor: "Reasoning-heavy AI features",
      },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    shortName: "Gemini",
    source: REAL_PRICING_REFERENCE.gemini.source,
    category: "assistant",
    accent: "from-blue-400/25 via-indigo-400/15 to-transparent",
    icon: "GE",
    usageOptions: ["daily", "weekly", "light", "experimental"],
    plans: [
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 20,
        description: "Broad Google ecosystem usage.",
        bestFor: "Workspace-heavy teams",
      },
      {
        id: "ultra",
        name: "Ultra",
        monthlyPrice: 42,
        description: "Higher-tier Gemini access for heavier usage.",
        bestFor: "Advanced research and power users",
      },
      {
        id: "api",
        name: "API",
        monthlyPrice: null,
        description: "Usage-based Gemini API pricing varies by model and traffic.",
        bestFor: "Teams building with Gemini via API",
      },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    shortName: "Windsurf",
    source: REAL_PRICING_REFERENCE.windsurf.source,
    category: "workspace",
    accent: "from-cyan-400/25 via-blue-400/15 to-transparent",
    icon: "WS",
    usageOptions: ["daily", "weekly", "experimental", "shared"],
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPrice: 0,
        description: "Free plan for trying Windsurf.",
        bestFor: "Evaluation and light usage",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 20,
        description: "Good alternative coding assistant price point.",
        bestFor: "Indie builders and engineers",
      },
      {
        id: "team",
        name: "Team",
        monthlyPrice: 40,
        description: "Shared setup for collaborative usage.",
        bestFor: "Small engineering orgs",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPrice: null,
        description: "Custom enterprise pricing and support.",
        bestFor: "Procurement-led organizations",
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

export function getPlanDefaultSpend(monthlyPrice: number | null) {
  return monthlyPrice ?? 0;
}

export function formatPlanPrice(monthlyPrice: number | null) {
  return monthlyPrice === null ? "Custom pricing" : `$${monthlyPrice}/mo`;
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
  {
    question: "Are the recommendations based on AI guesses?",
    answer:
      "No. The recommendation engine uses deterministic pricing logic, seat counts, and usage intensity rules to calculate the result. AI is only used to write the final summary in plain business language, not to invent savings or choose plans.",
  },
];
