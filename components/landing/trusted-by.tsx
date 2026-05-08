import { trustedLogos } from "@/lib/pricing-data";

export function TrustedBySection() {
  return (
    <div className="space-y-6">
      <p className="text-center text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
        Trusted by teams shipping with AI every day
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {trustedLogos.map((logo) => (
          <div
            key={logo}
            className="surface flex h-20 items-center justify-center rounded-3xl text-sm font-medium tracking-wide text-slate-300"
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}
