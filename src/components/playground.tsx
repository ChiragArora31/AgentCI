"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Bot, Braces, Check, Clock3, FileText, LockKeyhole, RotateCcw, ShieldAlert, Sparkles, UserRound, X } from "lucide-react";
import { playgroundPrompts, type RagResponse, type UserRole } from "@/lib/rag";
import { versions, type VersionId } from "@/lib/eval";
import { Panel, StatusBadge } from "@/components/ui";

const decisionStatus = {
  answered: "passed",
  abstained: "running",
  refused: "passed",
  unsafe: "critical",
  unavailable: "failed",
} as const;

export function Playground() {
  const [version, setVersion] = useState<VersionId>("v1-production");
  const [role, setRole] = useState<UserRole>("employee");
  const [query, setQuery] = useState(playgroundPrompts[0].question);
  const [response, setResponse] = useState<RagResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(nextQuery = query, nextRole = role, nextVersion = version) {
    if (!nextQuery.trim() || running) return;
    setQuery(nextQuery);
    setRole(nextRole);
    setRunning(true);
    setError(null);
    try {
      const result = await fetch("/api/rag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: nextQuery, versionId: nextVersion, role: nextRole }) });
      if (!result.ok) throw new Error("The RAG request could not be completed.");
      setResponse(await result.json() as RagResponse);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The RAG request could not be completed.");
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    fetch("/api/rag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: playgroundPrompts[0].question, versionId: "v1-production", role: "employee" }) })
      .then((result) => {
        if (!result.ok) throw new Error("The initial RAG request could not be completed.");
        return result.json() as Promise<RagResponse>;
      })
      .then(setResponse)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : "The initial RAG request could not be completed."));
  }, []);

  function reset() {
    setVersion("v1-production");
    setRole("employee");
    setQuery(playgroundPrompts[0].question);
    void ask(playgroundPrompts[0].question, "employee", "v1-production");
  }

  return <div className="space-y-5">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div><div className="flex items-center gap-2 text-xs text-slate-500"><Bot size={13} />Live RAG execution</div><h1 className="mt-2 text-2xl font-semibold tracking-tight">Agent Playground</h1><p className="mt-1 text-sm text-slate-400">Queries read and rank the Markdown knowledge base on the server, then send retrieved context to OpenAI.</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-slate-500">Version</label>
        <select aria-label="Agent version" value={version} onChange={(event) => { setVersion(event.target.value as VersionId); setResponse(null); setError(null); }} className="h-9 rounded-md border border-white/10 bg-[#111722] px-3 text-sm"><option value="v1-production">v1-production · healthy</option><option value="v2-candidate">v2-candidate · regressed</option><option value="v3-fixed">v3-fixed · promoted</option></select>
        <label className="ml-2 text-xs text-slate-500">User role</label>
        <select aria-label="User role" value={role} onChange={(event) => { setRole(event.target.value as UserRole); setResponse(null); setError(null); }} className="h-9 rounded-md border border-white/10 bg-[#111722] px-3 text-sm"><option value="employee">Employee</option><option value="engineer">Engineer</option><option value="hr">HR</option></select>
        <button onClick={reset} className="flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-slate-300 hover:bg-white/5"><RotateCcw size={14} />Reset</button>
      </div>
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
      <div className="space-y-5">
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4"><div><div className="text-sm font-medium">Conversation</div><div className="mt-1 text-xs text-slate-500">{version} · acting as {role}</div></div><StatusBadge status={versions[version].status === "blocked" ? "blocked" : versions[version].status === "promoted" ? "promoted" : "production"} /></div>
          <div className="min-h-[380px] space-y-5 p-5">
            <div className="ml-auto max-w-[82%] rounded-lg rounded-br-sm border border-cyan-400/20 bg-cyan-400/8 p-4"><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-cyan-300"><UserRound size={12} />{response?.role ?? role}</div><p className="text-sm leading-6 text-slate-200">{response?.query ?? query}</p></div>
            <div className={`max-w-[88%] rounded-lg rounded-bl-sm border p-4 ${response?.decision === "unsafe" ? "border-red-400/30 bg-red-400/7" : "border-white/10 bg-white/[.025]"}`}>
              <div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500"><Bot size={12} />Enterprise Knowledge Assistant</div>{response && <StatusBadge status={decisionStatus[response.decision]} />}</div>
              <p className="text-sm leading-6 text-slate-200">{running ? "Reading files and ranking knowledge…" : response?.answer ?? "Submit the question to run this selected version and role."}</p>
              {!running && response && response.citations.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{response.citations.map((citation) => <span key={citation} className="rounded border border-cyan-400/15 bg-cyan-400/5 px-2 py-1 font-mono text-[10px] text-cyan-200">{citation}</span>)}</div>}
              {!running && response && <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/6 pt-3 font-mono text-[10px] text-slate-600"><span className="flex items-center gap-1"><Clock3 size={11} />{response.latencyMs} ms measured</span><span>{response.retrieved.length} retrieved chunks</span><span>{response.citations.length} citations</span><span>{response.runtime}</span></div>}
            </div>
          </div>
          <div className="border-t border-white/8 p-4"><div className="flex gap-2"><textarea aria-label="Ask the RAG assistant" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(); } }} rows={2} className="min-h-12 flex-1 resize-none rounded-md border border-white/10 bg-[#090c12] px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/40" placeholder="Ask about company policy…" /><button aria-label="Send question" onClick={() => ask()} disabled={running || !query.trim()} className="flex size-12 items-center justify-center self-end rounded-md bg-cyan-300 text-slate-950 hover:bg-cyan-200 disabled:opacity-50"><ArrowUp size={17} /></button></div></div>
        </Panel>
        <Panel>
          <div className="border-b border-white/8 px-5 py-4"><div className="text-sm font-medium">Try a high-signal question</div><div className="mt-1 text-xs text-slate-500">Switch versions and repeat the same question to expose behavioral differences.</div></div>
          <div className="grid gap-2 p-3 sm:grid-cols-2">
            {playgroundPrompts.map((prompt) => <button key={prompt.label} onClick={() => ask(prompt.question, prompt.role)} className="rounded-md border border-white/8 bg-white/[.02] p-3 text-left hover:border-cyan-400/20 hover:bg-cyan-400/5"><div className="text-[10px] uppercase tracking-wide text-slate-600">{prompt.label}</div><div className="mt-1.5 text-xs leading-5 text-slate-300">{prompt.question}</div></button>)}
          </div>
        </Panel>
      </div>

      <div className="space-y-5">
        {error && <div role="alert" className="rounded-md border border-red-400/25 bg-red-400/8 px-4 py-3 text-sm text-red-200">{error}</div>}
        <Panel>
          <div className="border-b border-white/8 px-5 py-4"><div className="text-sm font-medium">RAG execution trace</div><div className="mt-1 text-xs text-slate-500">Inspectable operations, not hidden reasoning</div></div>
          <div className="divide-y divide-white/6">
            {(response?.steps ?? []).map((step, index) => <div key={step.name} className="flex gap-3 px-5 py-3.5"><div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${step.status === "passed" ? "border-emerald-400/30 bg-emerald-400/8 text-emerald-300" : step.status === "failed" ? "border-red-400/30 bg-red-400/8 text-red-300" : "border-amber-400/30 bg-amber-400/8 text-amber-300"}`}>{step.status === "passed" ? <Check size={11} /> : step.status === "failed" ? <X size={11} /> : <Sparkles size={10} />}</div><div><div className="text-xs font-medium text-slate-300">{index + 1}. {step.name}</div><div className="mt-1 text-[11px] leading-4 text-slate-500">{step.detail}</div></div></div>)}
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4"><div><div className="text-sm font-medium">Retrieved context</div><div className="mt-1 text-xs text-slate-500">Actual Markdown chunks passed into answer construction</div></div><span className="font-mono text-xs text-slate-500">{response?.retrieved.length ?? 0}</span></div>
          <div className="max-h-[490px] space-y-3 overflow-auto p-4">
            {(response?.retrieved ?? []).map((doc) => <div key={`${doc.id}-${doc.excerpt}`} className={`rounded-md border p-4 ${doc.allowed ? "border-white/8 bg-white/[.02]" : "border-red-400/30 bg-red-400/6"}`}><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-medium">{doc.allowed ? <FileText size={14} className="text-slate-500" /> : <LockKeyhole size={14} className="text-red-300" />}{doc.title}</div><div className="mt-1 font-mono text-[10px] text-slate-600">{doc.id}</div></div>{!doc.allowed && <span className="rounded border border-red-400/20 bg-red-400/8 px-2 py-0.5 text-[9px] uppercase tracking-wide text-red-300">unauthorized</span>}</div><p className="mt-3 text-xs leading-5 text-slate-400">{doc.excerpt}</p><div className="mt-3 flex justify-between font-mono text-[10px]"><span className={doc.allowed ? "text-slate-600" : "text-red-300"}>{doc.access}</span><span className="text-slate-600">BM25 {doc.score.toFixed(3)}</span></div></div>)}
            {(response?.retrieved.length ?? 0) === 0 && <div className="py-12 text-center"><ShieldAlert size={20} className="mx-auto text-slate-700" /><div className="mt-2 text-xs text-slate-500">No context was retrieved or exposed.</div></div>}
          </div>
        </Panel>
        <Panel className="p-4"><div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-slate-500"><Braces size={12} />Active configuration</div><div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500"><div className="rounded border border-white/6 p-2">topK <span className="float-right text-slate-300">{versions[version].config.topK}</span></div><div className="rounded border border-white/6 p-2">access filter <span className={`float-right ${versions[version].config.accessControlEnabled ? "text-emerald-300" : "text-red-300"}`}>{String(versions[version].config.accessControlEnabled)}</span></div><div className="rounded border border-white/6 p-2">retriever <span className="float-right text-slate-300">BM25</span></div><div className="rounded border border-white/6 p-2">generation <span className="float-right text-slate-300">GPT-4.1 mini</span></div></div></Panel>
      </div>
    </div>
  </div>;
}
