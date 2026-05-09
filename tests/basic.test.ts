import { createSampleAuditReport } from "@/lib/audit-engine";

describe("createSampleAuditReport", () => {
  it("returns a report with positive savings totals", () => {
    const report = createSampleAuditReport();

    expect(report.token).toBe("sample-audit");
    expect(report.totalMonthlySavings).toBeGreaterThan(0);
    expect(report.totalAnnualSavings).toBe(report.totalMonthlySavings * 12);
    expect(report.recommendations.length).toBeGreaterThan(0);
  });
});
