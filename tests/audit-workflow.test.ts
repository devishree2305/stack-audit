import { handleAuditPost } from "@/app/api/audit/route";
import {
  createAuditReportFromRecord,
  getAuditReportByToken,
  persistAuditReport,
  submitLeadCapture,
  type AuditRepository,
} from "@/lib/audit-workflow";
import type { AuditFormValues } from "@/types/audit";

const auditValues: AuditFormValues = {
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
  ],
};

class InMemoryAuditRepository implements AuditRepository {
  audits: Array<{
    id: string;
    tools: AuditFormValues["tools"];
    team_size: number;
    primary_use_case: AuditFormValues["primaryUseCase"];
    current_monthly_spend: number;
    optimized_monthly_spend: number;
    total_monthly_savings: number;
    total_annual_savings: number;
    recommendations: ReturnType<typeof createAuditReportFromRecord>["recommendations"];
    ai_summary: string;
    share_token: string;
    created_at: string;
  }> = [];

  leads: Array<{
    id: string;
    audit_id: string;
    email: string;
    company_name: string | null;
    role: string | null;
    created_at: string;
  }> = [];

  async insertAudit(input: Omit<(typeof this.audits)[number], "id" | "created_at">) {
    const row = {
      id: `audit-${this.audits.length + 1}`,
      created_at: new Date("2026-05-11T00:00:00.000Z").toISOString(),
      ...input,
    };
    this.audits.push(row);
    return row;
  }

  async getAuditByShareToken(shareToken: string) {
    return this.audits.find((audit) => audit.share_token === shareToken) ?? null;
  }

  async getAuditById(auditId: string) {
    return this.audits.find((audit) => audit.id === auditId) ?? null;
  }

  async findLeadByAuditAndEmail(auditId: string, email: string) {
    return (
      this.leads.find((lead) => lead.audit_id === auditId && lead.email === email) ?? null
    );
  }

  async insertLead(input: {
    audit_id: string;
    email: string;
    company_name: string | null;
    role: string | null;
  }) {
    const row = {
      id: `lead-${this.leads.length + 1}`,
      created_at: new Date("2026-05-11T00:00:00.000Z").toISOString(),
      ...input,
    };
    this.leads.push(row);
    return row;
  }
}

describe("audit persistence workflow", () => {
  it("saves an audit successfully and returns a share token", async () => {
    const repository = new InMemoryAuditRepository();

    const result = await persistAuditReport(auditValues, {
      repository,
      generateToken: () => "abc123xyz789",
    });

    expect(result.shareToken).toBe("abc123xyz789");
    expect(result.auditId).toBe("audit-1");
    expect(repository.audits).toHaveLength(1);
    expect(repository.audits[0].share_token).toBe("abc123xyz789");
  });

  it("returns null when a report token does not exist", async () => {
    const repository = new InMemoryAuditRepository();

    const result = await getAuditReportByToken("missing-token", repository);

    expect(result).toBeNull();
  });

  it("validates and persists through the audit API route", async () => {
    const repository = new InMemoryAuditRepository();
    const request = new Request("https://stackaudit.test/api/audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(auditValues),
    });

    const response = await handleAuditPost(request, repository);
    const data = (await response.json()) as {
      success: boolean;
      auditId: string;
      shareToken: string;
      shareUrl: string;
    };

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.auditId).toBe("audit-1");
    expect(data.shareUrl).toContain("/report/");
  });
});

describe("lead capture workflow", () => {
  it("saves a lead even if email delivery fails", async () => {
    const repository = new InMemoryAuditRepository();
    const audit = await persistAuditReport(auditValues, {
      repository,
      generateToken: () => "lead-test-token",
    });

    const result = await submitLeadCapture(
      {
        auditId: audit.auditId,
        email: "Founder@Example.com",
        companyName: "Example",
        role: "Founder",
      },
      "https://stackaudit.test",
      {
        repository,
        sendConfirmationEmail: async () => ({ ok: false }),
      },
    );

    expect(result.status).toBe("created");
    expect(result.emailSent).toBe(false);
    expect(repository.leads).toHaveLength(1);
    expect(repository.leads[0].email).toBe("founder@example.com");
  });

  it("prevents duplicate lead submissions for the same audit and email", async () => {
    const repository = new InMemoryAuditRepository();
    const audit = await persistAuditReport(auditValues, {
      repository,
      generateToken: () => "dup-token",
    });

    await submitLeadCapture(
      {
        auditId: audit.auditId,
        email: "team@example.com",
      },
      "https://stackaudit.test",
      {
        repository,
        sendConfirmationEmail: async () => ({ ok: true }),
      },
    );

    const result = await submitLeadCapture(
      {
        auditId: audit.auditId,
        email: "TEAM@example.com",
      },
      "https://stackaudit.test",
      {
        repository,
        sendConfirmationEmail: async () => ({ ok: true }),
      },
    );

    expect(result.status).toBe("duplicate");
    expect(repository.leads).toHaveLength(1);
  });

  it("filters honeypot submissions without creating a lead", async () => {
    const repository = new InMemoryAuditRepository();
    const audit = await persistAuditReport(auditValues, {
      repository,
      generateToken: () => "honeypot-token",
    });

    const result = await submitLeadCapture(
      {
        auditId: audit.auditId,
        email: "bot@example.com",
        website: "https://spam.example",
      },
      "https://stackaudit.test",
      {
        repository,
        sendConfirmationEmail: async () => ({ ok: true }),
      },
    );

    expect(result.status).toBe("filtered");
    expect(repository.leads).toHaveLength(0);
  });
});
