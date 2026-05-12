import { createSampleAuditReport } from "@/lib/audit-engine";
import { createPublicAuditReport } from "@/lib/share";

describe("public shareable report shaping", () => {
  it("builds a public-safe DTO with share metadata", () => {
    const report = createSampleAuditReport();
    const publicReport = createPublicAuditReport(report);

    expect(publicReport.shareTitle).toContain("Stack Audit");
    expect(publicReport.shareDescription).toContain("AI procurement audit");
    expect(publicReport.toolCount).toBeGreaterThan(0);
    expect(publicReport.teamSizeLabel.length).toBeGreaterThan(0);
    expect("teamSize" in publicReport).toBe(false);
    expect("auditId" in publicReport).toBe(false);
    expect("email" in publicReport).toBe(false);
    expect("companyName" in publicReport).toBe(false);
    expect("role" in publicReport).toBe(false);
  });

  it("keeps social preview copy clean for already-optimized reports", () => {
    const publicReport = createPublicAuditReport(
      createSampleAuditReport(),
    );

    expect(publicReport.shareDescription).not.toMatch(/email|company|lead/i);
    expect(publicReport.strongestRecommendation.length).toBeGreaterThan(0);
  });
});
