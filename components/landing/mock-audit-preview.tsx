import { Reveal } from "@/components/ui/reveal";

export function MockAuditPreview() {
  return (
    <Reveal>
      <div className="surface rounded-[2rem] p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Shareable audit report
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Designed to be forwarded to founders, finance, and ops without
                  extra explanation.
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                screenshot-worthy
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                "Massive savings hero with counters",
                "Per-tool downgrade recommendations",
                "ROI style metrics and spend chart",
                "Consultation CTA for large savings",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5">
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Top savings driver
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  API model routing
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Route lower-priority traffic to cheaper models and reduce
                  oversized context windows.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Consultation trigger
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  Monthly savings over $500
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Surface a premium CTA when the report identifies enough savings
                  to justify a deeper implementation review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
