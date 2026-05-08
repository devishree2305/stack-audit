export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "openai-api"
  | "anthropic-api"
  | "gemini"
  | "windsurf";

export type UsageType = "daily" | "weekly" | "light" | "shared" | "experimental";

export interface ToolPlanOption {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice?: number;
  description: string;
  bestFor: string;
}

export interface ToolCatalogItem {
  id: ToolId;
  name: string;
  shortName: string;
  category: "assistant" | "api" | "workspace";
  accent: string;
  icon: string;
  usageOptions: UsageType[];
  plans: ToolPlanOption[];
}
