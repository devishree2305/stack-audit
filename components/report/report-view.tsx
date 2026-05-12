"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Rocket,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AnimatedCounter } from "@/components/animated-counter";
import { CTASection } from "@/components/cta-section";
import { LeadCaptureForm } from "@/components/report/lead-capture-form";
import { PricingComparisonTable } from "@/components/report/pricing-comparison-table";
import { RecommendationCard } from "@/components/report/recommendation-card";
import { SavingsCard } from "@/components/report/savings-card";
import { Button } from "@/components/ui/button";
import type { PublicAuditReport } from "@/types/audit";

export function ReportView({
  report,
  reportUrl,
}: {
  report: PublicAuditReport;
  reportUrl: string;
}) {
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle");
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const recommendationsByValue = useMemo(
    () =>
      [...report.recommendations].sort(
        (left, right) => right.monthlySavings - left.monthlySavings,
      ),
    [report.recommendations],
  );

  const actionableRecommendations = recommendationsByValue.filter(
    (recommendation) => recommendation.actionType !== "maintain",
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setShareState("copied");
      setShareMessage("Public report link copied.");
      window.setTimeout(() => {
        setShareState("idle");
        setShareMessage(null);
      }, 2200);
    } catch {
      setShareState("idle");
      setShareMessage("We couldn't copy the link automatically. You can still share the URL from your browser.");
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: report.shareTitle,
        text: report.shareDescription,
        url: reportUrl,
      });
      setShareState("shared");
      setShareMessage("Public report shared.");
      window.setTimeout(() => {
        setShareState("idle");
        setShareMessage(null);
      }, 2200);
    } catch {
      setShareState("idle");
    }
  };

  return (
    <div className="space-y-10">
      <section className="surface relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-sky-400/8" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_38%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                Public report
              </div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                {report.teamSizeLabel}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {report.shareTitle}
              </h1>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                {report.optimizationStatus}
              </p>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                    Public summary
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                    Privacy-safe by design
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                  {report.summary}
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    Share your AI savings audit
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    This public version excludes emails, company names, roles, and internal lead metadata.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={handleNativeShare}
                    className="min-w-[170px] justify-center rounded-full bg-white text-slate-950 hover:bg-white/90"
                  >
                    {shareState === "shared" ? <CheckCircle2 /> : <Send />}
                    Share report
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCopy}
                    variant="outline"
                    className="min-w-[170px] justify-center rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    {shareState === "copied" ? <CheckCircle2 /> : <Copy />}
                    {shareState === "copied" ? "Copied link" : "Copy public link"}
                  </Button>
                </div>
              </div>
              {shareMessage ? (
                <p className="mt-4 text-sm text-emerald-200">{shareMessage}</p>
              ) : null}
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
              <p className="mt-3 text-sm text-emerald-100/80">
                ${report.currentMonthlySpend.toFixed(0)} current {"->"} $
                {report.optimizedMonthlySpend.toFixed(0)} optimized
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Total annual savings
                </p>
                <div className="mt-4 text-5xl font-semibold tracking-tight text-white">
                  <AnimatedCounter prefix="$" value={report.totalAnnualSavings} />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Public preview snapshot
                </p>
                <p className="mt-4 text-xl font-semibold text-white">
                  {report.toolCount} tools across a {report.primaryUseCase} workflow
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {report.strongestRecommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {report.consultationRecommended ? (
        <section className="surface rounded-[1.75rem] border-emerald-400/20 bg-emerald-400/10 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200">
                <Rocket className="h-4 w-4" />
                High-savings signal
              </div>
              <h2 className="text-2xl font-semibold text-white">
                This public report shows enough savings to justify a deeper procurement sprint.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-emerald-100/80">
                Beyond plan changes, this level of spend often creates room for credits, negotiated pricing, and tighter AI routing policy.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full bg-white text-slate-950 hover:bg-white/90"
            >
              <Link href="/audit">
                Run your own audit
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      ) : null}

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
                      <div
                        style={{ width: `${(point.current / maxValue) * 100}%` }}
                        className="h-2 rounded-full bg-slate-500"
                      />
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        style={{ width: `${(point.optimized / maxValue) * 100}%` }}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recommendations</h2>
            <p className="mt-2 text-sm text-slate-400">
              Public-safe optimization notes with no lead data attached.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {actionableRecommendations.length > 0
              ? `${actionableRecommendations.length} actionable recommendations`
              : "No major optimization changes recommended"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {recommendationsByValue.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      </section>

      <PricingComparisonTable recommendations={report.recommendations} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <LeadCaptureForm
          reportToken={report.token}
          reportUrl={reportUrl}
          teamSizeLabel={report.teamSizeLabel}
          totalMonthlySavings={report.totalMonthlySavings}
        />

        <div className="surface rounded-[1.75rem] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Share loop
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Make the savings story easy to forward, screenshot, and discuss.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This public view is designed for founders, finance owners, operators, and teammates who need a clean AI spend snapshot without access to any private lead details.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleNativeShare}
              className="rounded-full bg-white text-slate-950 hover:bg-white/90"
            >
              <Share2 />
              Share public report
            </Button>
            <Button
              type="button"
              onClick={handleCopy}
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <Copy />
              Copy URL
            </Button>
          </div>
          <Button
            asChild
            className="mt-6 rounded-full bg-white text-slate-950 hover:bg-white/90"
          >
            <Link href="/audit">
              {report.totalMonthlySavings < 100 ? (
                <>
                  Review another stack
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  Run your own audit
                  <ArrowRight />
                </>
              )}
            </Link>
          </Button>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
