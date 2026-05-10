import {
  buildAuditSummaryUserPrompt,
  generateAuditSummary,
  generateFallbackSummary,
} from "@/lib/anthropic";
import type { AuditSummaryInput } from "@/types/audit";

const summaryInput: AuditSummaryInput = {
  teamSize: 3,
  primaryUseCase: "writing",
  currentMonthlySpend: 160,
  optimizedMonthlySpend: 77,
  totalMonthlySavings: 83,
  totalAnnualSavings: 996,
  overallAssessment: "Moderate optimization opportunity detected.",
  recommendations: [
    {
      id: "claude-max",
      toolId: "claude",
      toolName: "Claude",
      tool: "Claude",
      currentPlan: "Max",
      recommendedPlan: "Pro",
      suggestedPlan: "Pro",
      currentSeats: 1,
      recommendedSeats: 1,
      currentSpend: 100,
      optimizedSpend: 17,
      currentMonthlySpend: 100,
      optimizedMonthlySpend: 17,
      monthlySavings: 83,
      annualSavings: 996,
      confidence: "High",
      actionType: "downgrade",
      reason:
        "Your 1-seat writing workflow is unlikely to require Claude Max throughput limits.",
    },
  ],
};

describe("Anthropic summary generation", () => {
  it("builds a prompt with deterministic audit facts", () => {
    const prompt = buildAuditSummaryUserPrompt(summaryInput);

    expect(prompt).toContain("Team size: 3");
    expect(prompt).toContain("Current monthly spend: $160.00");
    expect(prompt).toContain("Claude: Max -> Pro");
  });

  it("falls back gracefully when the Anthropic client fails", async () => {
    const result = await generateAuditSummary(summaryInput, {
      client: {
        messages: {
          create: async () => {
            throw new Error("quota exceeded");
          },
        },
      },
      timeoutMs: 50,
    });

    expect(result.source).toBe("fallback");
    expect(result.summary).toBe(generateFallbackSummary(summaryInput));
  });

  it("returns AI output when the Anthropic client succeeds", async () => {
    const result = await generateAuditSummary(summaryInput, {
      client: {
        messages: {
          create: async () => ({
            content: [
              {
                type: "text",
                text: "This is a concise AI-authored audit summary.",
              },
            ],
          }),
        },
      },
      timeoutMs: 50,
    });

    expect(result.source).toBe("ai");
    expect(result.summary).toContain("AI-authored");
  });
});
