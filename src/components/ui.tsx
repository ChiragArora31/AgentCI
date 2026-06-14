import { Check, CircleAlert, ShieldAlert, X } from "@/components/icons";

export function StatusBadge({ status }: { status: "passed" | "failed" | "critical" | "running" | "promoted" | "blocked" | "production" }) {
  const styles = {
    passed: "border-emerald-400/20 bg-emerald-400/8 text-emerald-300",
    promoted: "border-emerald-400/20 bg-emerald-400/8 text-emerald-300",
    production: "border-cyan-400/20 bg-cyan-400/8 text-cyan-300",
    failed: "border-red-400/20 bg-red-400/8 text-red-300",
    blocked: "border-red-400/20 bg-red-400/8 text-red-300",
    critical: "border-red-400/30 bg-red-400/10 text-red-300",
    running: "border-amber-400/20 bg-amber-400/8 text-amber-300",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${styles[status]}`}>{status === "passed" || status === "promoted" ? <Check size={11} /> : status === "failed" || status === "blocked" ? <X size={11} /> : status === "critical" ? <ShieldAlert size={11} /> : status === "running" ? <CircleAlert size={11} /> : null}{status}</span>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-white/8 bg-[#0e1219] ${className}`}>{children}</section>;
}

export function MetricValue({ value, type = "percent" }: { value: number; type?: "percent" | "count" | "ms" | "cost" }) {
  if (type === "count") return <>{value}</>;
  if (type === "ms") return <>{value.toLocaleString()} ms</>;
  if (type === "cost") return <>${value.toFixed(3)}</>;
  return <>{value.toFixed(1)}%</>;
}
