import { randomBytes } from "node:crypto";

import {
  createAuditReport,
  createAuditSummaryInput,
  createPresentationAuditReport,
} from "@/lib/audit-engine";
import { generateAuditSummary } from "@/lib/anthropic";
import type { ApiErrorResponse, LeadSubmissionResponse, PersistedAuditResponse } from "@/types/api";
import type { AuditFormValues, AuditReport, AuditToolInput, ToolRecommendation } from "@/types/audit";

interface AuditRecord {
  id: string;
  tools: AuditToolInput[];
  team_size: number;
  primary_use_case: AuditFormValues["primaryUseCase"];
  current_monthly_spend: number;
  optimized_monthly_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  recommendations: ToolRecommendation[];
  ai_summary: string;
  share_token: string;
  created_at: string;
}

interface LeadRecord {
  id: string;
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  created_at: string;
}

type InsertAuditInput = Omit<AuditRecord, "id" | "created_at">;

interface InsertLeadInput {
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
}

export interface AuditRepository {
  insertAudit(input: InsertAuditInput): Promise<AuditRecord>;
  getAuditByShareToken(shareToken: string): Promise<AuditRecord | null>;
  getAuditById(auditId: string): Promise<AuditRecord | null>;
  findLeadByAuditAndEmail(auditId: string, email: string): Promise<LeadRecord | null>;
  insertLead(input: InsertLeadInput): Promise<LeadRecord>;
}

export interface PersistAuditDependencies {
  repository: AuditRepository;
  generateToken?: () => Promise<string> | string;
}

export interface SubmitLeadDependencies {
  repository: AuditRepository;
  sendConfirmationEmail: (input: {
    to: string;
    companyName?: string | null;
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    consultationRecommended: boolean;
    reportUrl?: string | null;
  }) => Promise<{ ok: boolean; error?: string }>;
}

export interface LeadSubmissionInput {
  auditId?: string;
  shareToken?: string;
  email: string;
  companyName?: string;
  role?: string;
  website?: string;
  reportUrl?: string;
}

export const DEVELOPMENT_EMAIL_DELIVERY_MESSAGE =
  "Your audit was saved successfully. Email delivery is currently limited to verified test addresses while the project is in development mode.";

export interface LeadCaptureResult extends LeadSubmissionResponse {
  internalEmailError?: string;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function trimOptionalValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function generateShareToken() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(18);
  let token = "";

  for (let index = 0; index < 12; index += 1) {
    token += alphabet[bytes[index] % alphabet.length];
  }

  return token;
}

export function buildSharePath(shareToken: string) {
  return `/report/${shareToken}`;
}

export function buildShareUrl(origin: string, shareToken: string) {
  return new URL(buildSharePath(shareToken), origin).toString();
}

export function createErrorResponse(
  message: string,
  status: number,
) {
  return {
    body: {
      error: message,
    } satisfies ApiErrorResponse,
    status,
  };
}

export function isAuditFormValues(input: unknown): input is AuditFormValues {
  if (!input || typeof input !== "object") {
    return false;
  }

  const value = input as Partial<AuditFormValues>;
  return (
    typeof value.teamSize === "number" &&
    Number.isFinite(value.teamSize) &&
    value.teamSize > 0 &&
    typeof value.primaryUseCase === "string" &&
    Array.isArray(value.tools) &&
    value.tools.length > 0 &&
    value.tools.every(
      (tool) =>
        tool !== null &&
        typeof tool === "object" &&
        typeof tool.id === "string" &&
        typeof tool.toolId === "string" &&
        typeof tool.planId === "string" &&
        typeof tool.monthlySpend === "number" &&
        Number.isFinite(tool.monthlySpend) &&
        typeof tool.seats === "number" &&
        Number.isFinite(tool.seats) &&
        tool.seats > 0 &&
        typeof tool.usageType === "string",
    )
  );
}

export function createAuditReportFromRecord(record: AuditRecord): AuditReport {
  return createPresentationAuditReport({
    token: record.share_token,
    createdAt: record.created_at,
    teamSize: record.team_size,
    primaryUseCase: record.primary_use_case,
    tools: record.tools,
    currentMonthlySpend: record.current_monthly_spend,
    optimizedMonthlySpend: record.optimized_monthly_spend,
    totalMonthlySavings: record.total_monthly_savings,
    totalAnnualSavings: record.total_annual_savings,
    summary: record.ai_summary,
    recommendations: record.recommendations,
  });
}

export async function persistAuditReport(
  values: AuditFormValues,
  dependencies: PersistAuditDependencies,
) {
  const initialReport = createAuditReport(values);
  const summaryResult = await generateAuditSummary(createAuditSummaryInput(values, initialReport));
  console.log("[Audit Persistence] summary resolved", {
    source: summaryResult.source,
    summary: summaryResult.summary,
    totalMonthlySavings: initialReport.totalMonthlySavings,
    totalAnnualSavings: initialReport.totalAnnualSavings,
  });
  const shareTokenGenerator = dependencies.generateToken ?? generateShareToken;

  let shareToken = await shareTokenGenerator();
  let existing = await dependencies.repository.getAuditByShareToken(shareToken);
  let attempts = 0;

  while (existing && attempts < 5) {
    shareToken = await shareTokenGenerator();
    existing = await dependencies.repository.getAuditByShareToken(shareToken);
    attempts += 1;
  }

  if (existing) {
    throw new Error("Unable to generate a unique share token.");
  }

  const saved = await dependencies.repository.insertAudit({
    tools: values.tools,
    team_size: values.teamSize,
    primary_use_case: values.primaryUseCase,
    current_monthly_spend: initialReport.currentMonthlySpend,
    optimized_monthly_spend: initialReport.optimizedMonthlySpend,
    total_monthly_savings: initialReport.totalMonthlySavings,
    total_annual_savings: initialReport.totalAnnualSavings,
    recommendations: initialReport.recommendations,
    ai_summary: summaryResult.summary,
    share_token: shareToken,
  });

  const report = createAuditReportFromRecord(saved);

  console.log("[Audit Persistence] report saved", {
    auditId: saved.id,
    shareToken: saved.share_token,
    storedSummary: saved.ai_summary,
  });

  return {
    auditId: saved.id,
    shareToken: saved.share_token,
    report,
  };
}

export async function getAuditReportByToken(
  shareToken: string,
  repository: AuditRepository,
) {
  const audit = await repository.getAuditByShareToken(shareToken);
  return audit ? createAuditReportFromRecord(audit) : null;
}

export async function submitLeadCapture(
  input: LeadSubmissionInput,
  origin: string,
  dependencies: SubmitLeadDependencies,
): Promise<LeadCaptureResult> {
  if (input.website?.trim()) {
    const filteredResponse: LeadCaptureResult = {
      success: true,
      status: "filtered",
      emailSent: false,
      reportUrl: input.reportUrl,
      message: "Thanks. We have received your request.",
    };

    return filteredResponse;
  }

  const email = normalizeEmail(input.email);
  if (!email || !isValidEmail(email)) {
    throw new Error("Please enter a valid work email address.");
  }

  const audit =
    typeof input.auditId === "string"
      ? await dependencies.repository.getAuditById(input.auditId)
      : typeof input.shareToken === "string"
        ? await dependencies.repository.getAuditByShareToken(input.shareToken)
        : null;

  if (!audit) {
    throw new Error("We couldn't find that audit anymore. Please rerun the audit.");
  }

  const existingLead = await dependencies.repository.findLeadByAuditAndEmail(
    audit.id,
    email,
  );

  if (existingLead) {
    return {
      success: true,
      status: "duplicate",
      emailSent: false,
      reportUrl: input.reportUrl ?? buildShareUrl(origin, audit.share_token),
      message: "This email is already attached to the report.",
    } satisfies LeadCaptureResult;
  }

  await dependencies.repository.insertLead({
    audit_id: audit.id,
    email,
    company_name: trimOptionalValue(input.companyName),
    role: trimOptionalValue(input.role),
  });

  const report = createAuditReportFromRecord(audit);
  const reportUrl = input.reportUrl ?? buildShareUrl(origin, audit.share_token);
  const emailResult = await dependencies.sendConfirmationEmail({
    to: email,
    companyName: trimOptionalValue(input.companyName),
    totalMonthlySavings: report.totalMonthlySavings,
    totalAnnualSavings: report.totalAnnualSavings,
    consultationRecommended: report.consultationRecommended,
    reportUrl,
  });

  return {
    success: true,
    status: "created",
    emailSent: emailResult.ok,
    emailDeliveryMessage: emailResult.ok ? undefined : DEVELOPMENT_EMAIL_DELIVERY_MESSAGE,
    internalEmailError: emailResult.ok ? undefined : emailResult.error,
    reportUrl,
    message: emailResult.ok
      ? "Report saved. A confirmation email is on its way."
      : DEVELOPMENT_EMAIL_DELIVERY_MESSAGE,
  } satisfies LeadCaptureResult;
}

export function createPersistedAuditResponse(
  payload: {
    auditId: string;
    shareToken: string;
    shareUrl: string;
    report: AuditReport;
  },
) {
  return {
    success: true,
    auditId: payload.auditId,
    shareToken: payload.shareToken,
    shareUrl: payload.shareUrl,
    report: payload.report,
  } satisfies PersistedAuditResponse;
}
