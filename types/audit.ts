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

export interface AuditSummaryInput {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings?: number;
  overallAssessment?: string;
  recommendations: ToolRecommendation[];
}

export interface ToolRecommendation {
  id: string;
  toolId: ToolId;
  toolName: string;
  tool: string;
  currentPlan: string;
  recommendedPlan: string;
  suggestedPlan: string;
  currentSeats: number;
  recommendedSeats: number;
  currentSpend: number;
  optimizedSpend: number;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  confidence: "High" | "Medium" | "Low";
  actionType:
    | "downgrade"
    | "reduce_seats"
    | "switch_vendor"
    | "maintain"
    | "usage_credit_opportunity";
  reason: string;
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
  overallAssessment: string;
  optimizationScore: number;
  summary: string;
  recommendations: ToolRecommendation[];
  chart: SavingsSeriesPoint[];
  roiMetrics: RoiMetric[];
  consultationRecommended: boolean;
}
