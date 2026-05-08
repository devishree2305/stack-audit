import Link from "next/link";

import { SectionContainer } from "@/components/section-container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-14">
      <SectionContainer className="flex flex-col gap-10 text-sm text-slate-400 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="text-base font-semibold text-white">Stack Audit</div>
          <p className="max-w-md">
            AI spend optimization for teams moving fast enough to oversubscribe
            by accident.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <Link href="/audit" className="transition hover:text-white">
            Start Audit
          </Link>
          <Link href="/report/sample-audit" className="transition hover:text-white">
            Sample Report
          </Link>
          <Link href="/#faq" className="transition hover:text-white">
            FAQ
          </Link>
        </div>
      </SectionContainer>
    </footer>
  );
}
