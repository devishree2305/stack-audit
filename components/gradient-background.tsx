import { cn } from "@/lib/utils";

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-emerald-400/12 blur-2xl sm:h-80 sm:w-80 sm:blur-3xl" />
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-2xl sm:h-96 sm:w-96 sm:blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-400/10 blur-2xl sm:h-72 sm:w-72 sm:blur-3xl" />
    </div>
  );
}
