import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";

import { Footer } from "@/components/footer";
import { GradientBackground } from "@/components/gradient-background";
import { Navbar } from "@/components/navbar";
import { ReportView } from "@/components/report/report-view";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/section-container";
import { buildShareUrl } from "@/lib/audit-workflow";
import { loadPublicReportByToken, resolveAppOrigin } from "@/lib/share";

function createInvalidMetadata(origin: string, token: string): Metadata {
  const canonical = buildShareUrl(origin, token);

  return {
    title: "Public audit report unavailable | Stack Audit",
    description:
      "This shared Stack Audit report is unavailable. Run a fresh audit to generate a new public report link.",
    alternates: {
      canonical,
    },
    openGraph: {
      title: "Public audit report unavailable | Stack Audit",
      description:
        "This shared Stack Audit report is unavailable. Run a fresh audit to generate a new public report link.",
      type: "article",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: "Public audit report unavailable | Stack Audit",
      description:
        "This shared Stack Audit report is unavailable. Run a fresh audit to generate a new public report link.",
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const headerStore = await headers();
  const origin = resolveAppOrigin(headerStore);
  const report = await loadPublicReportByToken(token);

  if (!report) {
    return createInvalidMetadata(origin, token);
  }

  const canonical = buildShareUrl(origin, token);
  const ogImageUrl = `${origin}/report/${token}/opengraph-image`;

  return {
    title: `${report.shareTitle} | Stack Audit`,
    description: report.shareDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: report.shareTitle,
      description: report.shareDescription,
      url: canonical,
      type: "article",
      siteName: "Stack Audit",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: report.shareTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: report.shareTitle,
      description: report.shareDescription,
      images: [ogImageUrl],
    },
  };
}

async function ReportPageContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const headerStore = await headers();
  const origin = resolveAppOrigin(headerStore);
  const report = await loadPublicReportByToken(token);

  if (!report) {
    return (
      <div className="surface rounded-[1.75rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Report unavailable
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          This public audit link is invalid or has expired.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          The report may have been removed, the URL may be mistyped, or the audit
          was never saved correctly. Run a fresh Stack Audit to generate a new
          shareable report.
        </p>
        <Button
          asChild
          className="mt-6 rounded-full bg-white text-slate-950 hover:bg-white/90"
        >
          <Link href="/">Back to homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <ReportView
      report={report}
      reportUrl={buildShareUrl(origin, token)}
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
              Loading public audit report...
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
