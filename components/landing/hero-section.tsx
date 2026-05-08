"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";

const statCards = [
  { label: "Median savings found", value: 420, prefix: "$", suffix: "/mo" },
  { label: "Audit completion time", value: 7, suffix: " min" },
  { label: "Seat overlap flagged", value: 31, suffix: "%" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            AI spend optimization for lean teams
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="space-y-5"
          >
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Cut AI subscription waste before it becomes default operating cost.
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-8 text-slate-300 sm:text-xl">
              Stack Audit analyzes the tools your startup already pays for,
              spots overlap, recommends cheaper plans, and turns scattered AI
              spend into a clean savings playbook.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
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
              <Link href="/report/sample-audit">
                View Sample Audit
                <ChevronRight />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="surface rounded-3xl p-4 transition hover:border-white/20 hover:bg-white/8"
              >
                <div className="text-2xl font-semibold tracking-tight text-white">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="surface relative overflow-hidden rounded-[2rem] p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-transparent to-violet-500/10" />
          <div className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium text-white">
                  April AI spend audit
                </p>
                <p className="text-xs text-slate-400">
                  12 tools across engineering and ops
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                +$6,360 annual savings
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Current
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">$1,274</p>
                  <p className="text-xs text-slate-400">monthly AI spend</p>
                </div>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">
                    Optimized
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">$744</p>
                  <p className="text-xs text-emerald-200/70">recommended spend</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Savings
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">$530</p>
                  <p className="text-xs text-slate-400">per month unlocked</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Recommendation highlights
                    </p>
                    <p className="text-xs text-slate-400">
                      Where the largest deltas come from
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">Confidence: High</div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Cursor Business", "Rightsize 8 seats to 5 active seats", "$120/mo"],
                    ["OpenAI API", "Route evaluation traffic to lighter models", "$210/mo"],
                    ["Copilot Business", "Keep 3 paid seats, remove dormant seats", "$57/mo"],
                  ].map(([tool, recommendation, amount]) => (
                    <div
                      key={tool}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{tool}</p>
                        <p className="text-xs text-slate-400">{recommendation}</p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-300">{amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
