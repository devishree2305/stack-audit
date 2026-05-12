import { NextResponse } from "next/server";

import {
  createErrorResponse,
  submitLeadCapture,
  type SubmitLeadDependencies,
} from "@/lib/audit-workflow";
import { sendAuditConfirmationEmail } from "@/lib/resend";
import { createSupabaseAuditRepository } from "@/lib/supabase/audit-repository";
import type { LeadSubmissionResponse } from "@/types/api";

function isLeadPayload(
  body: unknown,
): body is {
  email: string;
  auditId?: string;
  shareToken?: string;
  companyName?: string;
  role?: string;
  website?: string;
  reportUrl?: string;
} {
  if (!body || typeof body !== "object") {
    return false;
  }

  const value = body as Record<string, unknown>;
  return (
    typeof value.email === "string" &&
    (typeof value.auditId === "string" || typeof value.shareToken === "string")
  );
}

export async function handleLeadPost(
  request: Request,
  repository = createSupabaseAuditRepository(),
  sendConfirmationEmail: SubmitLeadDependencies["sendConfirmationEmail"] = sendAuditConfirmationEmail,
) {
  const body = (await request.json()) as unknown;

  if (!isLeadPayload(body)) {
    const errorResponse = createErrorResponse(
      "Email and a public report token are required.",
      400,
    );
    return NextResponse.json(errorResponse.body, { status: errorResponse.status });
  }

  try {
    const response = await submitLeadCapture(body, new URL(request.url).origin, {
      repository,
      sendConfirmationEmail,
    });

    if (!response.emailSent && response.internalEmailError) {
      console.error("Lead confirmation email failed:", response.internalEmailError);
    }

    const clientResponse: LeadSubmissionResponse = {
      success: response.success,
      status: response.status,
      emailSent: response.emailSent,
      emailDeliveryMessage: response.emailDeliveryMessage,
      reportUrl: response.reportUrl,
      message: response.message,
    };

    return NextResponse.json(clientResponse satisfies LeadSubmissionResponse);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't save your details right now.";
    const status = /valid work email|find that audit/i.test(message) ? 400 : 500;
    const clientMessage = status === 400
      ? message
      : "We couldn't save your details right now.";

    if (status === 500) {
      console.error("Lead capture failed:", error);
    }

    return NextResponse.json({ error: clientMessage }, { status });
  }
}

export async function POST(request: Request) {
  return handleLeadPost(request);
}
