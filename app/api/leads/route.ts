import { NextResponse } from "next/server";

import { createErrorResponse, submitLeadCapture } from "@/lib/audit-workflow";
import { sendAuditConfirmationEmail } from "@/lib/resend";
import { createSupabaseAuditRepository } from "@/lib/supabase/audit-repository";

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
      sendConfirmationEmail: sendAuditConfirmationEmail,
    });

    if (!response.emailSent && response.emailError) {
      console.error("Lead confirmation email failed:", response.emailError);
    }

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't save your details right now.";
    const status = /valid work email|find that audit/i.test(message) ? 400 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  return handleLeadPost(request);
}
