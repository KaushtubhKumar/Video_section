"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ICONS = [
  { label: "Home", href: "/", path: "M2 7.2 8 2.3l6 4.9V13a.8.8 0 0 1-.8.8h-3V9.6H5.8v4.2h-3A.8.8 0 0 1 2 13V7.2Z" },
  { label: "Search", href: "#", path: "M11.2 11.2 14 14M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z" },
  { label: "Deals", href: "#", path: "M2 2h5.6L14 8.4 8.4 14 2 7.6V2Z M5 5.3h.01" },
  { label: "Leaderboard", href: "#", path: "M4 14V8.5M8 14V2.5M12 14v-5" },
  { label: "Tasks", href: "#", path: "M2.5 2.5h11v1.5h-11z M4 8h5.5 M4 12h3", active: true },
  { label: "Mini tools", href: "#", path: "M9.8 2.2 13.8 6.2 6.6 13.4 2.6 9.4Z M9.8 4.6 11.4 6.2" },
  { label: "Characters", href: "#", path: "M8 8.8a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8ZM3 13.5c.6-2.6 2.5-4 5-4s4.4 1.4 5 4" },
  { label: "Map", href: "#", path: "M2 3.5 6 2l4 1.5 4-1.5v10.5l-4 1.5-4-1.5-4 1.5V3.5Z M6 2v10.5 M10 3.5V14" },
  { label: "Prompts", href: "#", path: "M4 2.5h6l2.5 2.5V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z M5 8h6 M5 10.5h4" },
];

const NAV_FOOTER = [
  { label: "Launch / Advertise", href: "#", path: "M8 2.5v11M2.5 8h11" },
  { label: "Newsletter", href: "#", path: "M2 4h12v8H2Z M2 4l6 5 6-5", external: true },
  { label: "Merchandise", href: "#", path: "M4 5.5V4a4 4 0 0 1 8 0v1.5M2.5 5.5h11l-1 8.5h-9Z" },
  { label: "Contact us", href: "#", path: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12ZM8 11v.01M8 5.5a1.6 1.6 0 0 1 1.6 1.6c0 1.1-1.6 1.1-1.6 2.4" },
];

export function Sidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [freeMode, setFreeMode] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] sm:hidden"
        />
      )}

      <aside
        className={`group fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col overflow-hidden border-r border-border bg-sidebar shadow-[0_1px_2px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out sm:z-30 sm:w-[64px] sm:translate-x-0 sm:bg-sidebar/95 sm:backdrop-blur-xl sm:duration-300 sm:hover:w-[240px] sm:hover:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.25)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[60px] w-full shrink-0 items-center gap-2 border-b border-border px-[15px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-muted">
            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="whitespace-nowrap font-mono text-[13.5px] text-secondary opacity-100 transition-opacity delay-100 duration-200 sm:opacity-0 sm:group-hover:opacity-100">
            Free mode
          </span>
          <button
            onClick={() => setFreeMode((v) => !v)}
            className={`relative ml-auto h-5 w-9 shrink-0 rounded-full opacity-100 transition-opacity delay-100 duration-200 sm:opacity-0 sm:group-hover:opacity-100 ${
              freeMode ? "bg-accent" : "bg-bg-hover"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                freeMode ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </button>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg-hover hover:text-primary sm:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-4">
        {NAV_ICONS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            title={item.label}
            className={`group/item relative mx-2 flex h-10 shrink-0 items-center gap-3 rounded-md px-[13px] transition-colors ${
              item.active
                ? "bg-bg-hover text-primary"
                : "text-muted hover:bg-bg-hover/60 hover:text-secondary"
            }`}
          >
            {item.active && (
              <span className="absolute left-0 h-4 w-[2px] -translate-x-2 rounded-full bg-accent-hover" />
            )}
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d={item.path} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="whitespace-nowrap text-[14px] font-medium opacity-100 transition-opacity delay-100 duration-200 sm:opacity-0 sm:group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        ))}

        <div className="mx-4 my-3 h-px shrink-0 bg-border" />

        {NAV_FOOTER.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            title={item.label}
            className="group/item relative mx-2 flex h-10 shrink-0 items-center gap-3 rounded-md px-[13px] text-muted transition-colors hover:bg-bg-hover/60 hover:text-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d={item.path} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="flex min-w-0 items-center gap-1 whitespace-nowrap text-[14px] font-medium opacity-100 transition-opacity delay-100 duration-200 sm:opacity-0 sm:group-hover:opacity-100">
              {item.label}
              {item.external && (
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path d="M6.5 4.5h5v5M11.3 4.7 4.7 11.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </Link>
        ))}
        </nav>
      </aside>
    </>
  );
}
