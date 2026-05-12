"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AuditSummary } from "@/components/audit/audit-summary";
import { ToolInputCard } from "@/components/audit/tool-input-card";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  getPlanDefaultSpend,
  getToolById,
  primaryUseCases,
  toolCatalog,
} from "@/lib/pricing-data";
import type { ApiErrorResponse, PersistedAuditResponse } from "@/types/api";
import type { AuditFormValues, AuditToolInput } from "@/types/audit";

const defaultTool = (): AuditToolInput => ({
  id: crypto.randomUUID(),
  toolId: "cursor",
  planId: "pro",
  monthlySpend: 20,
  seats: 1,
  usageType: "daily",
});

const defaultValues: AuditFormValues = {
  teamSize: 5,
  primaryUseCase: "coding",
  tools: [defaultTool()],
};

export function AuditForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { value, setValue, hydrated } = useLocalStorage<AuditFormValues>(
    "stack-audit:draft",
    defaultValues,
  );

  const setToolField = (
    toolId: string,
    field: keyof AuditToolInput,
    nextValue: string | number,
  ) => {
    setValue({
      ...value,
      tools: value.tools.map((tool) => {
        if (tool.id !== toolId) {
          return tool;
        }

        const updated = { ...tool, [field]: nextValue };
        if (field === "toolId") {
          const nextTool = getToolById(nextValue as AuditToolInput["toolId"]);
          return {
            ...updated,
            toolId: nextValue as AuditToolInput["toolId"],
            planId: nextTool?.plans[0]?.id ?? tool.planId,
            monthlySpend:
              nextTool?.plans[0] !== undefined
                ? getPlanDefaultSpend(nextTool.plans[0].monthlyPrice)
                : tool.monthlySpend,
          };
        }

        if (field === "planId") {
          const nextPlan = getToolById(tool.toolId)?.plans.find(
            (plan) => plan.id === nextValue,
          );
          return {
            ...updated,
            planId: nextValue as string,
            monthlySpend:
              nextPlan !== undefined
                ? getPlanDefaultSpend(nextPlan.monthlyPrice)
                : tool.monthlySpend,
          };
        }

        return updated;
      }),
    });
  };

  const addTool = () => {
    const firstTool = toolCatalog[0];
    setValue({
      ...value,
      tools: [
        ...value.tools,
        {
          id: crypto.randomUUID(),
          toolId: firstTool.id,
          planId: firstTool.plans[0].id,
          monthlySpend: getPlanDefaultSpend(firstTool.plans[0].monthlyPrice),
          seats: 1,
          usageType: firstTool.usageOptions[0],
        },
      ],
    });
  };

  const removeTool = (toolId: string) => {
    if (value.tools.length === 1) {
      return;
    }

    setValue({
      ...value,
      tools: value.tools.filter((tool) => tool.id !== toolId),
    });
  };

  const handleSubmit = async () => {
    setSubmissionError(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      const rawBody = await response.text();
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson
        ? (JSON.parse(rawBody) as PersistedAuditResponse | ApiErrorResponse)
        : null;

      if (!response.ok || !data || !("success" in data)) {
        const fallbackMessage = rawBody
          ? rawBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 220)
          : "";
        throw new Error(
          data && "error" in data
            ? data.error
            : fallbackMessage ||
                "The audit API returned an unexpected response. Check the server console for the underlying error.",
        );
      }

      window.localStorage.setItem(
        `stack-audit:report:${data.shareToken}`,
        JSON.stringify(data.report),
      );

      startTransition(() => {
        router.push(`/report/${data.shareToken}`);
      });
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We couldn't generate the audit right now.",
      );
    }
  };

  if (!hydrated) {
    return (
      <div className="surface rounded-[1.75rem] p-8 text-sm text-slate-400">
        Loading your audit workspace...
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-8">
        <div className="surface rounded-[1.75rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Audit setup
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                Build your AI spend profile
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Add the tools your team currently pays for and we&apos;ll estimate
                where you can downgrade, consolidate, or route usage more
                efficiently.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href="/report/sample-audit">View sample result</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="team-size" className="text-sm text-slate-300">
                Team size
              </label>
              <input
                id="team-size"
                type="number"
                min="1"
                value={value.teamSize}
                onChange={(event) =>
                  setValue({ ...value, teamSize: Number(event.target.value) })
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-emerald-400/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="use-case" className="text-sm text-slate-300">
                Primary use case
              </label>
              <select
                id="use-case"
                value={value.primaryUseCase}
                onChange={(event) =>
                  setValue({
                    ...value,
                    primaryUseCase:
                      event.target.value as AuditFormValues["primaryUseCase"],
                  })
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm capitalize text-white outline-none transition focus:border-emerald-400/50"
              >
                {primaryUseCases.map((useCase) => (
                  <option key={useCase} value={useCase} className="bg-slate-950">
                    {useCase}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {value.tools.map((tool, index) => (
            <div key={tool.id} className="motion-safe:fade-in-soft">
              <ToolInputCard
                tool={tool}
                index={index}
                onChange={setToolField}
                onRemove={removeTool}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={addTool}
            className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            <Plus />
            Add another tool
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-full bg-white px-6 text-slate-950 hover:bg-white/90"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : null}
            {isPending ? "Saving audit..." : "Generate audit"}
            <ArrowRight />
          </Button>
        </div>

        {submissionError ? (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submissionError}</p>
          </div>
        ) : null}
      </div>

      <AuditSummary values={value} />
    </div>
  );
}
