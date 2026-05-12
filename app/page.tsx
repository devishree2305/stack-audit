import dynamic from "next/dynamic";

import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { GradientBackground } from "@/components/gradient-background";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { LiveSavingsSection } from "@/components/landing/live-savings";
import { MockAuditPreview } from "@/components/landing/mock-audit-preview";
import { PainPointsSection } from "@/components/landing/pain-points";
import { WhyStackAuditSection } from "@/components/landing/why-stack-audit";
import { Navbar } from "@/components/navbar";
import { SectionContainer } from "@/components/section-container";

const FAQAccordion = dynamic(
  () => import("@/components/faq-accordion").then((mod) => mod.FAQAccordion),
  {
    loading: () => (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="surface h-[92px] rounded-3xl"
            aria-hidden="true"
          />
        ))}
      </div>
    ),
  },
);

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      <Navbar />

      <div className="relative z-10">
        <SectionContainer>
          <HeroSection />
        </SectionContainer>

        <SectionContainer className="mt-24 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              AI spend pain points
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The stack gets expensive long before it looks expensive.
            </h2>
          </div>
          <PainPointsSection />
        </SectionContainer>

        <SectionContainer id="how-it-works" className="mt-24 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              How it works
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Fast enough for startup teams, clear enough for finance.
            </h2>
          </div>
          <HowItWorksSection />
        </SectionContainer>

        <SectionContainer className="mt-24 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Live savings examples
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What a realistic audit can uncover.
            </h2>
          </div>
          <LiveSavingsSection />
        </SectionContainer>

        <SectionContainer className="mt-24 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Product preview
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built to feel like a real operating system for AI spend.
            </h2>
          </div>
          <MockAuditPreview />
        </SectionContainer>

        <SectionContainer id="features" className="mt-24 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Feature grid
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Premium clarity without enterprise bloat.
            </h2>
          </div>
          <FeatureGrid />
        </SectionContainer>

        <SectionContainer className="mt-24">
          <WhyStackAuditSection />
        </SectionContainer>

        <SectionContainer className="mt-24">
          <CTASection />
        </SectionContainer>

        <SectionContainer id="faq" className="mt-24 space-y-8 pb-24">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Straight answers before you run the audit.
            </h2>
          </div>
          <FAQAccordion />
        </SectionContainer>
      </div>

      <Footer />
    </main>
  );
}
