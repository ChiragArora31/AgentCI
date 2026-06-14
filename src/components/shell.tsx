"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bot, Braces, GitCompareArrows, Home, Rocket, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/runs", label: "Runs", icon: Activity },
  { href: "/playground", label: "Playground", icon: Bot },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/failures", label: "Failures", icon: ShieldCheck },
  { href: "/deployments", label: "Deployments", icon: Rocket },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] border-r border-white/8 bg-[#0c0f15] lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-white/8 px-5">
          <div className="flex size-8 items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"><Braces size={17} /></div>
          <div><div className="font-semibold tracking-tight">AgentCI</div><div className="text-[10px] uppercase tracking-[.16em] text-slate-500">Reliability control</div></div>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${active ? "bg-white/8 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={16} className={active ? "text-cyan-300" : ""} />{label}</Link>;
          })}
        </nav>
        <div className="mt-auto border-t border-white/8 p-4">
          <div className="text-[10px] uppercase tracking-[.15em] text-slate-500">Monitored agent</div>
          <div className="mt-2 text-sm font-medium">Enterprise RAG Assistant</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400"><span className="size-1.5 rounded-full bg-emerald-400" />v1-production healthy</div>
        </div>
      </aside>
      <div className="lg:pl-[220px]">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/8 bg-[#090b10]/95 px-5 backdrop-blur lg:px-7">
          <div>
            <div className="text-xs text-slate-500">Agent / <span className="text-slate-300">Enterprise Knowledge Assistant</span></div>
            <div className="mt-0.5 text-sm font-medium">Release evaluation suite · 15 scenarios</div>
          </div>
          <div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300 sm:flex"><span className="size-1.5 rounded-full bg-emerald-400" />Real RAG pipeline</div><ThemeToggle /></div>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
