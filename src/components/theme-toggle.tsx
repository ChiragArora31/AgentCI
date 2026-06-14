"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("agentci-theme") as "dark" | "light" | null;
    const initial = saved ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = initial;
    queueMicrotask(() => setTheme(initial));
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("agentci-theme", next);
    document.documentElement.dataset.theme = next;
  }

  return <button aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={toggle} className="theme-toggle flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/[.03] text-slate-400 hover:bg-white/[.07] hover:text-slate-100">{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}</button>;
}
