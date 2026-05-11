import { generateFallbackSummary } from "@/lib/anthropic";
import { getToolById } from "@/lib/pricing-data";
import type { ToolPlanOption } from "@/types/tool";
import type {
  AuditFormValues,
  AuditReport,
  AuditSummaryInput,
  AuditToolInput,
  RoiMetric,
  ToolRecommendation,
} from "@/types/audit";

type ActionType = ToolRecommendation["actionType"];
type Confidence = ToolRecommendation["confidence"];
type PrimaryUseCase = AuditFormValues["primaryUseCase"];

interface ToolEvaluationContext {
  toolInput: AuditToolInput;
  formValues: AuditFormValues;
  toolMeta: NonNullable<ReturnType<typeof getToolById>>;
  currentPlan: ToolPlanOption;
  usageWeight: number;
}

interface RecommendationCandidate {
  recommendedToolName: string;
  recommendedPlan: string;
  recommendedSeats: number;
  optimizedSpend: number;
  actionType: ActionType;
  confidence: Confidence;
  reason: string;
}

function buildSummaryInput(
  values: AuditFormValues,
  recommendations: ToolRecommendation[],
  currentMonthlySpend: number,
  optimizedMonthlySpend: number,
  totalMonthlySavings: number,
  totalAnnualSavings: number,
  overallAssessment: string,
): AuditSummaryInput {
  return {
    teamSize: values.teamSize,
    primaryUseCase: values.primaryUseCase,
    currentMonthlySpend,
    optimizedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    overallAssessment,
    recommendations,
  };
}

export function createAuditSummaryInput(values: AuditFormValues, report: AuditReport) {
  return buildSummaryInput(
    values,
    report.recommendations,
    report.currentMonthlySpend,
    report.optimizedMonthlySpend,
    report.totalMonthlySavings,
    report.totalAnnualSavings,
    report.overallAssessment,
  );
}

const usageWeights: Record<AuditToolInput["usageType"], number> = {
  experimental: 0.35,
  light: 0.5,
  weekly: 0.72,
  shared: 0.82,
  daily: 1,
};

const useCaseLabels: Record<PrimaryUseCase, string> = {
  coding: "coding",
  writing: "writing",
  data: "data",
  research: "research",
  mixed: "mixed-use",
};

const useCaseAdjustment: Record<PrimaryUseCase, number> = {
  coding: 1,
  writing: 0.82,
  data: 0.9,
  research: 0.88,
  mixed: 0.95,
};

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

function getUsageWeight(usageType: AuditToolInput["usageType"]) {
  return usageWeights[usageType];
}

function isEnterprisePlan(planId: string) {
  return planId === "enterprise";
}

function isPremiumSoloPlan(planId: string) {
  return ["max", "ultra"].includes(planId);
}

function getKnownPlanSpend(plan: ToolPlanOption, seats: number) {
  return plan.monthlyPrice === null ? null : roundCurrency(plan.monthlyPrice * seats);
}

function findPlan(toolId: AuditToolInput["toolId"], planId: string) {
  return getToolById(toolId)?.plans.find((plan) => plan.id === planId) ?? null;
}

function buildMaintainReason(context: ToolEvaluationContext) {
  const {
    formValues: { teamSize, primaryUseCase },
    toolInput,
    currentPlan,
  } = context;

  return `For a ${teamSize}-person ${useCaseLabels[primaryUseCase]} team with ${toolInput.usageType.replace("-", " ")} usage, ${currentPlan.name} appears proportionate to the stated workflow. No cheaper real-plan change clearly preserves the same level of access.`;
}

function createMaintainCandidate(context: ToolEvaluationContext): RecommendationCandidate {
  return {
    recommendedToolName: context.toolMeta.name,
    recommendedPlan: context.currentPlan.name,
    recommendedSeats: context.toolInput.seats,
    optimizedSpend: roundCurrency(context.toolInput.monthlySpend),
    actionType: "maintain",
    confidence: "High",
    reason: buildMaintainReason(context),
  };
}

function maybeCreateSeatReductionCandidate(
  context: ToolEvaluationContext,
): RecommendationCandidate | null {
  const {
    toolInput,
    formValues: { teamSize, primaryUseCase },
    currentPlan,
  } = context;

  if (currentPlan.monthlyPrice === null) {
    return null;
  }

  const canReduceSeats =
    toolInput.seats > teamSize ||
    (toolInput.usageType === "shared" && toolInput.seats >= 3) ||
    (toolInput.usageType === "experimental" && toolInput.seats >= 3);

  if (!canReduceSeats) {
    return null;
  }

  let recommendedSeats = toolInput.seats;

  if (toolInput.seats > teamSize) {
    recommendedSeats = teamSize;
  } else if (toolInput.usageType === "shared") {
    recommendedSeats = Math.max(1, Math.min(toolInput.seats - 1, Math.ceil(teamSize * 0.7)));
  } else if (toolInput.usageType === "experimental") {
    recommendedSeats = Math.max(1, Math.ceil(toolInput.seats * 0.5));
  }

  if (recommendedSeats >= toolInput.seats) {
    return null;
  }

  const optimizedSpend = roundCurrency(currentPlan.monthlyPrice * recommendedSeats);

  if (optimizedSpend >= toolInput.monthlySpend) {
    return null;
  }

  const confidence: Confidence =
    toolInput.seats > teamSize || toolInput.usageType === "shared" ? "High" : "Medium";

  return {
    recommendedToolName: context.toolMeta.name,
    recommendedPlan: currentPlan.name,
    recommendedSeats,
    optimizedSpend,
    actionType: "reduce_seats",
    confidence,
    reason: `${toolInput.seats} paid seats looks oversized for a ${teamSize}-person ${useCaseLabels[primaryUseCase]} team with ${toolInput.usageType} usage. Reducing seats from ${toolInput.seats} to ${recommendedSeats} keeps the same plan while aligning paid access more closely with actual workflow intensity.`,
  };
}

function maybeCreateSameVendorDowngrade(
  context: ToolEvaluationContext,
): RecommendationCandidate | null {
  const {
    toolInput,
    formValues: { teamSize, primaryUseCase },
    toolMeta,
    currentPlan,
    usageWeight,
  } = context;

  const seats = toolInput.seats;
  let targetPlanId: string | null = null;

  switch (toolInput.toolId) {
    case "cursor":
      if (currentPlan.id === "enterprise" && teamSize < 25) {
        targetPlanId = seats >= 3 ? "business" : "pro";
      } else if (
        currentPlan.id === "business" &&
        (teamSize <= 3 || seats <= 2 || usageWeight <= 0.68)
      ) {
        targetPlanId = "pro";
      } else if (
        currentPlan.id === "pro" &&
        seats === 1 &&
        usageWeight <= 0.35 &&
        ["experimental", "light"].includes(toolInput.usageType)
      ) {
        targetPlanId = "hobby";
      }
      break;
    case "github-copilot":
      if (currentPlan.id === "enterprise" && teamSize < 25) {
        targetPlanId = "business";
      } else if (
        currentPlan.id === "business" &&
        teamSize <= 2 &&
        seats <= 2 &&
        usageWeight <= 0.68
      ) {
        targetPlanId = "individual";
      }
      break;
    case "claude":
      if (
        currentPlan.id === "max" &&
        seats === 1 &&
        usageWeight <= 0.68 &&
        ["writing", "research", "mixed"].includes(primaryUseCase)
      ) {
        targetPlanId = "pro";
      } else if (
        currentPlan.id === "team" &&
        teamSize <= 2 &&
        seats <= 2 &&
        toolInput.usageType !== "shared"
      ) {
        targetPlanId = "pro";
      } else if (currentPlan.id === "enterprise" && teamSize < 25) {
        targetPlanId = seats >= 3 ? "team" : "pro";
      } else if (
        currentPlan.id === "pro" &&
        seats === 1 &&
        usageWeight <= 0.35 &&
        ["writing", "research"].includes(primaryUseCase) &&
        toolInput.usageType === "experimental"
      ) {
        targetPlanId = "free";
      }
      break;
    case "chatgpt":
      if (
        currentPlan.id === "team" &&
        teamSize <= 2 &&
        seats <= 2 &&
        usageWeight <= 0.72 &&
        toolInput.usageType !== "shared"
      ) {
        targetPlanId = "plus";
      } else if (currentPlan.id === "enterprise" && teamSize < 25) {
        targetPlanId = seats >= 3 ? "team" : "plus";
      }
      break;
    case "gemini":
      if (
        currentPlan.id === "ultra" &&
        (teamSize <= 5 || usageWeight <= 0.72 || primaryUseCase !== "data")
      ) {
        targetPlanId = "pro";
      }
      break;
    case "windsurf":
      if (currentPlan.id === "enterprise" && teamSize < 25) {
        targetPlanId = seats >= 3 ? "team" : "pro";
      } else if (
        currentPlan.id === "team" &&
        (teamSize <= 3 || seats <= 3 || usageWeight <= 0.68)
      ) {
        targetPlanId = "pro";
      } else if (
        currentPlan.id === "pro" &&
        seats === 1 &&
        usageWeight <= 0.35 &&
        ["experimental", "light"].includes(toolInput.usageType)
      ) {
        targetPlanId = "free";
      }
      break;
    default:
      targetPlanId = null;
  }

  if (!targetPlanId) {
    return null;
  }

  const targetPlan = findPlan(toolInput.toolId, targetPlanId);
  const optimizedSpend = targetPlan ? getKnownPlanSpend(targetPlan, seats) : null;

  if (!targetPlan || optimizedSpend === null || optimizedSpend >= toolInput.monthlySpend) {
    return null;
  }

  const confidence: Confidence =
    isEnterprisePlan(currentPlan.id) || isPremiumSoloPlan(currentPlan.id) ? "High" : "Medium";

  return {
    recommendedToolName: toolMeta.name,
    recommendedPlan: targetPlan.name,
    recommendedSeats: seats,
    optimizedSpend,
    actionType: "downgrade",
    confidence,
    reason: `${currentPlan.name} appears oversized for a ${teamSize}-person ${useCaseLabels[primaryUseCase]} team with ${toolInput.usageType} usage. ${targetPlan.name} is a real lower-cost plan from ${toolMeta.name} that should better match the stated workflow without assuming a capability loss your inputs do not justify.`,
  };
}

function maybeCreateVendorSwitchCandidate(
  context: ToolEvaluationContext,
): RecommendationCandidate | null {
  const {
    toolInput,
    formValues: { teamSize, primaryUseCase },
    currentPlan,
    usageWeight,
  } = context;

  const seats = toolInput.seats;

  if (
    toolInput.toolId === "chatgpt" &&
    currentPlan.id === "team" &&
    primaryUseCase === "writing" &&
    teamSize <= 2 &&
    seats <= 2 &&
    usageWeight <= 0.5
  ) {
    const targetPlan = findPlan("claude", "pro");
    const optimizedSpend = targetPlan ? getKnownPlanSpend(targetPlan, seats) : null;

    if (targetPlan && optimizedSpend !== null && optimizedSpend < toolInput.monthlySpend) {
      return {
        recommendedToolName: "Claude",
        recommendedPlan: targetPlan.name,
        recommendedSeats: seats,
        optimizedSpend,
        actionType: "switch_vendor",
        confidence: "Medium",
        reason: `ChatGPT Team collaboration features may be underutilized for a ${teamSize}-person writing workflow with ${toolInput.usageType} usage. Claude Pro is a lower-cost real plan that preserves strong writing capability without paying for team collaboration overhead.`,
      };
    }
  }

  if (
    toolInput.toolId === "claude" &&
    currentPlan.id === "max" &&
    ["writing", "research"].includes(primaryUseCase) &&
    teamSize <= 2 &&
    usageWeight <= 0.5
  ) {
    const targetPlan = findPlan("chatgpt", "plus");
    const optimizedSpend = targetPlan ? getKnownPlanSpend(targetPlan, seats) : null;

    if (targetPlan && optimizedSpend !== null && optimizedSpend < toolInput.monthlySpend) {
      return {
        recommendedToolName: "ChatGPT",
        recommendedPlan: targetPlan.name,
        recommendedSeats: seats,
        optimizedSpend,
        actionType: "switch_vendor",
        confidence: "Medium",
        reason: `Your ${seats}-seat ${primaryUseCase} workflow is unlikely to require Claude Max throughput limits at ${toolInput.usageType} intensity. ChatGPT Plus is a materially cheaper real plan for lightweight research and writing use cases.`,
      };
    }
  }

  if (
    toolInput.toolId === "cursor" &&
    ["business", "enterprise"].includes(currentPlan.id) &&
    ["coding", "mixed"].includes(primaryUseCase) &&
    usageWeight <= 0.5 &&
    teamSize <= 8
  ) {
    const targetPlan = findPlan("github-copilot", "business");
    const optimizedSpend = targetPlan ? getKnownPlanSpend(targetPlan, seats) : null;

    if (targetPlan && optimizedSpend !== null && optimizedSpend < toolInput.monthlySpend) {
      return {
        recommendedToolName: "GitHub Copilot",
        recommendedPlan: targetPlan.name,
        recommendedSeats: seats,
        optimizedSpend,
        actionType: "switch_vendor",
        confidence: "Medium",
        reason: `Cursor ${currentPlan.name} can be expensive for a ${teamSize}-person ${primaryUseCase} team if the workflow is mostly basic code completion and chat assistance. GitHub Copilot Business is a lower-cost real alternative for that usage profile.`,
      };
    }
  }

  return null;
}

function maybeCreateUsageCreditOpportunity(
  context: ToolEvaluationContext,
): RecommendationCandidate | null {
  const {
    toolInput,
    formValues: { teamSize, primaryUseCase },
    toolMeta,
    currentPlan,
  } = context;

  if (toolMeta.category !== "api" || toolInput.monthlySpend < 250) {
    return null;
  }

  return {
    recommendedToolName: toolMeta.name,
    recommendedPlan: currentPlan.name,
    recommendedSeats: toolInput.seats,
    optimizedSpend: roundCurrency(toolInput.monthlySpend),
    actionType: "usage_credit_opportunity",
    confidence: "Low",
    reason: `${toolMeta.name} is usage-priced rather than seat-priced, so no defensible plan downgrade can be quoted from public pricing alone. For a ${teamSize}-person ${useCaseLabels[primaryUseCase]} team spending $${toolInput.monthlySpend.toFixed(0)}/mo, startup credits or committed-use programs are worth checking before assuming the current API bill is final.`,
  };
}

function chooseBestCandidate(
  currentSpend: number,
  candidates: Array<RecommendationCandidate | null>,
  fallback: RecommendationCandidate,
) {
  const actionableCandidates = candidates
    .filter((candidate): candidate is RecommendationCandidate => candidate !== null)
    .map((candidate) => ({
      ...candidate,
      monthlySavings: roundCurrency(Math.max(currentSpend - candidate.optimizedSpend, 0)),
      decisionScore:
        roundCurrency(Math.max(currentSpend - candidate.optimizedSpend, 0)) -
        (candidate.actionType === "switch_vendor"
          ? 15
          : candidate.actionType === "usage_credit_opportunity"
            ? 5
            : 0),
    }))
    .filter(
      (candidate) =>
        candidate.monthlySavings > 0 || candidate.actionType === "usage_credit_opportunity",
    )
    .sort((left, right) => right.decisionScore - left.decisionScore);

  return actionableCandidates[0] ?? fallback;
}

export function evaluateToolRecommendation(
  toolInput: AuditToolInput,
  formValues: AuditFormValues,
): ToolRecommendation {
  const toolMeta = getToolById(toolInput.toolId);

  if (!toolMeta) {
    return {
      id: toolInput.id,
      toolId: toolInput.toolId,
      toolName: toolInput.toolId,
      tool: toolInput.toolId,
      currentPlan: toolInput.planId,
      recommendedPlan: "Maintain current plan",
      suggestedPlan: "Maintain current plan",
      currentSeats: toolInput.seats,
      recommendedSeats: toolInput.seats,
      currentSpend: roundCurrency(toolInput.monthlySpend),
      optimizedSpend: roundCurrency(toolInput.monthlySpend),
      currentMonthlySpend: roundCurrency(toolInput.monthlySpend),
      optimizedMonthlySpend: roundCurrency(toolInput.monthlySpend),
      monthlySavings: 0,
      annualSavings: 0,
      confidence: "Low",
      actionType: "maintain",
      reason:
        "Pricing metadata for this tool is unavailable, so the engine is conservatively maintaining the current setup.",
    };
  }

  const currentPlan = toolMeta.plans.find((plan) => plan.id === toolInput.planId) ?? toolMeta.plans[0];
  const context: ToolEvaluationContext = {
    toolInput,
    formValues,
    toolMeta,
    currentPlan,
    usageWeight: getUsageWeight(toolInput.usageType),
  };

  const fallback = createMaintainCandidate(context);
  const bestCandidate = chooseBestCandidate(toolInput.monthlySpend, [
    maybeCreateSameVendorDowngrade(context),
    maybeCreateSeatReductionCandidate(context),
    maybeCreateVendorSwitchCandidate(context),
    maybeCreateUsageCreditOpportunity(context),
  ], fallback);

  const currentSpend = roundCurrency(toolInput.monthlySpend);
  const optimizedSpend = roundCurrency(bestCandidate.optimizedSpend);
  const monthlySavings = roundCurrency(Math.max(currentSpend - optimizedSpend, 0));

  return {
    id: toolInput.id,
    toolId: toolInput.toolId,
    toolName: toolMeta.name,
    tool: toolMeta.name,
    currentPlan: currentPlan.name,
    recommendedPlan: bestCandidate.recommendedPlan,
    suggestedPlan: bestCandidate.recommendedPlan,
    currentSeats: toolInput.seats,
    recommendedSeats: bestCandidate.recommendedSeats,
    currentSpend,
    optimizedSpend,
    currentMonthlySpend: currentSpend,
    optimizedMonthlySpend: optimizedSpend,
    monthlySavings,
    annualSavings: roundCurrency(monthlySavings * 12),
    confidence: bestCandidate.confidence,
    actionType: bestCandidate.actionType,
    reason: bestCandidate.reason,
  };
}

export function getOverallAssessment(totalMonthlySavings: number) {
  if (totalMonthlySavings > 500) {
    return "High optimization opportunity detected.";
  }

  if (totalMonthlySavings < 100) {
    return "Your AI stack already appears well optimized.";
  }

  return "Moderate optimization opportunity detected.";
}

function calculateOptimizationScore(
  currentMonthlySpend: number,
  totalMonthlySavings: number,
  primaryUseCase: PrimaryUseCase,
) {
  return Math.max(
    38,
    Math.min(
      96,
      Math.round(
        100 -
          (totalMonthlySavings / Math.max(currentMonthlySpend, 1)) *
            100 *
            useCaseAdjustment[primaryUseCase],
      ),
    ),
  );
}

function buildRoiMetrics(
  teamSize: number,
  tools: AuditToolInput[],
  currentMonthlySpend: number,
  totalMonthlySavings: number,
): RoiMetric[] {
  return [
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
        tools.reduce((sum, tool) => sum + tool.seats, 0) / Math.max(teamSize, 1),
      )}x`,
    },
    {
      label: "Payback window",
      value: totalMonthlySavings > 0 ? "Immediate" : "Already optimized",
      tone: totalMonthlySavings > 0 ? "positive" : "default",
    },
  ];
}

function buildChart(recommendations: ToolRecommendation[]) {
  return recommendations.map((recommendation) => ({
    label: recommendation.toolName,
    current: recommendation.currentSpend,
    optimized: recommendation.optimizedSpend,
  }));
}

export function createPresentationAuditReport(input: {
  token: string;
  createdAt: string;
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: AuditToolInput[];
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary: string;
  recommendations: ToolRecommendation[];
}): AuditReport {
  const overallAssessment = getOverallAssessment(input.totalMonthlySavings);
  const optimizationScore = calculateOptimizationScore(
    input.currentMonthlySpend,
    input.totalMonthlySavings,
    input.primaryUseCase,
  );

  return {
    token: input.token,
    createdAt: input.createdAt,
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    currentMonthlySpend: input.currentMonthlySpend,
    optimizedMonthlySpend: input.optimizedMonthlySpend,
    totalMonthlySavings: input.totalMonthlySavings,
    totalAnnualSavings: input.totalAnnualSavings,
    overallAssessment,
    optimizationScore,
    summary: input.summary,
    recommendations: input.recommendations,
    chart: buildChart(input.recommendations),
    roiMetrics: buildRoiMetrics(
      input.teamSize,
      input.tools,
      input.currentMonthlySpend,
      input.totalMonthlySavings,
    ),
    consultationRecommended: input.totalMonthlySavings > 500,
  };
}

export function createAuditReport(
  values: AuditFormValues,
  token = crypto.randomUUID().slice(0, 8),
): AuditReport {
  const recommendations = values.tools.map((toolInput) =>
    evaluateToolRecommendation(toolInput, values),
  );

  const currentMonthlySpend = roundCurrency(
    values.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0),
  );
  const optimizedMonthlySpend = roundCurrency(
    recommendations.reduce((sum, recommendation) => sum + recommendation.optimizedSpend, 0),
  );
  const totalMonthlySavings = roundCurrency(
    Math.max(currentMonthlySpend - optimizedMonthlySpend, 0),
  );
  const totalAnnualSavings = roundCurrency(totalMonthlySavings * 12);
  const overallAssessment = getOverallAssessment(totalMonthlySavings);

  const summary = generateFallbackSummary({
    ...buildSummaryInput(
      values,
      recommendations,
      currentMonthlySpend,
      optimizedMonthlySpend,
      totalMonthlySavings,
      totalAnnualSavings,
      overallAssessment,
    ),
  });

  return createPresentationAuditReport({
    token,
    createdAt: new Date().toISOString(),
    teamSize: values.teamSize,
    primaryUseCase: values.primaryUseCase,
    tools: values.tools,
    currentMonthlySpend,
    optimizedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    summary,
    recommendations,
  });
}

export function createSampleAuditReport() {
  return createAuditReport(
    {
      teamSize: 8,
      primaryUseCase: "writing",
      tools: [
        {
          id: "chatgpt-team",
          toolId: "chatgpt",
          planId: "team",
          monthlySpend: 60,
          seats: 2,
          usageType: "weekly",
        },
        {
          id: "claude-max",
          toolId: "claude",
          planId: "max",
          monthlySpend: 100,
          seats: 1,
          usageType: "light",
        },
        {
          id: "openai-api",
          toolId: "openai-api",
          planId: "api-direct",
          monthlySpend: 420,
          seats: 1,
          usageType: "daily",
        },
      ],
    },
    "sample-audit",
  );
}

export function createHighSavingsMockAuditReport() {
  return createAuditReport(
    {
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [
        {
          id: "cursor-business",
          toolId: "cursor",
          planId: "business",
          monthlySpend: 400,
          seats: 10,
          usageType: "weekly",
        },
        {
          id: "copilot-enterprise",
          toolId: "github-copilot",
          planId: "enterprise",
          monthlySpend: 390,
          seats: 10,
          usageType: "weekly",
        },
        {
          id: "windsurf-team",
          toolId: "windsurf",
          planId: "team",
          monthlySpend: 240,
          seats: 6,
          usageType: "shared",
        },
      ],
    },
    "high-savings-audit",
  );
}

export function createOptimizedMockAuditReport() {
  return createAuditReport(
    {
      teamSize: 4,
      primaryUseCase: "coding",
      tools: [
        {
          id: "cursor-pro",
          toolId: "cursor",
          planId: "pro",
          monthlySpend: 80,
          seats: 4,
          usageType: "daily",
        },
        {
          id: "chatgpt-plus",
          toolId: "chatgpt",
          planId: "plus",
          monthlySpend: 40,
          seats: 2,
          usageType: "weekly",
        },
      ],
    },
    "optimized-audit",
  );
}
