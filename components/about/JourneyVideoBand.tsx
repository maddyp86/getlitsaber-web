"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { VIDEO_SRC, VIDEO_POSTER_SRC, VIDEO_POSTER_ALT } from "./about.content";

export default function JourneyVideoBand() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Assembly video"
      style={{ height: "clamp(300px, 56vw, 810px)" }}
    >
      {VIDEO_SRC ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={VIDEO_POSTER_SRC}
          playsInline
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />
      ) : (
        <Image
          src={VIDEO_POSTER_SRC}
          alt={VIDEO_POSTER_ALT}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.35)" }}
        aria-hidden="true"
      />

      {/* Play / pause button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="group w-16 h-16 rounded-full border-2 border-white bg-[rgba(0,0,0,0.45)] backdrop-blur-sm flex items-center justify-center hover:border-accent-cyan hover:bg-[rgba(0,229,255,0.15)] transition-all duration-200"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white group-hover:text-accent-cyan transition-colors">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white group-hover:text-accent-cyan transition-colors ml-1">
              <path d="M6 4.5v15l13-7.5L6 4.5z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
