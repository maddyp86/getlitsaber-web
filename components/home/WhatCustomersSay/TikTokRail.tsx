"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

export interface TikTokVideo {
  url: string;
  thumbnail?: string;
  caption?: string;
  views?: string;
}

const HANDLE = "@getlitsaber";

function extractId(url: string): string {
  return (url.match(/\/video\/(\d+)/) ?? [])[1] ?? "";
}

function playerSrc(id: string): string {
  return `https://www.tiktok.com/player/v1/${id}?rel=0&native_context_menu=0&closed_caption=0&description=0&music_info=0`;
}

interface TikTokRailProps {
  videos: TikTokVideo[];
}

export default function TikTokRail({ videos }: TikTokRailProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeId, close]);

  const scrollRail = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 660), behavior: "smooth" });
  };

  return (
    <>
      <div className="relative max-w-content mx-auto">
        {/* Prev arrow */}
        <button
          onClick={() => scrollRail(-1)}
          aria-label="Previous"
          className="hidden lg:grid absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full place-items-center transition-all duration-200"
          style={{
            background: "rgba(4,7,13,0.70)",
            border: "1px solid rgba(0,229,255,0.18)",
            color: "#00E5FF",
            fontSize: "26px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#00E5FF";
            (e.currentTarget as HTMLButtonElement).style.color = "#04070d";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(0,229,255,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(4,7,13,0.70)";
            (e.currentTarget as HTMLButtonElement).style.color = "#00E5FF";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
          }}
        >
          ‹
        </button>

        {/* Scroll rail */}
        <div
          ref={railRef}
          className="flex gap-[22px] overflow-x-auto"
          style={{
            padding: "8px clamp(24px, 5vw, 72px) 22px",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {videos.map((video) => {
            const id = extractId(video.url);
            return (
              <VideoCard
                key={id || video.url}
                video={video}
                handle={HANDLE}
                onPlay={() => id && setActiveId(id)}
              />
            );
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={() => scrollRail(1)}
          aria-label="Next"
          className="hidden lg:grid absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full place-items-center transition-all duration-200"
          style={{
            background: "rgba(4,7,13,0.70)",
            border: "1px solid rgba(0,229,255,0.18)",
            color: "#00E5FF",
            fontSize: "26px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#00E5FF";
            (e.currentTarget as HTMLButtonElement).style.color = "#04070d";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(0,229,255,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(4,7,13,0.70)";
            (e.currentTarget as HTMLButtonElement).style.color = "#00E5FF";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
          }}
        >
          ›
        </button>
      </div>

      {activeId && <Lightbox id={activeId} onClose={close} />}
    </>
  );
}

interface VideoCardProps {
  video: TikTokVideo;
  handle: string;
  onPlay: () => void;
}

function VideoCard({ video, handle, onPlay }: VideoCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="relative flex-shrink-0 overflow-hidden rounded-2xl text-left cursor-pointer"
      style={{
        flex: "0 0 clamp(248px, 23vw, 300px)",
        aspectRatio: "9 / 16",
        scrollSnapAlign: "center",
        background: "#0a1018",
        border: `1px solid ${hovered ? "rgba(0,229,255,0.6)" : "rgba(0,229,255,0.18)"}`,
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 18px 50px rgba(0,0,0,0.6), 0 0 36px rgba(0,229,255,0.28)"
          : "none",
        transition: "transform 0.35s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.35s, border-color 0.35s",
      }}
      aria-label={video.caption || "Play TikTok video"}
      onClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {video.thumbnail ? (
        <Image
          src={video.thumbnail}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 248px, 300px"
        />
      ) : (
        <Placeholder />
      )}

      {/* Bottom scrim */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      {/* Views badge */}
      {video.views && (
        <span
          className="absolute top-3 right-3 font-mono text-xs text-white rounded-full px-2 py-1"
          style={{
            background: "rgba(4,7,13,0.6)",
            border: "1px solid rgba(0,229,255,0.18)",
            backdropFilter: "blur(4px)",
            letterSpacing: "0.05em",
          }}
        >
          ▶ {video.views}
        </span>
      )}

      {/* Play button */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: hovered ? "#00E5FF" : "rgba(4,7,13,0.55)",
          backdropFilter: "blur(4px)",
          border: "1.5px solid #00E5FF",
          boxShadow: hovered
            ? "0 0 40px rgba(0,229,255,0.85)"
            : "0 0 24px rgba(0,229,255,0.5)",
          transform: `translate(-50%, -50%) scale(${hovered ? 1.08 : 1})`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ width: 24, height: 24, fill: hovered ? "#04070d" : "#fff", marginLeft: 3 }}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      {/* Meta */}
      <span className="absolute left-0 right-0 bottom-0 p-4 block">
        <span
          className="block mb-1 font-mono text-xs text-accent-cyan"
          style={{ letterSpacing: "0.08em" }}
        >
          {handle}
        </span>
        {video.caption && (
          <span
            className="block text-sm leading-snug"
            style={{
              color: "#dfe6ee",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {video.caption}
          </span>
        )}
      </span>
    </button>
  );
}

function Placeholder() {
  return (
    <span
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(80% 60% at 50% 38%, rgba(0,229,255,0.22), transparent 60%), linear-gradient(150deg, #0c1622 0%, #06080f 55%, #120516 100%)",
      }}
    >
      <span
        className="absolute"
        style={{
          left: "50%",
          top: "18%",
          transform: "translateX(-50%)",
          width: 10,
          height: "64%",
          borderRadius: 8,
          opacity: 0.55,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.9), #00E5FF 30%, rgba(0,229,255,0.15))",
          boxShadow: "0 0 26px #00E5FF, 0 0 60px rgba(0,229,255,0.45)",
        }}
      />
    </span>
  );
}

interface LightboxProps {
  id: string;
  onClose: () => void;
}

function Lightbox({ id, onClose }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{
        background: "rgba(2,4,8,0.86)",
        backdropFilter: "blur(8px)",
        animation: "lsrFadeIn 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`@keyframes lsrFadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-5 w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-200"
        style={{
          background: "rgba(4,7,13,0.70)",
          border: "1px solid rgba(0,229,255,0.18)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#FF00E5";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 24px rgba(255,0,229,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(4,7,13,0.70)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
        }}
      >
        ×
      </button>

      <div
        className="overflow-hidden rounded-2xl"
        style={{
          width: "min(420px, 92vw)",
          aspectRatio: "9 / 16",
          maxHeight: "88vh",
          boxShadow: "0 0 60px rgba(0,229,255,0.25)",
        }}
      >
        <iframe
          key={id}
          src={playerSrc(id)}
          title="TikTok video"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
