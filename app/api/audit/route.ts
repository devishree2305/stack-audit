import { NextResponse } from "next/server";

import { createAuditReport } from "@/lib/audit-engine";
import type { AuditFormValues } from "@/types/audit";

export async function POST(request: Request) {
  const values = (await request.json()) as AuditFormValues;
  const report = createAuditReport(values);

  return NextResponse.json(report);
}
