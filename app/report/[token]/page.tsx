import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";

import { Footer } from "@/components/footer";
import { GradientBackground } from "@/components/gradient-background";
import { Navbar } from "@/components/navbar";
import { ReportView } from "@/components/report/report-view";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/section-container";
import { buildShareUrl, createAuditReportFromRecord } from "@/lib/audit-workflow";
import {
  createHighSavingsMockAuditReport,
  createOptimizedMockAuditReport,
  createSampleAuditReport,
} from "@/lib/audit-engine";
import { createSupabaseAuditRepository } from "@/lib/supabase/audit-repository";

async function loadReportState(token: string, origin: string) {
  if (token === "sample-audit") {
    return {
      auditId: undefined,
      report: createSampleAuditReport(),
      reportUrl: buildShareUrl(origin, token),
    };
  }

  if (token === "high-savings-audit") {
    return {
      auditId: undefined,
      report: createHighSavingsMockAuditReport(),
      reportUrl: buildShareUrl(origin, token),
    };
  }

  if (token === "optimized-audit") {
    return {
      auditId: undefined,
      report: createOptimizedMockAuditReport(),
      reportUrl: buildShareUrl(origin, token),
    };
  }

  const repository = createSupabaseAuditRepository();
  const audit = await repository.getAuditByShareToken(token);
  if (!audit) {
    return null;
  }

  return {
    auditId: audit.id,
    report: createAuditReportFromRecord(audit),
    reportUrl: buildShareUrl(origin, token),
  };
}

async function ReportPageContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    (host ? `${protocol}://${host}` : "http://localhost:3000");
  const state = await loadReportState(token, origin);

  if (!state || !state.report) {
    return (
      <div className="surface rounded-[1.75rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Report unavailable
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          This share link is invalid or has expired.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          The audit may have been removed, the token may be mistyped, or the report
          was never saved successfully. Run a fresh audit to generate a new shareable
          link.
        </p>
        <Button
          asChild
          className="mt-6 rounded-full bg-white text-slate-950 hover:bg-white/90"
        >
          <Link href="/audit">Run a new audit</Link>
        </Button>
      </div>
    );
  }

  return (
    <ReportView
      token={token}
      initialReport={state.report}
      auditId={state.auditId}
      reportUrl={state.reportUrl}
    />
  );
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      <Navbar />
      <SectionContainer className="relative z-10 py-14 sm:py-20">
        <Suspense
          fallback={
            <div className="surface rounded-[1.75rem] p-8 text-sm text-slate-400">
              Loading audit report...
            </div>
          }
        >
          <ReportPageContent params={params} />
        </Suspense>
      </SectionContainer>
      <Footer />
    </main>
  );
}
