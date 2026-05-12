import { trustedLogos } from "@/lib/pricing-data";

export function TrustedBySection() {
  return (
    <section className="surface rounded-[2rem] px-5 py-8 sm:px-7 sm:py-10">
      <div className="space-y-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.32em] text-slate-500">
          Trusted by teams shipping with AI every day
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {trustedLogos.map((logo) => (
            <div
              key={logo}
              className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-slate-300 sm:h-16"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
