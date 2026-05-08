import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CTASection() {
  return (
    <Reveal>
      <div className="surface relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/12 via-sky-400/10 to-violet-500/12" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
              Find the hidden spend
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Most startup AI stacks drift before finance notices.
            </h2>
            <p className="max-w-xl text-base text-slate-300">
              Run a free audit in minutes, surface the waste, and keep the tools
              your team actually relies on.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-6 text-slate-950 hover:bg-white/90"
            >
              <Link href="/audit">
                Start Free Audit
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
            >
              <Link href="/report/sample-audit">View Sample Audit</Link>
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
