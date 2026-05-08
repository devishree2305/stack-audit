import { NextResponse } from "next/server";

import { generateSummary } from "@/lib/anthropic";
import type { ToolRecommendation } from "@/types/audit";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    teamSize: number;
    primaryUseCase: string;
    currentMonthlySpend: number;
    optimizedMonthlySpend: number;
    totalMonthlySavings: number;
    recommendations: ToolRecommendation[];
  };

  return NextResponse.json({
    summary: generateSummary(body),
  });
}
