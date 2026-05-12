import Anthropic from "@anthropic-ai/sdk";

import type { AuditSummaryInput, ToolRecommendation } from "@/types/audit";

export const AUDIT_SUMMARY_SYSTEM_PROMPT = `You are writing a concise audit summary for a startup SaaS product called Stack Audit.

Your job is to explain AI spend findings in a way that is:
- professional
- financially rational
- startup-friendly
- concise
- honest

Rules:
- Keep the summary around 90 to 120 words.
- Do not invent pricing, capabilities, or savings.
- Use the deterministic audit results as ground truth.
- Emphasize the biggest real optimization opportunity.
- If savings are low, explicitly say the stack already appears reasonably optimized.
- Never mention model uncertainty, prompts, APIs, or internal tooling.
- Write in plain business English suitable for a founder, finance lead, or engineering manager.`;

function formatRecommendationLine(recommendation: ToolRecommendation) {
  const savingsText =
    recommendation.monthlySavings > 0
      ? `$${recommendation.monthlySavings.toFixed(0)}/mo savings`
      : "no quantified savings";

  return [
    `${recommendation.toolName}: ${recommendation.currentPlan} -> ${recommendation.recommendedPlan}`,
    `action=${recommendation.actionType}`,
    `confidence=${recommendation.confidence}`,
    `seats=${recommendation.currentSeats}->${recommendation.recommendedSeats}`,
    savingsText,
    `reason=${recommendation.reason}`,
  ].join(" | ");
}

export function buildAuditSummaryUserPrompt(input: AuditSummaryInput) {
  const recommendationLines = input.recommendations
    .map(formatRecommendationLine)
    .join("\n");

  return `Write a personalized Stack Audit summary for this startup AI spend report.

Team size: ${input.teamSize}
Primary use case: ${input.primaryUseCase}
Current monthly spend: $${input.currentMonthlySpend.toFixed(2)}
Optimized monthly spend: $${input.optimizedMonthlySpend.toFixed(2)}
Monthly savings: $${input.totalMonthlySavings.toFixed(2)}
Annual savings: $${(input.totalAnnualSavings ?? input.totalMonthlySavings * 12).toFixed(2)}
Overall assessment: ${input.overallAssessment ?? "Not provided"}

Recommendations:
${recommendationLines}

Return one concise paragraph only.`;
}

function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Anthropic({ apiKey });
}

function logSummaryEvent(
  stage: string,
  payload: Record<string, unknown>,
) {
  console.log(`[Anthropic Summary] ${stage}`, payload);
}

function getTopRecommendation(recommendations: ToolRecommendation[]) {
  return [...recommendations].sort((left, right) => {
    if (right.monthlySavings !== left.monthlySavings) {
      return right.monthlySavings - left.monthlySavings;
    }

    const priorityOrder: Record<ToolRecommendation["actionType"], number> = {
      downgrade: 5,
      reduce_seats: 4,
      switch_vendor: 3,
      usage_credit_opportunity: 2,
      maintain: 1,
    };

    return priorityOrder[right.actionType] - priorityOrder[left.actionType];
  })[0];
}

export function generateFallbackSummary(input: AuditSummaryInput) {
  const topRecommendation = getTopRecommendation(input.recommendations);

  if (!topRecommendation || input.totalMonthlySavings < 100) {
    return `This ${input.teamSize}-person ${input.primaryUseCase} team already appears reasonably optimized. Current AI spend is concentrated in plans that broadly fit the stated workflow, so the main opportunity is ongoing monitoring for seat creep, pricing changes, and future startup-credit eligibility rather than immediate plan changes.`;
  }

  const biggestOpportunity =
    topRecommendation.actionType === "usage_credit_opportunity"
      ? `${topRecommendation.toolName}, where the best next step is to review startup credits or committed-use incentives before assuming the current API bill is fixed`
      : `${topRecommendation.toolName}, where moving from ${topRecommendation.currentPlan} to ${topRecommendation.recommendedPlan}${topRecommendation.currentSeats !== topRecommendation.recommendedSeats ? ` and resizing seats from ${topRecommendation.currentSeats} to ${topRecommendation.recommendedSeats}` : ""} could save about $${topRecommendation.monthlySavings.toFixed(0)}/month`;

  return `Stack Audit found a credible path from $${input.currentMonthlySpend.toFixed(
    0,
  )}/month to $${input.optimizedMonthlySpend.toFixed(
    0,
  )}/month while preserving the team's stated ${input.primaryUseCase} workflow. The strongest opportunity is ${biggestOpportunity}. Overall, the stack shows measurable savings potential without requiring unrealistic free-tier downgrades or unsupported pricing assumptions.`;
}

function extractTextFromMessage(
  content: Array<{ type: string; text?: string }>,
) {
  return content
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text?.trim() ?? "")
    .join("\n")
    .trim();
}

export async function generateAuditSummary(
  input: AuditSummaryInput,
  options?: {
    client?: {
      messages: {
        create: (args: object) => Promise<{
          content: Array<{ type: string; text?: string }>;
        }>;
      };
    } | null;
    timeoutMs?: number;
  },
) {
  const fallbackSummary = generateFallbackSummary(input);
  const client = options?.client ?? createAnthropicClient();

  logSummaryEvent("start", {
    hasAnthropicClient: Boolean(client),
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    currentMonthlySpend: input.currentMonthlySpend,
    optimizedMonthlySpend: input.optimizedMonthlySpend,
    totalMonthlySavings: input.totalMonthlySavings,
    recommendationCount: input.recommendations.length,
  });

  if (!client) {
    logSummaryEvent("fallback:no-client", {
      summary: fallbackSummary,
    });
    return {
      summary: fallbackSummary,
      source: "fallback" as const,
    };
  }

  const timeoutMs = options?.timeoutMs ?? 8000;

  try {
    logSummaryEvent("request", {
      model: "claude-3-5-sonnet-latest",
      timeoutMs,
      promptPreview: buildAuditSummaryUserPrompt(input).slice(0, 400),
    });

    const response = await Promise.race([
      client.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 220,
        temperature: 0.3,
        system: AUDIT_SUMMARY_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildAuditSummaryUserPrompt(input),
          },
        ],
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("SUMMARY_TIMEOUT")), timeoutMs);
      }),
    ]);

    const text = extractTextFromMessage(response.content);

    if (!text) {
      logSummaryEvent("fallback:empty-response", {
        summary: fallbackSummary,
      });
      return {
        summary: fallbackSummary,
        source: "fallback" as const,
      };
    }

    logSummaryEvent("success", {
      source: "ai",
      summary: text,
    });

    return {
      summary: text,
      source: "ai" as const,
    };
  } catch (error) {
    logSummaryEvent("fallback:error", {
      error: error instanceof Error ? error.message : "Unknown Anthropic error",
      summary: fallbackSummary,
    });
    return {
      summary: fallbackSummary,
      source: "fallback" as const,
    };
  }
}
