"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, GitBranch, Play, RotateCcw, ShieldAlert, Sparkles, X } from "lucide-react";
import { getDecision, getGates, getMetrics, getOutcomes, metricLabels, type MetricKey, type VersionId } from "@/lib/eval";
import { MetricValue, Panel, StatusBadge } from "@/components/ui";

const stages = ["Build", "Load suite", "Run 15 scenarios", "Grade traces", "Compare", "Quality gate", "Deploy"];
const summary: Array<{ key: MetricKey; type?: "percent" | "count" | "ms" | "cost" }> = [
  { key: "passRate" }, { key: "correctness" }, { key: "groundedness" }, { key: "accessViolations", type: "count" }, { key: "p95Latency", type: "ms" }, { key: "estimatedCost", type: "cost" },
];

export function PipelineRun() {
  const [candidate, setCandidate] = useState<VersionId>("v2-candidate");
  const [stage, setStage] = useState(7);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const metrics = getMetrics(candidate);
  const baseline = getMetrics("v1-production");
  const gates = getGates(candidate);
  const decision = getDecision(candidate);
  const criticalCount = getOutcomes(candidate).filter((o) => !o.passed && o.failures[0]?.severity === "critical").length;
  const failedGates = gates.filter((g) => !g.passed);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  function run() {
    timers.current.forEach(window.clearTimeout);
    setRunning(true);
    setStage(0);
    stages.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setStage(index + 1), 430 * (index + 1)));
    });
    timers.current.push(window.setTimeout(() => setRunning(false), 430 * stages.length + 100));
  }

  function reset() {
    timers.current.forEach(window.clearTimeout);
    setRunning(false);
    setStage(0);
  }

  const complete = stage === stages.length && !running;
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><GitBranch size={13} /> PR #184 · retrieval/fast-path</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Pipeline run</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">Traditional checks passed. AgentCI is validating behavior against the production deployment contract.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-500">Candidate</label>
          <select aria-label="Candidate version" value={candidate} disabled={running} onChange={(e) => { setCandidate(e.target.value as VersionId); setStage(0); }} className="h-9 rounded-md border border-white/10 bg-[#111722] px-3 text-sm outline-none focus:border-cyan-400/50">
            <option value="v2-candidate">v2-candidate · inaccurate</option>
            <option value="v3-improved">v3-improved · accurate but slow</option>
            <option value="v4-release">v4-release · production-ready</option>
          </select>
          <button onClick={reset} disabled={running} className="flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-40"><RotateCcw size={14} />Reset</button>
          <button onClick={run} disabled={running} className="flex h-9 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60"><Play size={14} fill="currentColor" />{running ? "Evaluating…" : "Run evaluation"}</button>
        </div>
      </div>

      {complete && (
        <div className={`flex flex-col gap-4 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between ${decision === "blocked" ? "border-red-400/30 bg-red-400/8" : "border-emerald-400/30 bg-emerald-400/8"}`}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex size-9 items-center justify-center rounded-full ${decision === "blocked" ? "bg-red-400/15 text-red-300" : "bg-emerald-400/15 text-emerald-300"}`}>{decision === "blocked" ? <ShieldAlert size={19} /> : <Sparkles size={19} />}</div>
            <div>
              <h2 className="text-lg font-semibold">{decision === "blocked" ? "Deployment blocked" : "Candidate promoted"}</h2>
              <p className="mt-1 text-sm text-slate-300">{decision === "blocked" ? criticalCount > 0 ? `${criticalCount} critical behavior regressions and ${failedGates.length} release gates failed. The agent is not safe to ship.` : `The answer quality improved, but ${failedGates.length} release gate still failed. Accurate is not enough if the agent is too slow for production.` : `All behavior and release gates passed; reliability improved by ${(metrics.passRate - baseline.passRate).toFixed(1)} points.`}</p>
            </div>
          </div>
          <Link href={decision === "blocked" ? criticalCount > 0 ? `/failures?candidate=${candidate}&scenario=E07` : "/compare" : "/deployments"} className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${decision === "blocked" ? "border-red-300/30 text-red-200 hover:bg-red-300/10" : "border-emerald-300/30 text-emerald-200 hover:bg-emerald-300/10"}`}>{decision === "blocked" ? criticalCount > 0 ? "Inspect failed answer" : "Inspect release gate" : "View deployment"}<ArrowRight size={14} /></Link>
        </div>
      )}

      <Panel className="overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4"><div className="text-sm font-medium">Release pipeline</div><div className="mt-1 text-xs text-slate-500">Production replay · same evaluation contract as the release gate</div></div>
        <div className="grid grid-cols-2 gap-px bg-white/8 md:grid-cols-4 xl:grid-cols-7">
          {stages.map((name, index) => {
            const done = index < stage;
            const active = running && index === stage;
            const deployFailed = done && index === 6 && decision === "blocked";
            return <div key={name} className="min-h-24 bg-[#0e1219] p-4">
              <div className={`flex size-6 items-center justify-center rounded-full border text-[11px] ${deployFailed ? "border-red-400/40 bg-red-400/10 text-red-300" : done ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : active ? "animate-pulse border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-white/10 text-slate-600"}`}>{deployFailed ? <X size={12} /> : done ? <Check size={12} /> : index + 1}</div>
              <div className="mt-3 text-xs font-medium text-slate-300">{name}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">{active ? "Running" : done ? deployFailed ? "Blocked" : "Passed" : "Pending"}</div>
            </div>;
          })}
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <Panel>
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4"><div><div className="text-sm font-medium">Quality gates</div><div className="mt-1 text-xs text-slate-500">Release policy · critical failures always block</div></div><StatusBadge status={decision} /></div>
          <div className="divide-y divide-white/6">
            {gates.map((gate) => {
              const content = <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 text-sm hover:bg-white/[.02]"><div className="flex items-center gap-2">{gate.critical && <ShieldAlert size={13} className="text-red-300" />}<span className="text-slate-300">{gate.name}</span></div><div className="font-mono text-xs text-slate-400">{gate.metric === "p95Latency" ? `${gate.current.toLocaleString()} ms` : ["accessViolations", "unsafeAnswers"].includes(gate.metric) ? gate.current : `${gate.current.toFixed(1)}%`} <span className="ml-2 text-slate-600">{gate.threshold}</span></div><StatusBadge status={gate.passed ? "passed" : "failed"} /></div>;
              return !gate.passed && gate.scenarioId ? <Link key={gate.name} href={`/failures?candidate=${candidate}&scenario=${gate.scenarioId}`}>{content}</Link> : <div key={gate.name}>{content}</div>;
            })}
          </div>
        </Panel>
        <Panel>
          <div className="border-b border-white/8 px-5 py-4"><div className="text-sm font-medium">Candidate metrics</div><div className="mt-1 text-xs text-slate-500">{candidate} vs v1-production</div></div>
          <div className="grid grid-cols-2 gap-px bg-white/6 sm:grid-cols-3">
            {summary.map(({ key, type }) => {
              const delta = metrics[key] - baseline[key];
              const positive = ["p95Latency", "estimatedCost", "accessViolations"].includes(key) ? delta <= 0 : delta >= 0;
              return <div key={key} className="bg-[#0e1219] p-4"><div className="text-[11px] text-slate-500">{metricLabels[key]}</div><div className="mt-2 font-mono text-xl font-semibold"><MetricValue value={metrics[key]} type={type} /></div><div className={`mt-1 text-[11px] ${positive ? "text-emerald-400" : "text-red-400"}`}>{delta > 0 ? "+" : ""}{key === "p95Latency" ? `${delta.toLocaleString()} ms` : key === "estimatedCost" ? `$${delta.toFixed(3)}` : `${delta.toFixed(1)}${type === "count" ? "" : " pts"}`}</div></div>;
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
