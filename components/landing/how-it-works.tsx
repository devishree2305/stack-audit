import { FileSpreadsheet, LineChart, Sparkles } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    icon: FileSpreadsheet,
    title: "Map your current stack",
    description:
      "Add every AI subscription, plan, seat count, and monthly spend your team currently pays for.",
  },
  {
    icon: Sparkles,
    title: "Generate the audit",
    description:
      "Stack Audit compares usage patterns against lighter plans, seat rightsizing, and consolidation opportunities.",
  },
  {
    icon: LineChart,
    title: "Act on savings",
    description:
      "Get a shareable report with exact savings estimates, recommendations, and clear next actions for finance or ops.",
  },
];

export function HowItWorksSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {steps.map((step, index) => (
        <Reveal key={step.title} delay={index * 0.08}>
          <div className="surface relative h-full rounded-[1.75rem] p-6">
            <span className="text-sm font-medium text-slate-500">
              0{index + 1}
            </span>
            <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <step.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {step.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
