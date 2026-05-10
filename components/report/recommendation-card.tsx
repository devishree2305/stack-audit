import { Badge } from "@/components/ui/badge";
import type { ToolRecommendation } from "@/types/audit";

const actionLabels: Record<ToolRecommendation["actionType"], string> = {
  downgrade: "Downgrade",
  reduce_seats: "Reduce seats",
  switch_vendor: "Switch vendor",
  maintain: "Maintain",
  usage_credit_opportunity: "Credit opportunity",
};

const actionToneClasses: Record<ToolRecommendation["actionType"], string> = {
  downgrade: "border-emerald-400/20 bg-emerald-400/10",
  reduce_seats: "border-sky-400/20 bg-sky-400/10",
  switch_vendor: "border-violet-400/20 bg-violet-400/10",
  maintain: "border-white/10 bg-white/[0.03]",
  usage_credit_opportunity: "border-amber-400/20 bg-amber-400/10",
};

const actionBadgeClasses: Record<ToolRecommendation["actionType"], string> = {
  downgrade: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  reduce_seats: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  switch_vendor: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  maintain: "border-white/10 bg-black/20 text-slate-200",
  usage_credit_opportunity: "border-amber-400/20 bg-amber-400/10 text-amber-200",
};

export function RecommendationCard({
  recommendation,
}: {
  recommendation: ToolRecommendation;
}) {
  const tone =
    actionToneClasses[recommendation.actionType];

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
              className={actionBadgeClasses[recommendation.actionType]}
            >
              {actionLabels[recommendation.actionType]}
            </Badge>
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
            Recommended plan
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {recommendation.recommendedPlan}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {recommendation.currentSeats === recommendation.recommendedSeats
              ? `${recommendation.recommendedSeats} seat(s)`
              : `${recommendation.currentSeats} → ${recommendation.recommendedSeats} seats`}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current cost
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            ${recommendation.currentSpend.toFixed(0)}/mo
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Optimized cost
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            ${recommendation.optimizedSpend.toFixed(0)}/mo
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Save ${recommendation.monthlySavings.toFixed(0)}/mo
          </p>
        </div>
      </div>
    </div>
  );
}
