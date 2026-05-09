import { generateSummary } from "@/lib/anthropic";
import { getToolById } from "@/lib/pricing-data";
import type {
  AuditFormValues,
  AuditReport,
  RoiMetric,
  ToolRecommendation,
} from "@/types/audit";

const useCaseAdjustment: Record<AuditFormValues["primaryUseCase"], number> = {
  coding: 1,
  writing: 0.8,
  data: 0.9,
  research: 0.85,
  mixed: 0.95,
};

function resolveOptimizedSpend(input: AuditFormValues["tools"][number]) {
  const tool = getToolById(input.toolId);
  if (!tool) {
    return {
      optimizedSpend: input.monthlySpend,
      recommendationType: "keep" as const,
      confidence: "Low" as const,
      reason: "Tool pricing metadata is unavailable, so the current setup is kept.",
      suggestedPlan: input.planId,
    };
  }

  const basePlan = tool.plans.find((plan) => plan.id === input.planId) ?? tool.plans[0];
  let optimizedSpend = input.monthlySpend;
  let suggestedPlan = basePlan.name;
  let recommendationType: ToolRecommendation["recommendationType"] = "keep";
  let confidence: ToolRecommendation["confidence"] = "Medium";
  let reason = "Current spend already maps closely to the observed usage profile.";

  const lighterUsage = input.usageType === "light" || input.usageType === "experimental";
  const sharedTool = input.usageType === "shared";
  const basePrice = basePlan.monthlyPrice ?? 0;

  if (lighterUsage && input.seats > 1) {
    optimizedSpend = Math.max(basePrice, input.monthlySpend * 0.62);
    recommendationType = "consolidate";
    confidence = "High";
    suggestedPlan = `${basePlan.name} with fewer seats`;
    reason =
      "Low-intensity usage rarely needs dedicated paid seats for every user. Shared access or lighter seat allocation usually captures the same value.";
  } else if (lighterUsage) {
    optimizedSpend = Math.max(basePrice * 0.75, input.monthlySpend * 0.72);
    recommendationType = "downgrade";
    confidence = "High";
    suggestedPlan = `Lighter ${basePlan.name} usage`;
    reason =
      "The current plan looks heavy relative to stated usage, so a lower-intensity setup should preserve value while reducing waste.";
  } else if (sharedTool && input.seats >= 5) {
    optimizedSpend = input.monthlySpend * 0.82;
    recommendationType = "optimize";
    confidence = "Medium";
    suggestedPlan = `${basePlan.name} with seat rightsizing`;
    reason =
      "Team-shared AI tools often drift upward in seat count. Rightsizing access and pairing with a secondary tool usually trims meaningful spend.";
  } else if (tool.category === "api") {
    optimizedSpend = input.monthlySpend * 0.84;
    recommendationType = "optimize";
    confidence = "Medium";
    suggestedPlan = `${basePlan.name} with model routing`;
    reason =
      "API costs are often reduced by routing lower-value traffic to cheaper models and tightening retries, batch jobs, or context length.";
  }

  return {
    optimizedSpend: Number(optimizedSpend.toFixed(2)),
    recommendationType,
    confidence,
    reason,
    suggestedPlan,
  };
}

export function createAuditReport(
  values: AuditFormValues,
  token = crypto.randomUUID().slice(0, 8),
): AuditReport {
  const recommendations: ToolRecommendation[] = values.tools.map((toolInput) => {
    const tool = getToolById(toolInput.toolId);
    const currentPlan =
      tool?.plans.find((plan) => plan.id === toolInput.planId)?.name ?? toolInput.planId;
    const optimized = resolveOptimizedSpend(toolInput);
    const monthlySavings = Number(
      Math.max(toolInput.monthlySpend - optimized.optimizedSpend, 0).toFixed(2),
    );

    return {
      id: toolInput.id,
      toolId: toolInput.toolId,
      toolName: tool?.name ?? toolInput.toolId,
      currentPlan,
      suggestedPlan: optimized.suggestedPlan,
      currentMonthlySpend: Number(toolInput.monthlySpend.toFixed(2)),
      optimizedMonthlySpend: optimized.optimizedSpend,
      monthlySavings,
      annualSavings: Number((monthlySavings * 12).toFixed(2)),
      confidence: optimized.confidence,
      reason: optimized.reason,
      recommendationType: optimized.recommendationType,
    };
  });

  const currentMonthlySpend = Number(
    values.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0).toFixed(2),
  );
  const optimizedMonthlySpend = Number(
    recommendations.reduce((sum, tool) => sum + tool.optimizedMonthlySpend, 0).toFixed(2),
  );
  const totalMonthlySavings = Number(
    Math.max(currentMonthlySpend - optimizedMonthlySpend, 0).toFixed(2),
  );
  const totalAnnualSavings = Number((totalMonthlySavings * 12).toFixed(2));
  const optimizationScore = Math.max(
    38,
    Math.min(
      96,
      Math.round(
        100 -
          (totalMonthlySavings / Math.max(currentMonthlySpend, 1)) * 100 * useCaseAdjustment[values.primaryUseCase],
      ),
    ),
  );

  const roiMetrics: RoiMetric[] = [
    {
      label: "Waste ratio",
      value: `${Math.round(
        (totalMonthlySavings / Math.max(currentMonthlySpend, 1)) * 100,
      )}%`,
      tone: totalMonthlySavings > 0 ? "positive" : "default",
    },
    {
      label: "Seat efficiency",
      value: `${Math.round(
        values.tools.reduce((sum, tool) => sum + tool.seats, 0) / Math.max(values.teamSize, 1),
      )}x`,
    },
    {
      label: "Payback window",
      value: totalMonthlySavings > 0 ? "Immediate" : "Already optimized",
      tone: totalMonthlySavings > 0 ? "positive" : "default",
    },
  ];

  const chart = recommendations.map((recommendation) => ({
    label: recommendation.toolName,
    current: recommendation.currentMonthlySpend,
    optimized: recommendation.optimizedMonthlySpend,
  }));

  const summary = generateSummary({
    teamSize: values.teamSize,
    primaryUseCase: values.primaryUseCase,
    currentMonthlySpend,
    optimizedMonthlySpend,
    totalMonthlySavings,
    recommendations,
  });

  return {
    token,
    createdAt: new Date().toISOString(),
    teamSize: values.teamSize,
    primaryUseCase: values.primaryUseCase,
    currentMonthlySpend,
    optimizedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    optimizationScore,
    summary,
    recommendations,
    chart,
    roiMetrics,
    consultationRecommended: totalMonthlySavings > 500,
  };
}

export function createSampleAuditReport() {
  return createAuditReport(
    {
      teamSize: 11,
      primaryUseCase: "coding",
      tools: [
        {
          id: "cursor-1",
          toolId: "cursor",
          planId: "business",
          monthlySpend: 320,
          seats: 8,
          usageType: "shared",
        },
        {
          id: "chatgpt-1",
          toolId: "chatgpt",
          planId: "team",
          monthlySpend: 210,
          seats: 7,
          usageType: "weekly",
        },
        {
          id: "openai-1",
          toolId: "openai-api",
          planId: "api-direct",
          monthlySpend: 680,
          seats: 1,
          usageType: "daily",
        },
        {
          id: "copilot-1",
          toolId: "github-copilot",
          planId: "business",
          monthlySpend: 152,
          seats: 8,
          usageType: "light",
        },
      ],
    },
    "sample-audit",
  );
}
