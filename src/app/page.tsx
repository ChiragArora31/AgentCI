import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, GitCompareArrows, LockKeyhole, Play, ShieldAlert, Sparkles } from "lucide-react";
import { Panel, StatusBadge } from "@/components/ui";
import { getMetrics, scenarios } from "@/lib/eval";

const journey = [
  { version: "v1", name: "Production", label: "Healthy baseline", detail: "Trusted Enterprise RAG Assistant.", status: "production" as const, tone: "border-cyan-400/20 bg-cyan-400/10" },
  { version: "v2", name: "Candidate", label: "Fast but unsafe", detail: "Inaccurate answers and restricted data exposure.", status: "blocked" as const, tone: "border-red-400/30 bg-red-400/8" },
  { version: "v3", name: "Improved", label: "Safe but slow", detail: "Correct behavior returns, latency gate fails.", status: "blocked" as const, tone: "border-amber-400/20 bg-amber-400/10" },
  { version: "v4", name: "Release", label: "Ready to promote", detail: "Balanced retrieval clears every release gate.", status: "promoted" as const, tone: "border-emerald-400/30 bg-emerald-400/8" },
];

const checks = [
  "Correctness",
  "Grounding",
  "Abstention",
  "Access control",
  "Latency",
  "Cost",
];

const stages = ["Build", "Evaluate", "Trace", "Gate", "Promote"];

export default function Home() {
  const v2 = getMetrics("v2-candidate");
  const v4 = getMetrics("v4-release");

  return <div className="space-y-5">
    <Panel className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 top-[-140px] size-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-24 bottom-[-160px] size-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px overflow-hidden bg-white/8"><div className="h-px w-1/2 bg-cyan-300/70 animate-scan" /></div>
      </div>

      <div className="relative grid gap-px bg-white/6 xl:grid-cols-[1.18fr_.82fr]">
        <div className="bg-[#0e1219]/95 p-6 lg:p-8 xl:p-10">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/6 px-3 py-1 text-xs font-medium text-cyan-200">
            <Sparkles size={13} /> AgentCI for an Enterprise RAG Assistant
          </div>
          <h1 className="animate-fade-up mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-slate-50 lg:text-5xl" style={{ animationDelay: "80ms" }}>
            Ship AI agents only after their behavior passes CI.
          </h1>
          <p className="animate-fade-up mt-4 max-w-3xl text-sm leading-6 text-slate-400 lg:text-base" style={{ animationDelay: "160ms" }}>
            Traditional CI proves the app still builds. AgentCI proves the RAG agent still answers correctly, stays grounded in approved documents, refuses unsafe requests, respects access control, and meets release gates.
          </p>

          <div className="animate-fade-up mt-7 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <Link href="/runs" className="group inline-flex h-10 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              <Play size={14} fill="currentColor" /> Start demo <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/playground" className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/5">
              Try the RAG agent
            </Link>
            <Link href="/compare" className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/5">
              View scorecard
            </Link>
          </div>

          <div className="animate-fade-up mt-8 grid gap-3 sm:grid-cols-3" style={{ animationDelay: "320ms" }}>
            <div className="rounded-lg border border-white/8 bg-white/[.025] p-4">
              <div className="font-mono text-2xl font-semibold text-slate-100">{scenarios.length}</div>
              <div className="mt-1 text-xs text-slate-500">seeded eval scenarios</div>
            </div>
            <div className="rounded-lg border border-red-400/20 bg-red-400/6 p-4">
              <div className="font-mono text-2xl font-semibold text-red-200">{v2.passRate.toFixed(1)}%</div>
              <div className="mt-1 text-xs text-slate-500">v2 pass rate, blocked</div>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/6 p-4">
              <div className="font-mono text-2xl font-semibold text-emerald-200">{v4.passRate.toFixed(1)}%</div>
              <div className="mt-1 text-xs text-slate-500">v4 pass rate, promoted</div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[470px] overflow-hidden bg-[#0e1219]/95 p-6 lg:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[.14em] text-slate-500">Live release story</div>
                <div className="mt-1 text-sm font-medium text-slate-100">v2 blocked, v4 promoted</div>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 text-[11px] text-emerald-300">deterministic replay</div>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-[#090c12]/80 p-4 shadow-2xl shadow-cyan-950/20 animate-float">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium"><Bot size={15} className="text-cyan-300" /> Enterprise RAG Assistant</div>
                <StatusBadge status="blocked" />
              </div>
              <div className="relative py-5">
                <svg viewBox="0 0 420 96" className="h-24 w-full" aria-hidden="true">
                  <path d="M28 48 C104 8 152 90 214 48 S326 10 392 48" fill="none" stroke="rgba(103,232,249,.28)" strokeWidth="2" />
                  <path className="agentci-draw-line" d="M28 48 C104 8 152 90 214 48 S326 10 392 48" fill="none" stroke="rgb(103,232,249)" strokeWidth="2.4" strokeLinecap="round" />
                  {[28, 122, 214, 304, 392].map((x, index) => <circle key={x} cx={x} cy={index === 1 || index === 3 ? 30 : 48} r="5" fill={index === 2 ? "rgb(248,113,113)" : "rgb(103,232,249)"} className={index === 2 ? "animate-pulse-soft" : ""} />)}
                </svg>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] text-slate-500">
                  {stages.map((stage) => <div key={stage}>{stage}</div>)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-red-400/20 bg-red-400/6 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-red-200"><ShieldAlert size={13} /> Access leak caught</div>
                  <div className="mt-2 font-mono text-lg text-red-100">2 critical</div>
                </div>
                <div className="rounded-md border border-emerald-400/20 bg-emerald-400/6 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-200"><LockKeyhole size={13} /> v4 clean</div>
                  <div className="mt-2 font-mono text-lg text-emerald-100">0 leaks</div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {stages.map((stage, index) => <div key={stage} className="rounded-md border border-white/8 bg-white/[.025] p-2 text-center">
                <div className={`mx-auto size-1.5 rounded-full ${index < 4 ? "bg-cyan-300" : "bg-emerald-300"} ${index === 2 ? "animate-pulse-soft" : ""}`} />
                <div className="mt-2 truncate text-[10px] text-slate-500">{stage}</div>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </Panel>

    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Panel className="overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4">
          <div className="text-sm font-medium">What the demo proves</div>
          <div className="mt-1 text-xs text-slate-500">A realistic release story across four versions of the same RAG assistant.</div>
        </div>
        <div className="relative grid gap-px bg-white/6 md:grid-cols-2 xl:grid-cols-4">
          {journey.map((item, index) => <div key={item.version} className={`group relative overflow-hidden border-white/8 bg-[#0e1219] p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[.03] ${index === 0 ? "" : ""}`}>
            <div className={`absolute inset-x-4 top-0 h-px ${item.tone}`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[11px] text-slate-500">{item.version} · {item.name}</div>
                <div className="mt-2 text-sm font-semibold text-slate-100">{item.label}</div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-3 min-h-10 text-xs leading-5 text-slate-400">{item.detail}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div className={`h-full rounded-full transition-all duration-700 group-hover:w-full ${item.status === "promoted" ? "w-full bg-emerald-300" : item.status === "blocked" ? "w-2/3 bg-red-300" : "w-4/5 bg-cyan-300"}`} />
            </div>
          </div>)}
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4">
          <div className="text-sm font-medium">Evaluation contract</div>
          <div className="mt-1 text-xs text-slate-500">{scenarios.length} seeded scenarios, deterministic graders.</div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4">
          {checks.map((check, index) => <div key={check} className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[.02] px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-300/25 hover:bg-emerald-300/5" style={{ animationDelay: `${index * 45}ms` }}>
            <CheckCircle2 size={13} className="text-emerald-300" /> {check}
          </div>)}
        </div>
        <div className="border-t border-white/8 p-4">
          <div className="flex items-start gap-3 rounded-md border border-amber-400/20 bg-amber-400/6 p-3">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <p className="text-xs leading-5 text-slate-400">Critical access-control or adversarial failures block deployment automatically, even when normal build checks pass.</p>
          </div>
        </div>
      </Panel>
    </div>

    <Panel className="p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><GitCompareArrows size={13} /> Suggested judge path</div>
          <p className="mt-2 text-sm text-slate-300">Start with the pipeline, inspect a blocked failure trace, compare v2 through v4, then use the playground to see the underlying RAG behavior.</p>
        </div>
        <Link href="/runs" className="group inline-flex items-center justify-center gap-2 rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/10">
          Open release pipeline <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Panel>
  </div>;
}
