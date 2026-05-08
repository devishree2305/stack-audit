import { AlertTriangle, DollarSign, Layers3 } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";

const painPoints = [
  {
    icon: Layers3,
    title: "Tool overlap creeps in fast",
    description:
      "Teams end up paying for ChatGPT, Claude, Cursor, Copilot, and Gemini at the same time without a clear owner or policy.",
  },
  {
    icon: DollarSign,
    title: "Seat growth hides in plain sight",
    description:
      "Paid seats accumulate after hiring bursts, pilot programs, or role changes long after usage patterns shift.",
  },
  {
    icon: AlertTriangle,
    title: "API costs drift without routing",
    description:
      "Usage-based AI bills often stay invisible until prompts, retries, and model choice make them materially expensive.",
  },
];

export function PainPointsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {painPoints.map((item, index) => (
        <Reveal key={item.title} delay={index * 0.08}>
          <div className="surface h-full rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:border-white/20">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {item.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
