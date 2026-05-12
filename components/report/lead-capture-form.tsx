"use client";

import { LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiErrorResponse, LeadSubmissionResponse } from "@/types/api";

type SubmissionState = "idle" | "submitting" | "success" | "duplicate";

export function LeadCaptureForm({
  reportToken,
  reportUrl,
  teamSizeLabel,
  totalMonthlySavings,
}: {
  reportToken: string;
  reportUrl: string;
  teamSizeLabel: string;
  totalMonthlySavings: number;
}) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isSubmitting = state === "submitting";
  const isComplete = state === "success" || state === "duplicate";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || isComplete) {
      return;
    }

    setState("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareToken: reportToken,
          email,
          companyName,
          role,
          website,
          reportUrl,
        }),
      });

      const data = (await response.json()) as LeadSubmissionResponse | ApiErrorResponse;
      if (!response.ok || !("success" in data)) {
        throw new Error("error" in data ? data.error : "Lead submission failed.");
      }

      setState(data.status === "duplicate" ? "duplicate" : "success");
      setMessage(data.emailDeliveryMessage ?? data.message);
    } catch (error) {
      setState("idle");
      setMessage(
        error instanceof Error
          ? error.message
          : "We couldn't save your details right now.",
      );
    }
  }

  return (
    <div className="surface rounded-[1.75rem] p-6">
      <div className="flex items-center gap-3">
        <Mail className="h-5 w-5 text-white" />
        <h2 className="text-xl font-semibold text-white">
          {totalMonthlySavings < 100
            ? "Stay on top of future optimization opportunities"
            : "Save this report and get the follow-up email"}
        </h2>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
        {totalMonthlySavings < 100
          ? "Your stack already looks disciplined. Leave a work email and we'll keep this report handy if pricing shifts or new savings paths appear."
          : "Capture this report for a founder, finance owner, or ops lead. We'll send a confirmation link and Credex may follow up on higher-savings cases."}
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
        <span className="rounded-full border border-white/10 px-3 py-1">
          {teamSizeLabel}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          Public report link
        </span>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="lead-email" className="text-sm text-slate-300">
              Work email
            </label>
            <Input
              id="lead-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="team@company.com"
              disabled={isSubmitting || isComplete}
              className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lead-company" className="text-sm text-slate-300">
              Company name
            </label>
            <Input
              id="lead-company"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Credex"
              disabled={isSubmitting || isComplete}
              className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lead-role" className="text-sm text-slate-300">
              Role
            </label>
            <Input
              id="lead-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Founder, Finance, Ops"
              disabled={isSubmitting || isComplete}
              className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="lead-website">Website</label>
          <Input
            id="lead-website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            Quiet honeypot protection keeps the flow lightweight.
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || isComplete}
            className="h-12 rounded-2xl bg-white px-5 text-slate-950 hover:bg-white/90"
          >
            {isSubmitting ? <LoaderCircle className="animate-spin" /> : null}
            {isSubmitting
              ? "Saving details..."
              : state === "duplicate"
                ? "Already saved"
                : state === "success"
                  ? "Saved"
                  : "Save report"}
          </Button>
        </div>

        {message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              state === "success" || state === "duplicate"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                : "border-rose-400/20 bg-rose-400/10 text-rose-100"
            }`}
          >
            {message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
