"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Equal, GitCompareArrows } from "lucide-react";
import { getGates, getMetrics, metricLabels, versions, type MetricKey, type VersionId } from "@/lib/eval";
import { MetricValue, Panel, StatusBadge } from "@/components/ui";

const rows: Array<{ key: MetricKey; type?: "percent" | "count" | "ms" | "cost" }> = [
  { key: "passRate" }, { key: "correctness" }, { key: "retrievalRecall" }, { key: "groundedness" }, { key: "citationAccuracy" }, { key: "abstentionAccuracy" }, { key: "accessViolations", type: "count" }, { key: "unsafeAnswers", type: "count" }, { key: "p95Latency", type: "ms" }, { key: "estimatedCost", type: "cost" },
];

export function CompareView() {
  const [candidate, setCandidate] = useState<VersionId>("v2-candidate");
  const baseline = getMetrics("v1-production");
  const metrics = getMetrics(candidate);
  const gates = getGates(candidate);
  const config = versions[candidate].config;
  const baseConfig = versions["v1-production"].config;
  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-xs text-slate-500"><GitCompareArrows size={13} />Behavioral regression analysis</div><h1 className="mt-2 text-2xl font-semibold tracking-tight">Compare versions</h1><p className="mt-1 text-sm text-slate-400">One deployment contract. Every delta is evaluated against production.</p></div><select aria-label="Compare candidate" value={candidate} onChange={(e) => setCandidate(e.target.value as VersionId)} className="h-9 rounded-md border border-white/10 bg-[#111722] px-3 text-sm"><option value="v2-candidate">v1-production vs v2-candidate</option><option value="v3-fixed">v1-production vs v3-fixed</option></select></div>
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-[1.35fr_.75fr_.75fr_.65fr_1fr_.55fr] border-b border-white/8 bg-white/[.02] px-5 py-3 text-[10px] uppercase tracking-[.12em] text-slate-500"><div>Metric</div><div>Production</div><div>Candidate</div><div>Delta</div><div>Required gate</div><div>Status</div></div>
        <div className="divide-y divide-white/6">
          {rows.map(({ key, type }) => {
            const delta = metrics[key] - baseline[key];
            const lowerBetter = ["accessViolations", "unsafeAnswers", "p95Latency", "estimatedCost"].includes(key);
            const good = lowerBetter ? delta <= 0 : delta >= 0;
            const gate = gates.find((g) => g.metric === key);
            return <div key={key} className="grid grid-cols-[1.35fr_.75fr_.75fr_.65fr_1fr_.55fr] items-center px-5 py-3 text-sm hover:bg-white/[.02]"><div className="text-slate-300">{metricLabels[key]}</div><div className="font-mono text-xs text-slate-400"><MetricValue value={baseline[key]} type={type} /></div><div className="font-mono text-xs font-medium"><MetricValue value={metrics[key]} type={type} /></div><div className={`flex items-center gap-1 font-mono text-xs ${delta === 0 ? "text-slate-500" : good ? "text-emerald-400" : "text-red-400"}`}>{delta === 0 ? <Equal size={11} /> : good ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{Math.abs(delta).toFixed(type === "cost" ? 3 : 1)}</div><div className="text-xs text-slate-500">{gate?.threshold ?? "Monitor"}</div><div>{gate ? <StatusBadge status={gate.passed ? "passed" : "failed"} /> : <span className="text-xs text-slate-600">—</span>}</div></div>;
          })}
        </div>
      </Panel>
      <Panel className="h-fit">
        <div className="border-b border-white/8 px-5 py-4"><div className="text-sm font-medium">Configuration changes</div><div className="mt-1 text-xs text-slate-500">{versions[candidate].changeSummary}</div></div>
        <div className="divide-y divide-white/6">
          {Object.entries(config).map(([key, value]) => {
            const previous = baseConfig[key as keyof typeof baseConfig];
            const changed = previous !== value;
            return <div key={key} className="px-5 py-3"><div className="text-[11px] text-slate-500">{key.replace(/([A-Z])/g, " $1")}</div><div className="mt-1 flex items-center justify-between gap-3 font-mono text-xs"><span className={changed ? "text-slate-600 line-through" : "text-slate-500"}>{String(previous)}</span><span className={changed ? "text-cyan-300" : "text-slate-400"}>{String(value)}</span></div></div>;
          })}
        </div>
      </Panel>
    </div>
  </div>;
}
