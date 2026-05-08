import { ArrowDownRight } from "lucide-react";

import { liveSavingsExamples } from "@/lib/pricing-data";
import { Reveal } from "@/components/ui/reveal";

export function LiveSavingsSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {liveSavingsExamples.map((example, index) => (
        <Reveal key={example.company} delay={index * 0.08}>
          <div className="surface rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                Realistic example
              </span>
              <ArrowDownRight className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">
              {example.company}
            </h3>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Before</span>
                <span className="font-medium text-white">{example.before}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">After</span>
                <span className="font-medium text-white">{example.after}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm">
                <span className="text-emerald-200">Savings unlocked</span>
                <span className="font-semibold text-emerald-300">
                  {example.savings}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
