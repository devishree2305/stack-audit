import { AuditForm } from "@/components/audit/audit-form";
import { Footer } from "@/components/footer";
import { GradientBackground } from "@/components/gradient-background";
import { Navbar } from "@/components/navbar";
import { SectionContainer } from "@/components/section-container";

export default function AuditPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      <Navbar />
      <SectionContainer className="relative z-10 py-14 sm:py-20">
        <AuditForm />
      </SectionContainer>
      <Footer />
    </main>
  );
}
