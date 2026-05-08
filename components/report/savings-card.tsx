import { AnimatedCounter } from "@/components/animated-counter";

export function SavingsCard({
  label,
  value,
  prefix = "$",
  suffix = "",
  tone = "default",
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  tone?: "default" | "positive";
}) {
  return (
    <div
      className={`surface rounded-[1.75rem] p-6 ${
        tone === "positive" ? "border-emerald-400/20 bg-emerald-400/10" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="mt-4 text-4xl font-semibold tracking-tight text-white">
        <AnimatedCounter prefix={prefix} value={value} suffix={suffix} />
      </div>
    </div>
  );
}
