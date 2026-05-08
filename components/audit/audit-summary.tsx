import { AnimatedCounter } from "@/components/animated-counter";
import { createAuditReport } from "@/lib/audit-engine";
import { getToolById } from "@/lib/pricing-data";
import type { AuditFormValues } from "@/types/audit";

export function AuditSummary({ values }: { values: AuditFormValues }) {
  const preview = createAuditReport(values, "preview");
  const topTool = [...preview.recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings,
  )[0];

  return (
    <aside className="surface rounded-[1.75rem] p-6 lg:sticky lg:top-24">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        Live savings preview
      </p>
      <div className="mt-4">
        <div className="text-4xl font-semibold tracking-tight text-white">
          <AnimatedCounter prefix="$" value={preview.totalMonthlySavings} />
          <span className="text-lg text-slate-400">/mo</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Estimated based on current stack inputs and usage intensity.
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current spend
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">
            ${preview.currentMonthlySpend.toFixed(0)}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">
            Optimized spend
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">
            ${preview.optimizedMonthlySpend.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
        <p className="text-sm font-medium text-white">Strongest opportunity</p>
        {topTool ? (
          <>
            <p className="mt-3 text-base font-semibold text-white">
              {topTool.toolName}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {topTool.reason}
            </p>
            <p className="mt-4 text-sm font-medium text-emerald-300">
              ${topTool.monthlySavings.toFixed(0)}/mo potential savings
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-400">
            Add at least one tool to generate a preview.
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-400">
        {values.tools.map((tool) => {
          const meta = getToolById(tool.toolId);
          return (
            <div
              key={tool.id}
              className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3"
            >
              <span>{meta?.shortName ?? tool.toolId}</span>
              <span className="font-medium text-white">
                ${tool.monthlySpend.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
