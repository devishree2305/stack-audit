import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/section-container";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <SectionContainer className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-semibold text-emerald-300">
            SA
          </span>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Stack Audit
            </div>
            <div className="text-xs text-slate-400">AI spend optimization</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link href="/#how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="/#features" className="transition hover:text-white">
            Features
          </Link>
          <Link href="/#faq" className="transition hover:text-white">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 lg:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            Private audit draft storage
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-white text-slate-950 hover:bg-white/90"
          >
            <Link href="/audit">
              Start Free Audit
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </header>
  );
}
