import { GitCommitHorizontal, Rocket } from "lucide-react";
import { getDecision, getMetrics, versions, type VersionId } from "@/lib/eval";
import { Panel, StatusBadge } from "@/components/ui";

const history: VersionId[] = ["v4-release", "v3-improved", "v2-candidate", "v1-production"];

export default function DeploymentsPage() {
  return <div className="space-y-5"><div><div className="flex items-center gap-2 text-xs text-slate-500"><Rocket size={13} />Enterprise Knowledge Assistant</div><h1 className="mt-2 text-2xl font-semibold tracking-tight">Deployments</h1><p className="mt-1 text-sm text-slate-400">Version history and evaluation-backed release decisions.</p></div>
    <Panel className="overflow-hidden"><div className="grid grid-cols-[1.1fr_1.6fr_.7fr_.75fr_1fr] border-b border-white/8 bg-white/[.02] px-5 py-3 text-[10px] uppercase tracking-[.12em] text-slate-500"><div>Version</div><div>Change</div><div>Eval result</div><div>Decision</div><div>Time</div></div>
      <div className="divide-y divide-white/6">{history.map((id) => { const metrics = getMetrics(id); const decision = id === "v1-production" ? "production" : getDecision(id); return <div key={id} className="grid grid-cols-[1.1fr_1.6fr_.7fr_.75fr_1fr] items-center px-5 py-4 text-sm hover:bg-white/[.02]"><div className="flex items-center gap-2 font-mono text-xs"><GitCommitHorizontal size={13} className="text-slate-500" />{id}</div><div className="text-slate-300">{versions[id].changeSummary}</div><div className="font-mono text-xs">{metrics.passRate.toFixed(1)}%</div><div><StatusBadge status={decision} /></div><div className="text-xs text-slate-500">{versions[id].createdAt}</div></div>})}</div>
    </Panel>
    <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/5 p-4 text-sm text-cyan-100"><span className="font-medium">Release contract:</span> Every proposed version runs the same 15-scenario suite. Critical access-control or adversarial failures block promotion regardless of aggregate score.</div>
  </div>;
}
