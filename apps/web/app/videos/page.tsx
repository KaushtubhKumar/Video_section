import Link from "next/link";
import { VideoTable } from "@/components/videos/VideoTable";
import { Sidebar } from "@/components/videos/SIdebar";
import { Topbar } from "@/components/videos/Topbar";
import { getAllVideos } from "@/lib/videos-data";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getAllVideos();

  const channelCount = new Set(videos.map((v) => v.toolName)).size;
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const latest = [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];

  function formatCompact(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  }

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <Topbar />

      <main className="pt-[60px] sm:pl-[64px]">
        {/* Ambient field — ties the page together without a boring flat header */}
        <div className="relative overflow-hidden border-b border-border">
          <div
            className="pointer-events-none absolute -top-40 left-[8%] h-[26rem] w-[26rem] rounded-full opacity-[0.35] blur-[110px]"
            style={{ background: "radial-gradient(circle, #5e6ad2, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -top-24 right-[4%] h-[18rem] w-[18rem] rounded-full opacity-[0.22] blur-[100px]"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "linear-gradient(to bottom, black, transparent 80%)",
            }}
          />

          <div className="container relative py-10 sm:py-14">
            <div className="flex items-center gap-1.5 font-mono text-[13.5px] text-muted">
              <Link href="/" className="hover:text-secondary">Home</Link>
              <span>/</span>
              <span className="text-secondary">Videos</span>
            </div>

            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/80 py-1 pl-2 pr-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  <span className="font-mono text-[12.5px] font-medium uppercase tracking-[0.08em] text-secondary">
                    Feed updates hourly
                  </span>
                </div>

                <h1 className="text-[38px] font-bold leading-[1.05] tracking-[-0.02em] text-primary sm:text-[52px]">
                  Every AI tool,{" "}
                  <span className="bg-gradient-to-r from-accent-hover to-[#a78bfa] bg-clip-text text-transparent">
                    caught on camera
                  </span>
                </h1>
                <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-secondary">
                  {videos.length.toLocaleString()} walkthroughs pulled from {channelCount} creators —
                  ranked, timestamped, and sorted the way you'd want them.
                </p>
              </div>

              {/* Readout strip instead of flat stat cards */}
              <div className="flex gap-6 border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                <div>
                  <p className="font-mono text-[30px] font-bold leading-none tracking-tight text-primary">
                    {videos.length.toLocaleString()}
                  </p>
                  <p className="mt-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
                    Videos
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[30px] font-bold leading-none tracking-tight text-primary">
                    {channelCount}
                  </p>
                  <p className="mt-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
                    Channels
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[30px] font-bold leading-none tracking-tight text-primary">
                    {formatCompact(totalViews)}
                  </p>
                  <p className="mt-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
                    Total views
                  </p>
                </div>
              </div>
            </div>

            {latest && (
              <p className="mt-6 flex items-center gap-2 font-mono text-[13.5px] text-muted">
                <span className="h-1 w-1 rounded-full bg-accent-hover" />
                Newest: "{latest.title}" just landed from {latest.author.name}
              </p>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="container pb-24 pt-6">
          <VideoTable videos={videos} />
        </div>
      </main>
    </div>
  );
}