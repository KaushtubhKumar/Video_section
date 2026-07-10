"use client";

import { useMemo, useState } from "react";
import type { Video, ToolCategory } from "@video-module/shared";
import { VideoFilters } from "./VideoFilters";
import { VideoTable } from "./VideoTable";

export function VideosPageClient({ videos }: { videos: Video[] }) {
  const [category, setCategory] = useState<"All" | ToolCategory>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesCategory = category === "All" || v.toolCategory === category;
      const matchesQuery =
        q.length === 0 ||
        v.title.toLowerCase().includes(q) ||
        v.toolName.toLowerCase().includes(q) ||
        v.author.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [videos, category, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="px-5 pt-5">
        <VideoFilters onChange={(state) => { setCategory(state.category); setQuery(state.query); }} />
      </div>
      {filtered.length === 0 ? (
        <div className="px-5 pb-10 pt-2 text-center text-[13.5px] text-muted">
          No videos match that filter.
        </div>
      ) : (
        <VideoTable videos={filtered} />
      )}
    </div>
  );
}