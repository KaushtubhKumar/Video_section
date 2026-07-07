import fs from "fs";
import path from "path";
import type { Video } from "@video-module/shared";

/**
 * NOTE: JSON-file store — perfectly fine for a standalone Node server with a
 * persistent disk (a VM, a Docker volume, Railway/Render/Fly with a mounted
 * volume, etc.), unlike serverless platforms where disk doesn't persist.
 * Swap this file's internals for Postgres/Supabase if you later move the
 * server itself to serverless.
 */

const DATA_DIR = path.join(__dirname, "..", "data");
const VIDEOS_FILE = path.join(DATA_DIR, "videos.json");
const CHANNEL_IDS_FILE = path.join(DATA_DIR, "channel-ids.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readAllVideos(): Video[] {
  ensureDataDir();
  if (!fs.existsSync(VIDEOS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(VIDEOS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeAllVideos(videos: Video[]) {
  ensureDataDir();
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
}

/** Upsert by youtubeId — new videos get inserted, existing ones get their stats refreshed. */
export function upsertVideos(incoming: Video[]) {
  const existing = readAllVideos();
  const byYoutubeId = new Map(existing.map((v) => [v.youtubeId, v]));

  for (const video of incoming) {
    byYoutubeId.set(video.youtubeId, video);
  }

  const merged = Array.from(byYoutubeId.values());
  writeAllVideos(merged);
  return merged.length;
}

export function getKnownYoutubeIds(): Set<string> {
  return new Set(readAllVideos().map((v) => v.youtubeId));
}

/** Resolved @handle -> channel_id (UC...) cache, so we only call the resolve API once per channel ever. */
export function readChannelIdCache(): Record<string, string> {
  ensureDataDir();
  if (!fs.existsSync(CHANNEL_IDS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CHANNEL_IDS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function writeChannelIdCache(cache: Record<string, string>) {
  ensureDataDir();
  fs.writeFileSync(CHANNEL_IDS_FILE, JSON.stringify(cache, null, 2));
}
