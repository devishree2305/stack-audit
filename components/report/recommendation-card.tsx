import { Badge } from "@/components/ui/badge";
import type { ToolRecommendation } from "@/types/audit";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: ToolRecommendation;
}) {
  const tone =
    recommendation.monthlySavings > 0
      ? "border-emerald-400/20 bg-emerald-400/10"
      : "border-white/10 bg-white/[0.03]";

  return (
    <div className={`surface rounded-[1.75rem] p-6 ${tone}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">
              {recommendation.toolName}
            </h3>
            <Badge
              variant="outline"
              className="border-white/10 bg-black/20 text-slate-200"
            >
              {recommendation.confidence} confidence
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {recommendation.reason}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Monthly savings
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            ${recommendation.monthlySavings.toFixed(0)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current plan
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {recommendation.currentPlan}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Suggested plan
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {recommendation.suggestedPlan}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current cost
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            ${recommendation.currentMonthlySpend.toFixed(0)}/mo
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Optimized cost
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            ${recommendation.optimizedMonthlySpend.toFixed(0)}/mo
          </p>
        </div>
      </div>
    </div>
  );
}
