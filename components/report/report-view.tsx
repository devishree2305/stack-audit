"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Mail, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AnimatedCounter } from "@/components/animated-counter";
import { CTASection } from "@/components/cta-section";
import { PricingComparisonTable } from "@/components/report/pricing-comparison-table";
import { RecommendationCard } from "@/components/report/recommendation-card";
import { SavingsCard } from "@/components/report/savings-card";
import { Button } from "@/components/ui/button";
import { createSampleAuditReport } from "@/lib/audit-engine";
import type { AuditReport } from "@/types/audit";

export function ReportView({
  token,
  initialReport,
}: {
  token: string;
  initialReport?: AuditReport;
}) {
  const [report, setReport] = useState<AuditReport>(
    initialReport ?? createSampleAuditReport(),
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(`stack-audit:report:${token}`);
    if (!stored) {
      setReport(initialReport ?? createSampleAuditReport());
      return;
    }

    try {
      setReport(JSON.parse(stored) as AuditReport);
    } catch {
      setReport(initialReport ?? createSampleAuditReport());
    }
  }, [initialReport, token]);

  return (
    <div className="space-y-10">
      <section className="surface overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div className="absolute inset-0" />
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
              Audit token: {report.token}
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {report.totalMonthlySavings > 0
                  ? "Your AI stack has room to get leaner."
                  : "Your AI stack already looks well-optimized."}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                {report.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <Share2 />
                Share audit
              </Button>
              <Button
                asChild
                className="rounded-full bg-white text-slate-950 hover:bg-white/90"
              >
                <Link href="/audit">
                  Run another audit
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
                Total monthly savings
              </p>
              <div className="mt-4 text-5xl font-semibold tracking-tight text-white">
                <AnimatedCounter prefix="$" value={report.totalMonthlySavings} />
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Total annual savings
              </p>
              <div className="mt-4 text-5xl font-semibold tracking-tight text-white">
                <AnimatedCounter prefix="$" value={report.totalAnnualSavings} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SavingsCard label="Current monthly spend" value={report.currentMonthlySpend} />
        <SavingsCard
          label="Optimized monthly spend"
          value={report.optimizedMonthlySpend}
          tone="positive"
        />
        <SavingsCard
          label="Optimization score"
          value={report.optimizationScore}
          suffix="/100"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Savings chart</h2>
          </div>
          <div className="mt-6 space-y-4">
            {report.chart.map((point) => {
              const maxValue = Math.max(point.current, point.optimized, 1);
              return (
                <div key={point.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{point.label}</span>
                    <span className="text-slate-500">
                      ${point.optimized.toFixed(0)} / ${point.current.toFixed(0)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(point.current / maxValue) * 100}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-2 rounded-full bg-slate-500"
                      />
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(point.optimized / maxValue) * 100}%` }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
                        className="h-2 rounded-full bg-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="surface rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold text-white">ROI metrics</h2>
          <div className="mt-6 grid gap-4">
            {report.roiMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {metric.label}
                </p>
                <p
                  className={`mt-2 text-2xl font-semibold ${
                    metric.tone === "positive" ? "text-emerald-300" : "text-white"
                  }`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface rounded-[1.75rem] p-6">
        <h2 className="text-xl font-semibold text-white">Recommendations</h2>
        <div className="mt-6 space-y-4">
          {report.recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      </section>

      <PricingComparisonTable recommendations={report.recommendations} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Email this audit</h2>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
            Capture a lead or send the report to a founder, finance owner, or
            ops lead for follow-up.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              placeholder="team@company.com"
              className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-emerald-400/50"
            />
            <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-white/90">
              Send report
            </Button>
          </div>
        </div>

        <div className="surface rounded-[1.75rem] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Credex consultation
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            {report.consultationRecommended
              ? "This stack is worth a deeper savings sprint."
              : "No hard sell. Your spend is already pretty disciplined."}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {report.consultationRecommended
              ? "Savings above $500/month usually justify a hands-on review of tool policy, procurement, and API routing. Book a Credex consultation to turn recommendations into implementation."
              : "If you still want a second set of eyes, we can review governance and future-proofing, but the current stack does not show major obvious waste."}
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-white text-slate-950 hover:bg-white/90"
          >
            <Link href="/audit">
              Book Credex consultation
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
