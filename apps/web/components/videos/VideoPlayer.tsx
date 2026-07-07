"use client";

import { useState } from "react";
import { ThumbImage } from "./ThumbImage";

/**
 * Perf decisions here, in order of impact:
 * 1. Facade over live iframe — YouTube's embed JS (~500kb+) only loads on click,
 *    not on page load, so the details page itself stays fast.
 * 2. youtube-nocookie.com — skips the cookie-consent-adjacent request chain
 *    the standard embed domain kicks off, so the iframe starts faster too.
 * 3. A visible loading state between click and first frame — without it, the
 *    ~1-2s gap before YouTube's player paints reads as a broken click.
 */
export function VideoPlayer({
  youtubeId,
  thumbnail,
  toolName,
  accent,
  title,
}: {
  youtubeId: string;
  thumbnail: string;
  toolName: string;
  accent: string;
  title: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-border bg-black">
      {state !== "idle" && (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setState("ready")}
        />
      )}

      {state !== "ready" && (
        <button
          onClick={() => setState("loading")}
          className="group absolute inset-0 h-full w-full cursor-pointer disabled:cursor-default"
          aria-label={`Play video: ${title}`}
          disabled={state === "loading"}
        >
          <ThumbImage
            src={thumbnail}
            alt=""
            toolName={toolName}
            accent={accent}
            sizes="800px"
            priority
          />
          <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
          <span className="absolute inset-0 flex items-center justify-center">
            {state === "loading" ? (
              <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="#08090a">
                  <path d="M3 1.7a.7.7 0 0 1 1.06-.6l10.6 6.3a.7.7 0 0 1 0 1.2L4.06 14.9A.7.7 0 0 1 3 14.3V1.7Z" />
                </svg>
              </span>
            )}
          </span>
        </button>
      )}
    </div>
  );
}