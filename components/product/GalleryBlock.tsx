"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GALLERY_IMAGES } from "./productdisplay.content";

interface GalleryBlockProps {
  activeThumb: number;
  onThumbClick: (i: number) => void;
}

export default function GalleryBlock({ activeThumb, onThumbClick }: GalleryBlockProps) {
  const total = GALLERY_IMAGES.length;
  const active = GALLERY_IMAGES[activeThumb] ?? GALLERY_IMAGES[0];
  const activeIsVideo = active.type === "video";

  // Tap-to-zoom lightbox. Session review showed the single largest cluster of
  // dead clicks was people tapping the product/packaging image expecting a
  // zoom that did not exist. Only still images zoom; videos keep their own
  // controls.
  const [zoomed, setZoomed] = useState(false);
  // Portals target document.body, which only exists after mount on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Video playback. The main viewer used to render a bare metadata-only <video>
  // with no poster and no play affordance, so on the dark page it was an empty
  // black square that swallowed taps (dead clicks). Now the active clip shows
  // its own first frame (the `#t=0.1` fragment, same trick as the thumbnails),
  // a big play overlay makes the whole surface a play target while paused, and
  // selecting a video (thumbnail play badge or arrows) starts playback.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (!activeIsVideo) {
      setVideoPlaying(false);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    // Show the play overlay until playback actually begins.
    setVideoPlaying(false);
    // Navigating to a video is a user gesture, so play() is allowed. If a
    // browser still blocks it, the first frame + play overlay remain.
    const p = v.play();
    if (p !== undefined) p.catch(() => setVideoPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThumb, activeIsVideo]);

  function playVideo() {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p !== undefined) p.catch(() => {});
  }

  useEffect(() => {
    if (!zoomed) return;
    document.body.classList.add("scroll-locked");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("scroll-locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomed]);

  // Close the lightbox whenever the selected media changes away from an image.
  useEffect(() => {
    if (activeIsVideo) setZoomed(false);
  }, [activeIsVideo, activeThumb]);

  function prev() {
    onThumbClick((activeThumb - 1 + total) % total);
  }

  function next() {
    onThumbClick((activeThumb + 1) % total);
  }

  return (
    <>
    <div className="flex flex-col gap-3 w-full">
      {/* Main viewer — only the ACTIVE image is mounted. Previously all 24
          full-size images were rendered and eagerly loaded at once, decoding
          dozens of large bitmaps into memory and crashing mobile (iOS OOM).
          The browser caches each image after first view, so navigation stays
          fast without holding them all in memory. */}
      <div className="group relative w-full aspect-square rounded-card overflow-hidden">
        {activeIsVideo ? (
          <>
            <video
              key={active.src}
              ref={videoRef}
              // `#t=0.1` paints a real first frame under metadata-only preload,
              // so the viewer is never a blank black square (same as thumbs).
              src={`${active.src}#t=0.1`}
              aria-label={active.alt}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              onEnded={() => setVideoPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover bg-black"
            />
            {/* Play overlay — turns the whole surface into a play target while
                paused. Sits below the prev/next arrows (z-10) so navigation
                stays clickable; unmounts on play so native controls take over. */}
            {!videoPlaying && (
              <button
                type="button"
                onClick={playVideo}
                aria-label={`Play video: ${active.alt}`}
                className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/10 transition-colors cursor-pointer"
              >
                <span className="flex items-center justify-center w-[70px] h-[70px] rounded-full bg-black/60 text-white">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="8 5 19 12 8 19 8 5" />
                  </svg>
                </span>
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`Zoom image: ${active.alt}`}
            className="absolute inset-0 w-full h-full cursor-zoom-in"
          >
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              fill
              className="object-cover"
              sizes="(min-width: 600px) 50vw, 100vw"
              priority
            />
          </button>
        )}

        {/* Prev arrow */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white opacity-100 pointer-events-auto lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto transition-opacity hover:bg-black/70 z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white opacity-100 pointer-events-auto lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto transition-opacity hover:bg-black/70 z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Horizontal thumbnail strip — fixed 72px tiles, scrollable */}
      <div
        className="flex flex-row gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}
      >
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => onThumbClick(i)}
            aria-label={img.alt}
            className={`relative shrink-0 w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
              i === activeThumb
                ? "border-2 border-accent-cyan brightness-100"
                : "brightness-50 hover:brightness-100"
            }`}
          >
            {img.type === "video" ? (
              <>
                <video
                  src={`${img.src}#t=0.1`}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow">
                    <polygon points="8 5 19 12 8 19 8 5" />
                  </svg>
                </span>
              </>
            ) : (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="72px"
              />
            )}
          </button>
        ))}
      </div>
    </div>

      {/* Zoom lightbox — full-screen view of the active still image.
          Portaled to <body> so it escapes the gallery's sticky/transformed
          ancestors (which create stacking contexts that would trap a `fixed`
          overlay behind the navbar and let sibling content paint over it). */}
      {mounted && zoomed && !activeIsVideo && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed image: ${active.alt}`}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-age-gate flex items-center justify-center bg-black/[0.97] backdrop-blur-md p-4 cursor-zoom-out"
          style={{ touchAction: "manipulation" }}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="relative w-full h-full max-w-[1000px] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
