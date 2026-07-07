import type { Video } from "./video-types";

export type { Video };
export { BLUR_DATA_URL, formatDuration, formatViews, formatRelativeDate } from "./video-types";

const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:4000";

/**
 * All data now comes from the server app (apps/server) over HTTP, instead of a
 * local file/mock. Function signatures kept identical to the original mock module
 * so no page/component needed to change beyond awaiting these (they're now async).
 *
 * `cache: "no-store"` because this is a fast-moving feed — Next's default fetch
 * caching would otherwise serve stale results across requests.
 */
async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[videos-data] failed to fetch ${path}:`, err);
    return null;
  }
}

export async function getTrendingVideos(limit = 4): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos?sort=trending&limit=${limit}`)) ?? [];
}

export async function getLatestVideos(limit = 6): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos?sort=latest&limit=${limit}`)) ?? [];
}

export async function getAllVideos(): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos?sort=latest`)) ?? [];
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  return fetchJson<Video>(`/api/videos/${slug}`);
}

export async function getRelatedVideos(video: Video, limit = 4): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos/${video.slug}/related?limit=${limit}`)) ?? [];
}
