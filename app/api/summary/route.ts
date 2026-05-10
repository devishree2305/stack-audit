import { NextResponse } from "next/server";

import { generateAuditSummary } from "@/lib/anthropic";
import type { AuditSummaryInput } from "@/types/audit";

export async function POST(request: Request) {
  const body = (await request.json()) as AuditSummaryInput;
  const result = await generateAuditSummary(body);

  return NextResponse.json(result);
}
