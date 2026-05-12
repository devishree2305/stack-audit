import { ImageResponse } from "next/og";

import { loadPublicReportByToken } from "@/lib/share";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const report = await loadPublicReportByToken(token);

  if (!report) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#020617",
            color: "#f8fafc",
            padding: 48,
            fontFamily: "Arial",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              border: "1px solid rgba(148,163,184,0.22)",
              borderRadius: 32,
              padding: 48,
              width: "100%",
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.14), rgba(15,23,42,0.96))",
            }}
          >
            <div style={{ color: "#86efac", fontSize: 20, letterSpacing: 3 }}>
              STACK AUDIT
            </div>
            <div style={{ fontSize: 54, fontWeight: 700 }}>
              Public report unavailable
            </div>
            <div style={{ fontSize: 24, color: "#cbd5e1" }}>
              Run a fresh audit to generate a new shareable report.
            </div>
          </div>
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#020617",
          color: "#f8fafc",
          padding: 42,
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: 34,
            padding: 42,
            border: "1px solid rgba(148,163,184,0.18)",
            background:
              "radial-gradient(circle at top left, rgba(16,185,129,0.18), rgba(15,23,42,0.98) 60%)",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 760 }}>
              <div style={{ color: "#86efac", fontSize: 20, letterSpacing: 3 }}>
                STACK AUDIT
              </div>
              <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.05 }}>
                {report.totalAnnualSavings > 0
                  ? `$${report.totalAnnualSavings.toFixed(0)}/year in AI savings`
                  : "Already-optimized AI stack"}
              </div>
              <div style={{ fontSize: 26, color: "#cbd5e1", lineHeight: 1.35 }}>
                {report.shareDescription}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minWidth: 240,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: 24,
                  borderRadius: 24,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(52,211,153,0.22)",
                }}
              >
                <div style={{ fontSize: 16, color: "#a7f3d0", letterSpacing: 2 }}>
                  TOOL COUNT
                </div>
                <div style={{ fontSize: 44, fontWeight: 700 }}>{report.toolCount}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: 24,
                  borderRadius: 24,
                  background: "rgba(15,23,42,0.72)",
                  border: "1px solid rgba(148,163,184,0.18)",
                }}
              >
                <div style={{ fontSize: 16, color: "#94a3b8", letterSpacing: 2 }}>
                  STATUS
                </div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{report.optimizationStatus}</div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {report.toolNames.slice(0, 4).map((tool) => (
                <div
                  key={tool}
                  style={{
                    display: "flex",
                    padding: "12px 18px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    color: "#e2e8f0",
                    fontSize: 22,
                  }}
                >
                  {tool}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 20, color: "#94a3b8" }}>
              Share your AI savings audit
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
