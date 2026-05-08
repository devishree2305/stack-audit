import { Reveal } from "@/components/ui/reveal";

export function WhyStackAuditSection() {
  return (
    <Reveal>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Why Stack Audit exists
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            AI tooling adoption moved faster than budgeting discipline.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-slate-300">
          <p>
            Startups adopt AI tools one team at a time. Engineers buy copilots.
            Founders pay for premium chat apps. Product teams spin up API usage.
            No one has a clean view until the stack becomes expensive.
          </p>
          <p>
            Stack Audit turns that fragmented spend into a clear operating
            decision: keep what compounds velocity, remove what overlaps, and
            justify what stays.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
