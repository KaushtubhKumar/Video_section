"use client";

import { useState } from "react";
import Link from "next/link";

export function Topbar() {
  const [freeMode, setFreeMode] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-xl sm:left-[64px]">
      <div className="flex h-[60px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[14.5px] text-secondary sm:inline">Free mode</span>
          <button
            onClick={() => setFreeMode((v) => !v)}
            className={`relative hidden h-5 w-9 shrink-0 rounded-full transition-colors sm:block ${
              freeMode ? "bg-accent" : "bg-bg-hover"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                freeMode ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:justify-center sm:gap-3">
          <button className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-mono text-[14px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5.5 8.2 7.2 10l3.3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Tasks</span>
          </button>
          <button className="hidden items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-mono text-[14px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary sm:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M4 2.5h6l2.5 2.5V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Prompts
          </button>
          <button className="relative hidden items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-mono text-[14px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary sm:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M14 8 8.6 2.6a1 1 0 0 0-.7-.3H3a1 1 0 0 0-1 1v4.9c0 .27.1.52.3.7L7.7 14.4a1 1 0 0 0 1.4 0L14 9.4a1 1 0 0 0 0-1.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Deals
            <span className="absolute -top-2 -right-1.5 rounded-full bg-accent px-1.5 py-[1px] text-[10.5px] font-bold uppercase tracking-wide text-white">
              New
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-sm border border-border bg-bg-elevated px-3 py-1.5 text-secondary transition-colors hover:border-border-strong hover:text-primary md:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-[14px]">Search</span>
            <span className="ml-3 rounded border border-border px-1 py-0.5 font-mono text-[11.5px] text-muted">Ctrl+K</span>
          </button>
          <Link
            href="#"
            className="rounded-sm bg-accent px-3.5 py-1.5 font-mono text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}