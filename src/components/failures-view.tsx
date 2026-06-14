"use client";

import { useState } from "react";
import { BookOpen, Braces, Clock3, FileWarning, Search, ShieldAlert, UserRound } from "lucide-react";
import { getFailureRows, getTrace, type VersionId } from "@/lib/eval";
import { Panel, StatusBadge } from "@/components/ui";

export function FailuresView({ initialCandidate, initialScenario }: { initialCandidate: VersionId; initialScenario?: string }) {
  const [candidate, setCandidate] = useState<VersionId>(initialCandidate);
  const [severity, setSeverity] = useState("all");
  const [category, setCategory] = useState("all");
  const rows = getFailureRows(candidate);
  const filtered = rows.filter((r) => (severity === "all" || r.failure.severity === severity) && (category === "all" || r.scenario.category === category));
  const [selected, setSelected] = useState(initialScenario && rows.some((r) => r.scenario.id === initialScenario) ? initialScenario : rows.find((r) => r.failure.severity === "critical")?.scenario.id ?? rows[0]?.scenario.id);
  const effectiveSelected = filtered.some((r) => r.scenario.id === selected) ? selected! : filtered[0]?.scenario.id;
  const trace = effectiveSelected ? getTrace(candidate, effectiveSelected) : null;

  function changeCandidate(value: VersionId) {
    const nextRows = getFailureRows(value);
    setCandidate(value);
    setSelected(nextRows.find((r) => r.failure.severity === "critical")?.scenario.id ?? nextRows[0]?.scenario.id);
  }

  return <div className="space-y-5">
    <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between"><div><div className="flex items-center gap-2 text-xs text-slate-500"><FileWarning size={13} />Inspectable evaluation evidence</div><h1 className="mt-2 text-2xl font-semibold tracking-tight">Failure explorer</h1><p className="mt-1 text-sm text-slate-400">Plain-English reasons: wrong answer, missing evidence, unsafe access, or production latency.</p></div><div className="flex gap-2"><select aria-label="Failure version" value={candidate} onChange={(e) => changeCandidate(e.target.value as VersionId)} className="h-9 rounded-md border border-white/10 bg-[#111722] px-3 text-sm"><option value="v2-candidate">v2-candidate · bad answers</option><option value="v3-improved">v3-improved · too slow</option><option value="v4-release">v4-release · no failures</option></select><select aria-label="Severity filter" value={severity} onChange={(e) => setSeverity(e.target.value)} className="h-9 rounded-md border border-white/10 bg-[#111722] px-3 text-sm"><option value="all">All severities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option></select><select aria-label="Category filter" value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 rounded-md border border-white/10 bg-[#111722] px-3 text-sm"><option value="all">All categories</option><option value="access_control">Access control</option><option value="adversarial">Adversarial</option><option value="abstention">Abstention</option><option value="multi_document">Multi-document</option></select></div></div>
    <div className="grid min-h-[720px] gap-5 xl:grid-cols-[390px_1fr]">
      <Panel className="h-fit overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3"><div className="text-sm font-medium">Failed scenarios</div><div className="font-mono text-xs text-slate-500">{filtered.length}</div></div>
        <div className="max-h-[690px] divide-y divide-white/6 overflow-auto">
          {filtered.map(({ scenario, failure }) => <button key={scenario.id} onClick={() => setSelected(scenario.id)} className={`w-full px-4 py-3.5 text-left transition hover:bg-white/[.03] ${effectiveSelected === scenario.id ? "bg-white/[.05] shadow-[inset_2px_0_0_#67e8f9]" : ""}`}>
            <div className="flex items-center justify-between"><div className="font-mono text-[11px] text-slate-500">{scenario.id} · {scenario.category.replace("_", " ")}</div><StatusBadge status={failure.severity === "critical" ? "critical" : "failed"} /></div>
            <div className="mt-2 text-sm font-medium text-slate-200">{scenario.title}</div><div className="mt-1 text-xs text-slate-500">{failure.type.replaceAll("_", " ")}</div>
          </button>)}
          {filtered.length === 0 && <div className="p-8 text-center text-sm text-slate-500"><Search size={18} className="mx-auto mb-2" />No failures match these filters.</div>}
        </div>
      </Panel>
      {!trace && <Panel className="flex min-h-[420px] items-center justify-center p-8 text-center">
        <div>
          <ShieldAlert size={24} className="mx-auto text-emerald-300" />
          <h2 className="mt-3 text-lg font-semibold">No failures for this version</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">This candidate passed the evaluated behavior checks. Use Compare or Deployments to review the final release decision.</p>
        </div>
      </Panel>}
      {trace && <div className="space-y-5">
        <Panel>
          <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="font-mono text-[11px] text-slate-500">{trace.scenario.id} · {trace.scenario.category.replace("_", " ")}</div><h2 className="mt-1 text-lg font-semibold">{trace.scenario.title}</h2></div><StatusBadge status={trace.outcome.failures[0].severity === "critical" ? "critical" : "failed"} /></div>
          <div className="grid gap-px bg-white/6 md:grid-cols-2">
            <div className="bg-[#0e1219] p-5"><div className="flex items-center gap-2 text-[11px] uppercase tracking-[.12em] text-slate-500"><UserRound size={13} />Test contract</div><div className="mt-4 text-sm leading-6 text-slate-200">“{trace.scenario.question}”</div><dl className="mt-4 space-y-2 text-xs"><div className="flex justify-between gap-4"><dt className="text-slate-500">Role</dt><dd>{trace.scenario.userRole}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Expected behavior</dt><dd className="font-mono text-cyan-300">{trace.scenario.expectedBehavior}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Expected evidence</dt><dd className="text-right">{trace.scenario.expectedDocumentIds.join(", ") || "None"}</dd></div></dl></div>
            <div className="bg-[#0e1219] p-5"><div className="flex items-center gap-2 text-[11px] uppercase tracking-[.12em] text-slate-500"><Braces size={13} />Actual answer</div><div className="mt-4 rounded-md border border-red-400/15 bg-red-400/5 p-3 text-sm leading-6 text-slate-200">“{trace.outcome.answer}”</div><div className="mt-3 flex gap-4 font-mono text-[11px] text-slate-500"><span className="flex items-center gap-1"><Clock3 size={11} />{trace.latencyMs} ms</span><span>{trace.inputTokens} input tokens</span><span>{trace.outputTokens} output tokens</span></div></div>
          </div>
        </Panel>
        <Panel>
          <div className="border-b border-white/8 px-5 py-4"><div className="text-sm font-medium">Retrieved evidence</div><div className="mt-1 text-xs text-slate-500">Documents visible to the generation step</div></div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {trace.retrieved.map((doc) => { const forbidden = trace.scenario.forbiddenDocumentIds.includes(doc.id); return <div key={doc.id} className={`rounded-md border p-4 ${forbidden ? "border-red-400/30 bg-red-400/5" : "border-white/8 bg-white/[.02]"}`}><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-medium">{doc.title}</div><div className="mt-1 font-mono text-[10px] text-slate-500">{doc.id}</div></div>{forbidden && <ShieldAlert size={16} className="text-red-300" />}</div><p className="mt-3 text-xs leading-5 text-slate-400">{doc.excerpt}</p><div className="mt-3 flex justify-between font-mono text-[10px]"><span className={forbidden ? "text-red-300" : "text-slate-500"}>{doc.access}</span><span className="text-slate-500">relevance {doc.score.toFixed(2)}</span></div></div>})}
            {trace.retrieved.length === 0 && <div className="col-span-2 py-5 text-center text-xs text-slate-500">No documents retrieved.</div>}
          </div>
        </Panel>
        <div className="grid gap-5 md:grid-cols-2">
          <Panel className="p-5"><div className="flex items-center gap-2 text-[11px] uppercase tracking-[.12em] text-slate-500"><BookOpen size={13} />Grader findings</div><div className="mt-4 font-mono text-xs text-red-300">{trace.outcome.failures[0].type}</div><p className="mt-2 text-sm leading-6 text-slate-300">{trace.outcome.failures[0].explanation}</p><div className="mt-4 grid grid-cols-3 gap-2">{Object.entries(trace.outcome.scores).slice(0, 6).map(([name, score]) => <div key={name} className="rounded border border-white/8 bg-white/[.02] p-2"><div className="truncate text-[9px] uppercase tracking-wide text-slate-600">{name.replace(/([A-Z])/g, " $1")}</div><div className={`mt-1 font-mono text-xs ${score >= .9 ? "text-emerald-300" : "text-red-300"}`}>{Math.round(score * 100)}%</div></div>)}</div><div className="mt-3 text-[10px] text-slate-600">Deterministic policy graders + seeded semantic judge</div></Panel>
          <Panel className="p-5"><div className="flex items-center gap-2 text-[11px] uppercase tracking-[.12em] text-slate-500"><ShieldAlert size={13} />Root cause & fix</div><p className="mt-4 text-sm leading-6 text-slate-300">{trace.outcome.failures[0].rootCause}</p><div className="mt-3 rounded-md border border-cyan-400/15 bg-cyan-400/5 p-3 text-xs leading-5 text-cyan-100">{trace.outcome.failures[0].recommendation}</div></Panel>
        </div>
      </div>}
    </div>
  </div>;
}
