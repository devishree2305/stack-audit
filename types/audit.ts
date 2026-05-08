import type { ToolId, UsageType } from "@/types/tool";

export type PrimaryUseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface AuditToolInput {
  id: string;
  toolId: ToolId;
  planId: string;
  monthlySpend: number;
  seats: number;
  usageType: UsageType;
}

export interface AuditFormValues {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: AuditToolInput[];
}

export interface ToolRecommendation {
  id: string;
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  suggestedPlan: string;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  confidence: "High" | "Medium" | "Low";
  reason: string;
  recommendationType: "downgrade" | "consolidate" | "optimize" | "keep";
}

export interface RoiMetric {
  label: string;
  value: string;
  tone?: "default" | "positive";
}

export interface SavingsSeriesPoint {
  label: string;
  current: number;
  optimized: number;
}

export interface AuditReport {
  token: string;
  createdAt: string;
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  optimizationScore: number;
  summary: string;
  recommendations: ToolRecommendation[];
  chart: SavingsSeriesPoint[];
  roiMetrics: RoiMetric[];
  consultationRecommended: boolean;
}
