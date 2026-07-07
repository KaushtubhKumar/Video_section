import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { VideoCard } from "@/components/videos/VideoCard";
import {
  getVideoBySlug,
  getRelatedVideos,
  getLatestVideos,
  formatViews,
  formatRelativeDate,
} from "@/lib/videos-data";

// Data is fetched live from the server app on every request now, so this page
// renders dynamically instead of being statically generated at build time.
export const dynamic = "force-dynamic";

export default async function VideoDetailsPage({ params }: { params: { slug: string } }) {
  const video = await getVideoBySlug(params.slug);
  if (!video) notFound();

  const [related, latestRaw] = await Promise.all([
    getRelatedVideos(video, 4),
    getLatestVideos(5),
  ]);
  const latest = latestRaw.filter((v) => v.id !== video.id).slice(0, 4);

  return (
    <main className="noise-bg min-h-screen pb-24">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/videos" className="flex items-center gap-2 text-[13.5px] text-secondary hover:text-primary">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to videos
          </Link>
          <span className="text-[13.5px] font-medium text-secondary">Videos</span>
        </div>
      </header>

      <div className="container grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div>
          <VideoPlayer
            youtubeId={video.youtubeId}
            thumbnail={video.thumbnail}
            toolName={video.toolName}
            accent={video.accent}
            title={video.title}
          />

          <div className="mt-6">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-accent-hover">
              <span>{video.toolCategory}</span>
            </div>
            <h1 className="mt-2 text-[24px] font-semibold leading-snug tracking-tight text-primary sm:text-[28px]">
              {video.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent-hover">
                  {video.author.avatar}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-primary">{video.author.name}</p>
                  <p className="text-[12.5px] text-secondary">
                    {formatViews(video.views)} · {formatRelativeDate(video.publishedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M8 13.5s-5.5-3.3-5.5-7.2A3.1 3.1 0 0 1 8 4.4a3.1 3.1 0 0 1 5.5 1.9c0 3.9-5.5 7.2-5.5 7.2Z" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  {(video.likes / 1000).toFixed(1)}k
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Share
                </button>
                <Link
                  href="#"
                  className="rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  View {video.toolName} →
                </Link>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-secondary">
              {video.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 text-[12px] font-medium text-secondary"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Related */}
          <div className="mt-12">
            <h2 className="mb-5 text-[16px] font-semibold text-primary">
              More {video.toolCategory.toLowerCase()} videos
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
              {related.map((v, i) => (
                <VideoCard key={v.id} video={v} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: latest videos rail */}
        <aside>
          <h2 className="mb-4 text-[14px] font-semibold text-primary">Latest videos</h2>
          <div className="flex flex-col gap-1">
            {latest.map((v) => (
              <VideoCard key={v.id} video={v} variant="row" />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}