import type { AuditReport } from "@/types/audit";

export interface ApiErrorResponse {
  error: string;
}

export interface PersistedAuditResponse {
  success: true;
  auditId: string;
  shareToken: string;
  shareUrl: string;
  report: AuditReport;
}

export interface LeadSubmissionResponse {
  success: true;
  status: "created" | "duplicate" | "filtered";
  emailSent: boolean;
  emailDeliveryMessage?: string;
  reportUrl?: string;
  message: string;
}
