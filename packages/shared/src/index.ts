export type Video = {
  id: string;
  slug: string;
  title: string;
  description: string;
  toolName: string;
  toolCategory: string;
  youtubeId: string;
  thumbnail: string;
  durationSeconds: number;
  views: number;
  likes: number;
  publishedAt: string; // ISO date
  author: { name: string; avatar: string };
  tags: string[];
  /** Deterministic fallback gradient shown if the thumbnail URL ever fails to load. */
  accent: string;
};

export type ChannelCategory = "official-lab" | "research" | "news" | "tools";

export type ChannelConfig = {
  /** Stable internal id used as a DB/join key */
  id: string;
  /** YouTube @handle — resolved to a channel_id (UC...) on first ingest run */
  handle: string;
  name: string;
  category: ChannelCategory;
};

/** 8x8 solid-gray base64 placeholder — swapped for the real image once it loads. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#151619"/></svg>'
  ).toString("base64");

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatViews(views: number) {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
  return `${views} views`;
}

export function formatRelativeDate(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
