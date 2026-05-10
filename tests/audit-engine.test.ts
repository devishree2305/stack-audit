import {
  createAuditReport,
  createOptimizedMockAuditReport,
  createSampleAuditReport,
} from "@/lib/audit-engine";

describe("audit engine recommendation quality", () => {
  it("uses real plan names and non-negative pricing math", () => {
    const report = createSampleAuditReport();

    expect(report.token).toBe("sample-audit");
    expect(report.totalMonthlySavings).toBeGreaterThan(0);
    expect(report.totalAnnualSavings).toBe(report.totalMonthlySavings * 12);

    for (const recommendation of report.recommendations) {
      expect(recommendation.recommendedPlan.length).toBeGreaterThan(0);
      expect(recommendation.recommendedPlan).not.toMatch(/lighter|optimized workflow/i);
      expect(recommendation.monthlySavings).toBeGreaterThanOrEqual(0);
      expect(recommendation.optimizedSpend).toBeLessThanOrEqual(
        recommendation.currentSpend,
      );
    }
  });

  it("keeps heavy daily users on appropriate paid plans", () => {
    const report = createAuditReport(
      {
        teamSize: 4,
        primaryUseCase: "coding",
        tools: [
          {
            id: "cursor-pro-heavy",
            toolId: "cursor",
            planId: "pro",
            monthlySpend: 80,
            seats: 4,
            usageType: "daily",
          },
        ],
      },
      "heavy-user-test",
    );

    expect(report.totalMonthlySavings).toBe(0);
    expect(report.recommendations[0].actionType).toBe("maintain");
    expect(report.recommendations[0].recommendedPlan).toBe("Pro");
  });

  it("downgrades light solo premium usage to a real lower tier", () => {
    const report = createAuditReport(
      {
        teamSize: 2,
        primaryUseCase: "research",
        tools: [
          {
            id: "claude-max-light",
            toolId: "claude",
            planId: "max",
            monthlySpend: 100,
            seats: 1,
            usageType: "light",
          },
        ],
      },
      "light-user-downgrade",
    );

    expect(report.recommendations[0].actionType).toBe("downgrade");
    expect(report.recommendations[0].recommendedPlan).toBe("Pro");
    expect(report.recommendations[0].monthlySavings).toBe(83);
  });

  it("prefers same-vendor downgrades over small vendor-switch gains", () => {
    const report = createAuditReport(
      {
        teamSize: 2,
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
        ],
      },
      "same-vendor-priority",
    );

    expect(report.recommendations[0].actionType).toBe("downgrade");
    expect(report.recommendations[0].recommendedPlan).toBe("Plus");
  });

  it("flags API spend as a credit opportunity instead of inventing fake plan savings", () => {
    const report = createAuditReport(
      {
        teamSize: 6,
        primaryUseCase: "mixed",
        tools: [
          {
            id: "openai-api",
            toolId: "openai-api",
            planId: "api-direct",
            monthlySpend: 320,
            seats: 1,
            usageType: "daily",
          },
        ],
      },
      "api-credit",
    );

    expect(report.recommendations[0].actionType).toBe("usage_credit_opportunity");
    expect(report.recommendations[0].monthlySavings).toBe(0);
    expect(report.recommendations[0].optimizedSpend).toBe(320);
  });

  it("returns honest maintain recommendations for already optimized stacks", () => {
    const report = createOptimizedMockAuditReport();

    expect(report.overallAssessment).toBe(
      "Your AI stack already appears well optimized.",
    );
    expect(report.totalMonthlySavings).toBe(0);
    expect(report.recommendations.every((item) => item.actionType === "maintain")).toBe(
      true,
    );
  });
});
