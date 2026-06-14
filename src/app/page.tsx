import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, GitCompareArrows, Play, ShieldAlert } from "lucide-react";
import { Panel, StatusBadge } from "@/components/ui";
import { getDecision, getMetrics, scenarios } from "@/lib/eval";

const journey = [
  { version: "v1-production", label: "Healthy baseline", detail: "Existing Enterprise RAG Assistant is stable and trusted.", status: "production" as const },
  { version: "v2-candidate", label: "Fast but unsafe", detail: "A retrieval shortcut makes answers inaccurate and exposes restricted data.", status: "blocked" as const },
  { version: "v3-improved", label: "Safe but slow", detail: "Safety is restored, but over-retrieval violates the latency gate.", status: "blocked" as const },
  { version: "v4-release", label: "Ready to promote", detail: "Balanced retrieval clears behavior, security, and performance gates.", status: "promoted" as const },
];

const checks = [
  "Correctness",
  "Grounding",
  "Abstention",
  "Access control",
  "Latency",
  "Cost",
];

export default function Home() {
  const v2 = getMetrics("v2-candidate");
  const v4 = getMetrics("v4-release");
  return <div className="space-y-5">
    <Panel className="overflow-hidden">
      <div className="grid gap-px bg-white/6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="bg-[#0e1219] p-6 lg:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/6 px-3 py-1 text-xs font-medium text-cyan-200">
            <Bot size={13} /> Enterprise RAG Assistant demo
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-50 lg:text-4xl">
            CI/CD that checks how an AI agent behaves before it reaches production.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400 lg:text-base">
            Traditional CI proves the app still builds. AgentCI proves the RAG agent still answers correctly, stays grounded in approved documents, refuses unsafe requests, respects access control, and meets release performance gates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/runs" className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              <Play size={14} fill="currentColor" /> Start demo
            </Link>
            <Link href="/playground" className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/5">
              Try the RAG agent <ArrowRight size={14} />
            </Link>
            <Link href="/compare" className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/5">
              View evaluation scorecard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="bg-[#0e1219] p-6 lg:p-8">
          <div className="text-[10px] uppercase tracking-[.14em] text-slate-500">Demo outcome</div>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-red-400/20 bg-red-400/6 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-slate-100">v2 blocked</div>
                <StatusBadge status={getDecision("v2-candidate")} />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">Only {v2.passRate.toFixed(1)}% of scenarios pass, with access-control and unsafe-answer failures.</p>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/6 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-slate-100">v4 promoted</div>
                <StatusBadge status={getDecision("v4-release")} />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{v4.passRate.toFixed(1)}% pass rate with zero restricted-data leaks and zero unsafe confident answers.</p>
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
        <div className="grid gap-px bg-white/6 md:grid-cols-2 xl:grid-cols-4">
          {journey.map((item) => <div key={item.version} className="bg-[#0e1219] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[11px] text-slate-500">{item.version}</div>
                <div className="mt-2 text-sm font-semibold text-slate-100">{item.label}</div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">{item.detail}</p>
          </div>)}
        </div>
      </Panel>

      <Panel>
        <div className="border-b border-white/8 px-5 py-4">
          <div className="text-sm font-medium">Evaluation contract</div>
          <div className="mt-1 text-xs text-slate-500">{scenarios.length} seeded scenarios, deterministic graders.</div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4">
          {checks.map((check) => <div key={check} className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[.02] px-3 py-2 text-xs text-slate-300">
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
        <Link href="/runs" className="inline-flex items-center justify-center gap-2 rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/10">
          Open release pipeline <ArrowRight size={14} />
        </Link>
      </div>
    </Panel>
  </div>;
}
