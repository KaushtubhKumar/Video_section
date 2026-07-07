"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/videos/Sidebar";
import { Topbar } from "@/components/videos/Topbar";
import { MobileNav } from "@/components/videos/MobileNav";

export function VideosShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Topbar onMenuClick={() => setMenuOpen((v) => !v)} />

      <main className="pt-[60px] pb-20 sm:pb-0 sm:pl-[64px]">{children}</main>

      <MobileNav />
    </>
  );
}
