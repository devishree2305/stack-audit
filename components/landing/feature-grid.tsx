import { BarChart3, Blocks, Shield, Zap } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";

const features = [
  {
    icon: BarChart3,
    title: "Granular spend visibility",
    description:
      "See exactly which tools, plans, and teams are driving monthly AI spend.",
  },
  {
    icon: Zap,
    title: "Fast recommendation engine",
    description:
      "Translate messy subscriptions into concrete savings opportunities in minutes.",
  },
  {
    icon: Blocks,
    title: "Built for mixed stacks",
    description:
      "Handle assistants, coding copilots, and API usage in one audit flow.",
  },
  {
    icon: Shield,
    title: "Founder-friendly clarity",
    description:
      "Reports are concise, honest, and ready to share with finance, ops, or leadership.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((feature, index) => (
        <Reveal key={feature.title} delay={index * 0.08}>
          <div className="surface rounded-[1.75rem] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <feature.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {feature.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
