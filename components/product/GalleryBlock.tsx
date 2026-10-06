"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal, flushSync } from "react-dom";
import { GALLERY_IMAGES } from "./productdisplay.content";
import { useSwipe } from "@/lib/useSwipe";

interface GalleryBlockProps {
  activeThumb: number;
  onThumbClick: (i: number) => void;
}

type VideoState = "idle" | "loading" | "playing" | "error";

// Main viewer and its hidden neighbour preloads must request the same srcset,
// so a preloaded image is a cache hit when it becomes active.
const VIEWER_SIZES = "(min-width: 600px) 50vw, 100vw";
const LIGHTBOX_ZOOM = 2.5;

const ARROW_CLASS =
  "absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white opacity-100 pointer-events-auto lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto lg:focus-visible:opacity-100 lg:focus-visible:pointer-events-auto transition-opacity hover:bg-black/70 z-10 touch-manipulation";

export default function GalleryBlock({ activeThumb, onThumbClick }: GalleryBlockProps) {
  const total = GALLERY_IMAGES.length;
  const active = GALLERY_IMAGES[activeThumb] ?? GALLERY_IMAGES[0];
  const activeIsVideo = active.type === "video";
  const prevIndex = (activeThumb - 1 + total) % total;
  const nextIndex = (activeThumb + 1) % total;

  // Portals target document.body, which only exists after mount on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ─── Video ─────────────────────────────────────────────────────────────────
  // Clips never autoplay on selection by arrow or swipe (each is 3 to 12MB).
  // They play in place on the first tap of the overlay, or of a video
  // thumbnail (which shows a play icon, so it must play). The state is keyed
  // to the clip it belongs to, so switching clips resets it with no effect race.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<{ src: string; state: VideoState }>({ src: "", state: "idle" });
  const videoState: VideoState = video.src === active.src ? video.state : "idle";
  const setVideoState = useCallback((state: VideoState) => setVideo({ src: active.src, state }), [active.src]);

  function playVideo(retry = false) {
    const v = videoRef.current;
    if (!v) return;
    // Read the clip from the element, not this render's closure: after a
    // thumbnail tap the element is the newly selected clip.
    const src = v.dataset.src ?? "";
    setVideo({ src, state: "loading" });
    if (retry) v.load();
    const p = v.play();
    if (p !== undefined) {
      p.catch(() => {
        // If the media itself failed (network, blocked, unsupported), show the
        // error state; the element's own error event can fire before this
        // rejection, so never let the rejection overwrite it with "idle". A
        // play that was merely blocked or interrupted leaves the play button.
        setVideo({ src, state: v.error ? "error" : "idle" });
      });
    }
  }

  // ─── Main image loading ────────────────────────────────────────────────────
  // Neighbours are preloaded, so arrows and swipes are normally instant. If an
  // image is still loading after 250ms, show a spinner rather than a frozen
  // viewer (blank-while-loading is what drew repeated "Next" taps).
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    if (activeIsVideo) return;
    const t = setTimeout(() => setSlow(true), 250);
    return () => clearTimeout(t);
  }, [active.src, activeIsVideo]);
  const imageLoading = !activeIsVideo && loadedSrc !== active.src;

  // ─── Navigation ────────────────────────────────────────────────────────────
  const prev = useCallback(() => onThumbClick(prevIndex), [onThumbClick, prevIndex]);
  const next = useCallback(() => onThumbClick(nextIndex), [onThumbClick, nextIndex]);

  // Swipe on the main viewer (touch only). Off while a clip is playing, so
  // scrubbing the native seek bar never changes the slide.
  const swipe = useSwipe((dir) => (dir === "left" ? next() : prev()), videoState !== "playing");

  function selectThumb(i: number) {
    const target = GALLERY_IMAGES[i];
    if (target?.type !== "video") {
      onThumbClick(i);
      return;
    }
    // Render the clip synchronously so play() runs inside this tap: the clips
    // have sound, and browsers only allow unmuted playback from a user gesture.
    flushSync(() => onThumbClick(i));
    playVideo();
  }

  // Keep the active thumbnail in view when the slide changes by arrow or swipe.
  const stripRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const strip = stripRef.current;
    const thumb = strip?.querySelector<HTMLElement>(`[data-thumb="${activeThumb}"]`);
    if (!strip || !thumb) return;
    const s = strip.getBoundingClientRect();
    const t = thumb.getBoundingClientRect();
    if (t.left >= s.left && t.right <= s.right) return;
    strip.scrollTo({ left: strip.scrollLeft + (t.left - s.left) - (s.width - t.width) / 2, behavior: "smooth" });
  }, [activeThumb]);

  // ─── Lightbox ──────────────────────────────────────────────────────────────
  const [zoomed, setZoomed] = useState(false);
  const [detail, setDetail] = useState<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const stillIndices = GALLERY_IMAGES.map((img, i) => (img.type === "video" ? -1 : i)).filter((i) => i >= 0);
  const stepStill = useCallback(
    (dir: 1 | -1) => {
      const pos = stillIndices.indexOf(activeThumb);
      const nextPos = (pos + dir + stillIndices.length) % stillIndices.length;
      setDetail(null);
      onThumbClick(stillIndices[nextPos]);
    },
    // stillIndices is derived from static content
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeThumb, onThumbClick]
  );

  function openZoom() {
    openerRef.current = document.activeElement as HTMLElement | null;
    setDetail(null);
    setZoomed(true);
  }

  const closeZoom = useCallback(() => {
    setZoomed(false);
    setDetail(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!zoomed) return;
    document.body.classList.add("scroll-locked");
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
      else if (e.key === "ArrowRight") stepStill(1);
      else if (e.key === "ArrowLeft") stepStill(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        // Keep focus inside the lightbox.
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button"));
        const i = f.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("scroll-locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomed, closeZoom, stepStill]);

  // Close the lightbox if the selection moves to a video.
  useEffect(() => {
    if (activeIsVideo) setZoomed(false);
  }, [activeIsVideo]);

  const lightboxSwipe = useSwipe((dir) => stepStill(dir === "left" ? 1 : -1), detail === null);

  function originFrom(e: { clientX: number; clientY: number; currentTarget: HTMLElement }) {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
    };
  }

  function toggleDetail(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    // Read the point now: React clears e.currentTarget once the handler
    // returns, so it must not be read inside a deferred state updater.
    setDetail(detail ? null : originFrom(e));
  }

  function panDetail(e: ReactPointerEvent<HTMLDivElement>) {
    if (!detail) return;
    setDetail(originFrom(e));
  }

  const neighbours = [prevIndex, nextIndex].filter(
    (i, k, arr) => i !== activeThumb && arr.indexOf(i) === k && GALLERY_IMAGES[i]?.type !== "video"
  );

  return (
    <>
    <div className="flex flex-col gap-3 w-full">
      {/* Main viewer: only the active image (plus hidden neighbour preloads) is
          mounted. Rendering all 28 full-size images at once used to crash
          mobile Safari (OOM). */}
      <div
        className="group relative w-full aspect-square rounded-card overflow-hidden bg-black"
        style={{ touchAction: "pan-y" }}
        {...swipe}
      >
        {activeIsVideo ? (
          <>
            <video
              key={active.src}
              ref={videoRef}
              data-src={active.src}
              // `#t=0.1` paints a real first frame under metadata-only preload,
              // so the viewer is never a blank black square.
              src={`${active.src}#t=0.1`}
              poster={active.poster}
              aria-label={active.alt}
              controls={videoState === "playing"}
              playsInline
              preload="metadata"
              onPlaying={() => setVideoState("playing")}
              onWaiting={() => setVideoState("loading")}
              onPause={() => setVideoState("idle")}
              onEnded={() => setVideoState("idle")}
              onError={() => setVideoState("error")}
              className="absolute inset-0 w-full h-full object-cover bg-black"
            />
            {/* Play / loading / error overlay. The whole surface is the target
                until frames render; it sits under the arrows (z-10) so
                navigation stays clickable, and unmounts once playing so the
                native controls take over. */}
            {videoState !== "playing" && (
              <button
                type="button"
                onClick={() => playVideo(videoState === "error")}
                disabled={videoState === "loading"}
                aria-label={
                  videoState === "loading"
                    ? `Loading video: ${active.alt}`
                    : videoState === "error"
                      ? `Video could not load. Try again: ${active.alt}`
                      : `Play video: ${active.alt}`
                }
                aria-busy={videoState === "loading"}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/25 hover:bg-black/10 transition-colors cursor-pointer disabled:cursor-progress touch-manipulation"
              >
                <span className="flex items-center justify-center w-[70px] h-[70px] rounded-full bg-black/60 text-white">
                  {videoState === "loading" ? (
                    <span
                      className="w-8 h-8 rounded-full border-[3px] border-white/30 border-t-white animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  ) : videoState === "error" ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  )}
                </span>
                {videoState === "error" && (
                  <span className="font-label text-[12px] tracking-wider uppercase text-white bg-black/60 rounded px-3 py-1">
                    Video didn&rsquo;t load. Tap to retry
                  </span>
                )}
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={openZoom}
            aria-label={`Zoom image: ${active.alt}`}
            className="absolute inset-0 w-full h-full cursor-zoom-in"
          >
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              fill
              className="object-cover"
              sizes={VIEWER_SIZES}
              priority
              onLoad={() => setLoadedSrc(active.src)}
            />
            {imageLoading && slow && (
              <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="w-8 h-8 rounded-full border-[3px] border-white/30 border-t-white animate-spin motion-reduce:animate-none" />
              </span>
            )}
          </button>
        )}

        {/* Neighbour preloads: same sizes as the viewer, so the next arrow or
            swipe is a cache hit. Invisible and out of the accessibility tree. */}
        <div aria-hidden="true" className="absolute inset-0 opacity-0 pointer-events-none -z-10">
          {neighbours.map((i) => (
            <Image key={GALLERY_IMAGES[i].src} src={GALLERY_IMAGES[i].src} alt="" fill sizes={VIEWER_SIZES} loading="eager" />
          ))}
        </div>

        <button type="button" onClick={prev} aria-label="Previous image" className={`${ARROW_CLASS} left-3`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button type="button" onClick={next} aria-label="Next image" className={`${ARROW_CLASS} right-3`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip. A video thumbnail shows a play icon, so tapping it
          selects AND plays the clip. */}
      <div
        ref={stripRef}
        className="flex flex-row gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}
      >
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            data-thumb={i}
            onClick={() => selectThumb(i)}
            aria-label={img.type === "video" ? `Play video: ${img.alt}` : img.alt}
            aria-current={i === activeThumb ? "true" : undefined}
            className={`relative shrink-0 w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer transition-all duration-200 touch-manipulation ${
              i === activeThumb
                ? "border-2 border-accent-cyan brightness-100"
                : "brightness-50 hover:brightness-100"
            }`}
          >
            {img.type === "video" ? (
              <>
                <video
                  src={`${img.src}#t=0.1`}
                  poster={img.poster}
                  muted
                  playsInline
                  preload="metadata"
                  tabIndex={-1}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow" aria-hidden="true">
                    <polygon points="8 5 19 12 8 19 8 5" />
                  </svg>
                </span>
              </>
            ) : (
              <Image src={img.src} alt="" fill className="object-cover" sizes="72px" />
            )}
          </button>
        ))}
      </div>
    </div>

      {/* Lightbox: full-screen view of the active still image. Tap the image to
          zoom in at that point (move to pan), tap again to zoom out; tap the
          backdrop or press Escape to close; arrows, keys or swipe move between
          photos. Portaled to <body> so it escapes the gallery's sticky and
          transformed ancestors, which would trap a fixed overlay. */}
      {mounted && zoomed && !activeIsVideo && createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed image: ${active.alt}`}
          onClick={closeZoom}
          className="fixed inset-0 z-age-gate flex items-center justify-center bg-black/[0.97] backdrop-blur-md p-4 cursor-zoom-out"
          style={{ touchAction: detail ? "none" : "pan-y" }}
          {...lightboxSwipe}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeZoom();
            }}
            aria-label="Close zoom"
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {stillIndices.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepStill(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepStill(1);
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <div
            className={`relative w-full h-full max-w-[1000px] max-h-[85vh] overflow-hidden ${detail ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onClick={toggleDetail}
            onPointerMove={panDetail}
          >
            <div
              className="absolute inset-0 transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={
                {
                  transform: `scale(${detail ? LIGHTBOX_ZOOM : 1})`,
                  transformOrigin: detail ? `${detail.x}% ${detail.y}%` : "50% 50%",
                } as CSSProperties
              }
            >
              <Image
                key={active.src}
                src={active.src}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="(min-width: 1000px) 2000px, 200vw"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
