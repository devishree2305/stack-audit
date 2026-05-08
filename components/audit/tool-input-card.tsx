"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getToolById, toolCatalog, usageTypeLabels } from "@/lib/pricing-data";
import type { AuditToolInput } from "@/types/audit";

export function ToolInputCard({
  tool,
  index,
  onChange,
  onRemove,
}: {
  tool: AuditToolInput;
  index: number;
  onChange: (toolId: string, field: keyof AuditToolInput, value: string | number) => void;
  onRemove: (toolId: string) => void;
}) {
  const toolMeta = getToolById(tool.toolId) ?? toolCatalog[0];

  return (
    <div className="surface rounded-[1.75rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${toolMeta.accent} text-sm font-semibold text-white`}
          >
            {toolMeta.icon}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Tool {index + 1}
            </p>
            <h3 className="text-lg font-semibold text-white">AI subscription</h3>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
          onClick={() => onRemove(tool.id)}
          aria-label="Remove tool"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${tool.id}-tool`} className="text-slate-300">
            Tool
          </Label>
          <select
            id={`${tool.id}-tool`}
            value={tool.toolId}
            onChange={(event) => onChange(tool.id, "toolId", event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-emerald-400/50"
          >
            {toolCatalog.map((item) => (
              <option key={item.id} value={item.id} className="bg-slate-950">
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${tool.id}-plan`} className="text-slate-300">
            Plan
          </Label>
          <select
            id={`${tool.id}-plan`}
            value={tool.planId}
            onChange={(event) => onChange(tool.id, "planId", event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-emerald-400/50"
          >
            {toolMeta.plans.map((plan) => (
              <option key={plan.id} value={plan.id} className="bg-slate-950">
                {plan.name} - ${plan.monthlyPrice}/mo
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${tool.id}-spend`} className="text-slate-300">
            Monthly spend
          </Label>
          <Input
            id={`${tool.id}-spend`}
            type="number"
            min="0"
            value={tool.monthlySpend}
            onChange={(event) =>
              onChange(tool.id, "monthlySpend", Number(event.target.value))
            }
            className="h-12 rounded-2xl border-white/10 bg-white/[0.03] text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${tool.id}-seats`} className="text-slate-300">
            Seats
          </Label>
          <Input
            id={`${tool.id}-seats`}
            type="number"
            min="1"
            value={tool.seats}
            onChange={(event) => onChange(tool.id, "seats", Number(event.target.value))}
            className="h-12 rounded-2xl border-white/10 bg-white/[0.03] text-white"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={`${tool.id}-usage`} className="text-slate-300">
            Usage type
          </Label>
          <select
            id={`${tool.id}-usage`}
            value={tool.usageType}
            onChange={(event) => onChange(tool.id, "usageType", event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-emerald-400/50"
          >
            {toolMeta.usageOptions.map((usage) => (
              <option key={usage} value={usage} className="bg-slate-950">
                {usageTypeLabels[usage]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
