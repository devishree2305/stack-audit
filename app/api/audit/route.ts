import { NextResponse } from "next/server";

import {
  buildShareUrl,
  createErrorResponse,
  createPersistedAuditResponse,
  isAuditFormValues,
  persistAuditReport,
} from "@/lib/audit-workflow";
import { createSupabaseAuditRepository } from "@/lib/supabase/audit-repository";

export async function handleAuditPost(
  request: Request,
  repository = createSupabaseAuditRepository(),
) {
  try {
    const body = (await request.json()) as unknown;

    if (!isAuditFormValues(body)) {
      const errorResponse = createErrorResponse(
        "Please provide a complete audit payload before generating a report.",
        400,
      );
      return NextResponse.json(errorResponse.body, { status: errorResponse.status });
    }

    const result = await persistAuditReport(body, {
      repository,
    });
    const shareUrl = buildShareUrl(new URL(request.url).origin, result.shareToken);

    return NextResponse.json(
      createPersistedAuditResponse({
        auditId: result.auditId,
        shareToken: result.shareToken,
        shareUrl,
        report: result.report,
      }),
    );
  } catch (error) {
    console.error("Audit generation failed:", error);
    const errorResponse = createErrorResponse(
      error instanceof Error ? error.message : "Unable to save the audit right now.",
      500,
    );
    return NextResponse.json(errorResponse.body, { status: errorResponse.status });
  }
}

export async function POST(request: Request) {
  return handleAuditPost(request);
}
