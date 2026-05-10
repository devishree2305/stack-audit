"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Mail,
  Rocket,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AnimatedCounter } from "@/components/animated-counter";
import { CTASection } from "@/components/cta-section";
import { PricingComparisonTable } from "@/components/report/pricing-comparison-table";
import { RecommendationCard } from "@/components/report/recommendation-card";
import { SavingsCard } from "@/components/report/savings-card";
import { Button } from "@/components/ui/button";
import { createSampleAuditReport } from "@/lib/audit-engine";
import type { AuditReport, AuditSummaryInput } from "@/types/audit";

type SummarySource = "ai" | "fallback";

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
  const [personalizedSummary, setPersonalizedSummary] = useState(report.summary);
  const [summarySource, setSummarySource] = useState<SummarySource>("fallback");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

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

  useEffect(() => {
    setPersonalizedSummary(report.summary);
    setSummarySource("fallback");
  }, [report.summary, report.token]);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      setIsSummaryLoading(true);

      const payload: AuditSummaryInput = {
        teamSize: report.teamSize,
        primaryUseCase: report.primaryUseCase,
        currentMonthlySpend: report.currentMonthlySpend,
        optimizedMonthlySpend: report.optimizedMonthlySpend,
        totalMonthlySavings: report.totalMonthlySavings,
        totalAnnualSavings: report.totalAnnualSavings,
        overallAssessment: report.overallAssessment,
        recommendations: report.recommendations,
      };

      try {
        const response = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("summary request failed");
        }

        const data = (await response.json()) as {
          summary?: string;
          source?: SummarySource;
        };

        if (cancelled) {
          return;
        }

        if (data.summary) {
          setPersonalizedSummary(data.summary);
          setSummarySource(data.source === "ai" ? "ai" : "fallback");
        }
      } catch {
        if (!cancelled) {
          setPersonalizedSummary(report.summary);
          setSummarySource("fallback");
        }
      } finally {
        if (!cancelled) {
          setIsSummaryLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [
    report.currentMonthlySpend,
    report.optimizedMonthlySpend,
    report.overallAssessment,
    report.primaryUseCase,
    report.recommendations,
    report.summary,
    report.teamSize,
    report.token,
    report.totalAnnualSavings,
    report.totalMonthlySavings,
  ]);

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

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("idle");
    }
  };

  return (
    <div className="space-y-10">
      <section className="surface relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-sky-400/8" />
        <div className="absolute inset-0" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
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
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
                {report.overallAssessment}
              </p>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                    Personalized audit summary
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                    {summarySource === "ai" ? "AI-personalized" : "Reliable fallback"}
                  </span>
                  {isSummaryLoading ? (
                    <span className="text-xs text-slate-500">Refreshing summary...</span>
                  ) : null}
                </div>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                  {personalizedSummary}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleShare}
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                {shareState === "copied" ? <Copy /> : <Share2 />}
                {shareState === "copied" ? "Copied link" : "Share audit"}
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
              <p className="mt-3 text-sm text-emerald-100/80">
                ${report.currentMonthlySpend.toFixed(0)} current {"->"} $
                {report.optimizedMonthlySpend.toFixed(0)} optimized
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Total annual savings
              </p>
              <div className="mt-4 text-5xl font-semibold tracking-tight text-white">
                <AnimatedCounter prefix="$" value={report.totalAnnualSavings} />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Honest estimate based on real plan-price differences only
              </p>
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
                Credex opportunity
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Savings above $500/month usually justify a procurement sprint.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-emerald-100/80">
                Beyond the deterministic plan changes shown here, this level of
                spend often unlocks meaningful extra savings through vendor
                negotiation, startup credits, committed-use pricing, and tighter
                API governance.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full bg-white text-slate-950 hover:bg-white/90"
            >
              <Link href="/audit">
                Book Credex consultation
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recommendations</h2>
            <p className="mt-2 text-sm text-slate-400">
              Real-plan actions first. No fake pricing, no forced savings.
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
        <div className="surface rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">
              {report.totalMonthlySavings < 100
                ? "Stay informed about future opportunities"
                : "Email this audit"}
            </h2>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
            {report.totalMonthlySavings < 100
              ? "Your stack already looks disciplined. Leave an email and we’ll notify you when pricing changes or new optimization opportunities become relevant."
              : "Capture a lead or send the report to a founder, finance owner, or ops lead for follow-up."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              placeholder={
                report.totalMonthlySavings < 100
                  ? "founder@company.com"
                  : "team@company.com"
              }
              className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-emerald-400/50"
            />
            <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-white/90">
              {report.totalMonthlySavings < 100 ? "Notify me" : "Send report"}
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
              : report.totalMonthlySavings < 100
                ? "This stack already reads as well-managed."
                : "There is real optimization opportunity without forcing a vendor overhaul."}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {report.consultationRecommended
              ? "Savings above $500/month usually justify a hands-on review of tool policy, procurement, and API routing. Book a Credex consultation to turn recommendations into implementation."
              : report.totalMonthlySavings < 100
                ? "No hard sell here. The current stack does not show meaningful avoidable waste based on public pricing and the workflow you described."
                : "The deterministic recommendations shown here should be actionable without assuming unrealistic workflow changes."}
          </p>
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
                  {report.consultationRecommended
                    ? "Book Credex consultation"
                    : "Run another audit"}
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
