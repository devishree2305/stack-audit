import type { ToolRecommendation } from "@/types/audit";

export function PricingComparisonTable({
  recommendations,
}: {
  recommendations: ToolRecommendation[];
}) {
  return (
    <div className="surface overflow-hidden rounded-[1.75rem]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Tool</th>
              <th className="px-6 py-4 font-medium">Current</th>
              <th className="px-6 py-4 font-medium">Suggested</th>
              <th className="px-6 py-4 font-medium">Savings / mo</th>
              <th className="px-6 py-4 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((recommendation) => (
              <tr key={recommendation.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-6 py-4 text-white">{recommendation.toolName}</td>
                <td className="px-6 py-4 text-slate-300">{recommendation.currentPlan}</td>
                <td className="px-6 py-4 text-slate-300">{recommendation.suggestedPlan}</td>
                <td className="px-6 py-4 font-medium text-emerald-300">
                  ${recommendation.monthlySavings.toFixed(0)}
                </td>
                <td className="px-6 py-4 text-slate-300">{recommendation.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
