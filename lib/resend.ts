interface AuditConfirmationEmailInput {
  to: string;
  companyName?: string | null;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  consultationRecommended: boolean;
  reportUrl?: string | null;
}

interface ResendSendResult {
  ok: boolean;
  error?: string;
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "Stack Audit <onboarding@resend.dev>";
}

function buildSubject(input: AuditConfirmationEmailInput) {
  return input.totalMonthlySavings > 0
    ? `Your Stack Audit report estimates $${input.totalMonthlySavings.toFixed(0)}/mo in savings`
    : "Your Stack Audit report is ready";
}

function buildTextBody(input: AuditConfirmationEmailInput) {
  const recipient = input.companyName?.trim() || "there";
  const linkLine = input.reportUrl ? `\nReport link: ${input.reportUrl}\n` : "\n";
  const followUpLine = input.consultationRecommended
    ? "Because your audit shows meaningful savings potential, the Credex team may follow up with ideas around procurement, credits, and implementation."
    : "If pricing changes or new optimization opportunities appear, Credex can help you reassess the stack without forcing unnecessary vendor changes.";

  return [
    `Hi ${recipient},`,
    "",
    "Thanks for using Stack Audit.",
    `Your report estimates $${input.totalMonthlySavings.toFixed(0)}/month and $${input.totalAnnualSavings.toFixed(0)}/year in potential savings.`,
    followUpLine,
    linkLine.trimEnd(),
    "",
    "Stack Audit by Credex",
  ].join("\n");
}

function buildHtmlBody(input: AuditConfirmationEmailInput) {
  const linkMarkup = input.reportUrl
    ? `<p style="margin: 24px 0;"><a href="${input.reportUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#f8fafc;color:#020617;text-decoration:none;font-weight:600;">Open your report</a></p>`
    : "";

  const followUpLine = input.consultationRecommended
    ? "Because your audit shows meaningful savings potential, the Credex team may follow up with ideas around procurement, credits, and implementation."
    : "If pricing changes or new optimization opportunities appear, Credex can help you reassess the stack without forcing unnecessary vendor changes.";

  return `
    <div style="font-family:Arial,sans-serif;background:#020617;color:#e2e8f0;padding:32px;">
      <div style="max-width:640px;margin:0 auto;background:linear-gradient(180deg,rgba(16,185,129,0.12),rgba(15,23,42,0.96));border:1px solid rgba(148,163,184,0.18);border-radius:24px;padding:32px;">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#86efac;">Stack Audit</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#f8fafc;">Thanks for running your audit.</h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#cbd5e1;">
          Your report estimates <strong>$${input.totalMonthlySavings.toFixed(0)}/month</strong> and <strong>$${input.totalAnnualSavings.toFixed(0)}/year</strong> in potential savings.
        </p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#cbd5e1;">
          ${followUpLine}
        </p>
        ${linkMarkup}
        <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#94a3b8;">Stack Audit by Credex</p>
      </div>
    </div>
  `;
}

export async function sendAuditConfirmationEmail(
  input: AuditConfirmationEmailInput,
): Promise<ResendSendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [input.to],
        subject: buildSubject(input),
        text: buildTextBody(input),
        html: buildHtmlBody(input),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        ok: false,
        error: errorText || "Resend request failed.",
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email error.",
    };
  }
}
