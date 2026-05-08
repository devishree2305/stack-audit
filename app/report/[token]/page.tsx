import { Suspense } from "react";

import { Footer } from "@/components/footer";
import { GradientBackground } from "@/components/gradient-background";
import { Navbar } from "@/components/navbar";
import { ReportView } from "@/components/report/report-view";
import { SectionContainer } from "@/components/section-container";
import { createSampleAuditReport } from "@/lib/audit-engine";

async function ReportPageContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const initialReport = token === "sample-audit" ? createSampleAuditReport() : undefined;

  return <ReportView token={token} initialReport={initialReport} />;
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
