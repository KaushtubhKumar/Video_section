import Link from "next/link";

const NAV_ICONS = [
  { label: "Home", href: "/", path: "M2 7.2 8 2.3l6 4.9V13a.8.8 0 0 1-.8.8h-3V9.6H5.8v4.2h-3A.8.8 0 0 1 2 13V7.2Z" },
  { label: "Search", href: "#", path: "M11.2 11.2 14 14M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z" },
  { label: "Tags", href: "#", path: "M2 2h5.6L14 8.4 8.4 14 2 7.6V2Z M5 5.3h.01" },
  { label: "Downloads", href: "#", path: "M8 2v8m0 0-3-3m3 3 3-3M2.5 12.5h11v1.5h-11z" },
  { label: "Tasks", href: "#", path: "M3 4h10M3 8h10M3 12h6" },
  { label: "Filters", href: "#", path: "M2 3h12M4.5 8h7M7 13h2" },
  { label: "Pin", href: "#", path: "M8 2v4l3 2-2 1v3.5L8 14l-1-1.5V9L5 8l3-2Z" },
  { label: "Folders", href: "#", path: "M2 4.5h4l1.2 1.5H14v6.5a.8.8 0 0 1-.8.8H2.8a.8.8 0 0 1-.8-.8V4.5Z" },
  { label: "Inbox", href: "#", path: "M2 8h3.2l1 2h3.6l1-2H14M2 8v4.2c0 .4.36.8.8.8h10.4c.44 0 .8-.36.8-.8V8M2 8l2-5h8l2 5" },
  { label: "Cart", href: "#", path: "M2 2h1.6l1 8.4a1.2 1.2 0 0 0 1.2 1h6.4a1.2 1.2 0 0 0 1.2-1L14.6 5H4" },
];

export function Sidebar() {
  return (
    <aside className="group fixed inset-y-0 left-0 z-30 hidden w-[64px] flex-col overflow-hidden border-r border-border bg-bg-elevated/90 backdrop-blur-xl transition-[width] duration-300 ease-out hover:w-[220px] hover:shadow-[8px_0_32px_rgba(0,0,0,0.45)] sm:flex">
      <Link
        href="/"
        className="flex h-[60px] w-full shrink-0 items-center gap-3 border-b border-border px-[15px]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-hover to-[#a78bfa] text-[16px]">
          🦆
        </span>
        <span className="whitespace-nowrap text-[15px] font-semibold text-primary opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
          AI Tools
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 py-4">
        {NAV_ICONS.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            title={item.label}
            className={`group/item relative mx-2 flex h-10 shrink-0 items-center gap-3 rounded-md px-[13px] transition-colors ${
              i === 4
                ? "bg-bg-hover text-primary"
                : "text-muted hover:bg-bg-hover/60 hover:text-secondary"
            }`}
          >
            {i === 4 && (
              <span className="absolute left-0 h-4 w-[2px] -translate-x-2 rounded-full bg-accent-hover" />
            )}
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d={item.path} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="whitespace-nowrap text-[14px] font-medium opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-3 border-t border-border px-[15px] py-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-hover text-[11px] font-semibold text-secondary">
          ?
        </span>
        <span className="whitespace-nowrap text-[13px] text-muted opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
          Help & support
        </span>
      </div>
    </aside>
  );
}