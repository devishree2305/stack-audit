import type { ToolRecommendation } from "@/types/audit";

export function generateSummary({
  teamSize,
  primaryUseCase,
  currentMonthlySpend,
  optimizedMonthlySpend,
  totalMonthlySavings,
  recommendations,
}: {
  teamSize: number;
  primaryUseCase: string;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  totalMonthlySavings: number;
  recommendations: ToolRecommendation[];
}) {
  if (totalMonthlySavings <= 0) {
    return `This ${teamSize}-person ${primaryUseCase} team already looks tightly managed. Spend is concentrated in tools that match usage, so the main recommendation is to keep monitoring seat creep and API routing rather than forcing unnecessary plan changes.`;
  }

  const topRecommendation = [...recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings,
  )[0];

  return `Stack Audit found a path from $${currentMonthlySpend.toFixed(
    0,
  )}/mo to $${optimizedMonthlySpend.toFixed(
    0,
  )}/mo without reducing practical output. The biggest opportunity is ${topRecommendation.toolName}, where ${topRecommendation.reason.toLowerCase()} Overall, this ${teamSize}-person ${primaryUseCase} team is carrying overlapping AI spend that can be consolidated while keeping the highest-value workflows fast.`;
}
