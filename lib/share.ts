import { createAuditReportFromRecord } from "@/lib/audit-workflow";
import {
  createHighSavingsMockAuditReport,
  createOptimizedMockAuditReport,
  createSampleAuditReport,
} from "@/lib/audit-engine";
import { createSupabaseAuditRepository } from "@/lib/supabase/audit-repository";
import type { AuditReport, PublicAuditReport, ToolRecommendation } from "@/types/audit";

interface HeaderStoreLike {
  get(name: string): string | null;
}

function getToolNames(report: AuditReport) {
  return [...new Set(report.recommendations.map((item) => item.toolName))];
}

function getTeamSizeLabel(toolCount: number, optimizationScore: number) {
  if (toolCount <= 1) {
    return "Solo workflow snapshot";
  }

  if (toolCount <= 3 && optimizationScore >= 75) {
    return "Lean team stack";
  }

  if (toolCount <= 5) {
    return "Growing team stack";
  }

  return "Multi-tool operating stack";
}

function getActionPriority(actionType: ToolRecommendation["actionType"]) {
  switch (actionType) {
    case "downgrade":
      return 5;
    case "reduce_seats":
      return 4;
    case "switch_vendor":
      return 3;
    case "usage_credit_opportunity":
      return 2;
    default:
      return 1;
  }
}

function getStrongestRecommendation(report: AuditReport) {
  const strongest = [...report.recommendations].sort((left, right) => {
    if (right.monthlySavings !== left.monthlySavings) {
      return right.monthlySavings - left.monthlySavings;
    }

    return getActionPriority(right.actionType) - getActionPriority(left.actionType);
  })[0];

  if (!strongest || strongest.actionType === "maintain" || strongest.monthlySavings <= 0) {
    return "No major pricing or seat changes are currently recommended.";
  }

  if (strongest.actionType === "usage_credit_opportunity") {
    return `The biggest opportunity is around ${strongest.toolName} credits and committed-use pricing.`;
  }

  return `${strongest.toolName} shows the clearest savings path via ${strongest.recommendedPlan.toLowerCase()}.`;
}

function getOptimizationStatus(report: AuditReport) {
  if (report.totalMonthlySavings >= 500) {
    return "High optimization upside";
  }

  if (report.totalMonthlySavings < 100) {
    return "Already fairly optimized";
  }

  return "Meaningful optimization opportunity";
}

function createShareTitle(report: AuditReport) {
  if (report.totalAnnualSavings <= 0) {
    return "Stack Audit found an already-optimized AI stack";
  }

  return `Stack Audit found $${report.totalAnnualSavings.toFixed(0)}/year in AI savings`;
}

function createShareDescription(report: AuditReport) {
  const toolNames = getToolNames(report);
  const strongestRecommendation = getStrongestRecommendation(report);
  const toolPreview = toolNames.slice(0, 4).join(", ");
  const intro =
    toolNames.length > 0
      ? `AI procurement audit covering ${toolPreview} usage.`
      : "AI procurement audit showing startup stack optimization opportunities.";

  return `${intro} ${strongestRecommendation}`.trim();
}

export function createPublicAuditReport(report: AuditReport): PublicAuditReport {
  const toolNames = getToolNames(report);

  return {
    token: report.token,
    createdAt: report.createdAt,
    primaryUseCase: report.primaryUseCase,
    currentMonthlySpend: report.currentMonthlySpend,
    optimizedMonthlySpend: report.optimizedMonthlySpend,
    totalMonthlySavings: report.totalMonthlySavings,
    totalAnnualSavings: report.totalAnnualSavings,
    overallAssessment: report.overallAssessment,
    optimizationScore: report.optimizationScore,
    summary: report.summary,
    recommendations: report.recommendations,
    chart: report.chart,
    roiMetrics: report.roiMetrics,
    consultationRecommended: report.consultationRecommended,
    toolCount: toolNames.length,
    toolNames,
    teamSizeLabel: getTeamSizeLabel(toolNames.length, report.optimizationScore),
    strongestRecommendation: getStrongestRecommendation(report),
    optimizationStatus: getOptimizationStatus(report),
    shareTitle: createShareTitle(report),
    shareDescription: createShareDescription(report),
  };
}

export function resolveAppOrigin(headerStore?: HeaderStoreLike) {
  const host = headerStore?.get("x-forwarded-host") ?? headerStore?.get("host");
  const protocol = headerStore?.get("x-forwarded-proto") ?? "http";

  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    (host ? `${protocol}://${host}` : "http://localhost:3000")
  );
}

export async function loadPublicReportByToken(token: string) {
  if (token === "sample-audit") {
    return createPublicAuditReport(createSampleAuditReport());
  }

  if (token === "high-savings-audit") {
    return createPublicAuditReport(createHighSavingsMockAuditReport());
  }

  if (token === "optimized-audit") {
    return createPublicAuditReport(createOptimizedMockAuditReport());
  }

  const repository = createSupabaseAuditRepository();
  const audit = await repository.getAuditByShareToken(token);
  if (!audit) {
    return null;
  }

  return createPublicAuditReport(createAuditReportFromRecord(audit));
}
