import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { getVideoBySlug } from "@/lib/videos-data";

export const dynamic = "force-dynamic";

export default async function VideoDetailsPage({ params }: { params: { slug: string } }) {
  const video = await getVideoBySlug(params.slug);
  if (!video) notFound();

  return (
    <main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-[#050506] p-4">
      <div
        className="flex flex-col rounded-[22px] border border-white/[0.07] bg-[#0d0d10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
        style={{ maxWidth: "min(94vw, 1600px)", maxHeight: "100%" }}
      >
        {/* Title bar */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-5 sm:px-7">
          <p className="line-clamp-1 text-[15px] font-semibold text-white sm:text-[17px]">
            {video.title}
          </p>
          <Link
            href="/videos"
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
        </div>

        {/* Player — height-bound first, width follows 16:9, so it always fits between the bars */}
        <div className="min-h-0 flex-1 px-3 sm:px-4">
          <div className="relative mx-auto h-full max-w-full" style={{ aspectRatio: "16 / 9" }}>
            <VideoPlayer youtubeId={video.youtubeId} title={video.title} />
          </div>
        </div>

        {/* Bottom bar — mirrors the title bar so the card reads as a closed, complete frame */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-5 sm:px-7">
          <p className="line-clamp-1 text-[12.5px] text-white/50">{video.toolName}</p>
          <p className="shrink-0 text-[12.5px] uppercase tracking-[0.06em] text-white/40">
            {video.toolCategory}
          </p>
        </div>
      </div>
    </main>
  );
}