"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal, flushSync } from "react-dom";
import { GALLERY_IMAGES } from "./productdisplay.content";
import { useSwipe } from "@/lib/useSwipe";
import { usePinch, type PinchView } from "@/lib/usePinch";
import { dragOrigin, DRAG_SLOP_PX, handoffView, PINCH_COMMIT_ZOOM, type ZoomOrigin } from "@/lib/zoomPan";

interface GalleryBlockProps {
  activeThumb: number;
  onThumbClick: (i: number) => void;
}

type VideoState = "idle" | "loading" | "playing" | "error";
/** Lightbox zoom: where it is fixed and how far in. Null means fit. */
type Detail = ZoomOrigin & { scale: number };

// Main viewer and its hidden neighbour preloads must request the same srcset,
// so a preloaded image is a cache hit when it becomes active.
const VIEWER_SIZES = "(min-width: 600px) 50vw, 100vw";
const LIGHTBOX_ZOOM = 2.5;
// A pinch in the lightbox released below this goes back to fit.
const LIGHTBOX_FIT_BELOW = 1.05;
// The lightbox is at most 1000px wide. 150vw leaves headroom for the 2.5x
// zoom without asking a 3x phone for the 3840w file (200vw did): 1920w is a
// quarter of the pixels to decode, which phones do while the lightbox opens.
const LIGHTBOX_SIZES = "(min-width: 1000px) 1000px, 150vw";

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

  // The photo on screen loads first. Neighbour preloads and the video
  // thumbnails' preview frames wait until it has drawn, so on a slow
  // connection they never compete with it. Once true, stays true.
  const [primaryReady, setPrimaryReady] = useState(false);
  useEffect(() => {
    if (!primaryReady && (activeIsVideo || loadedSrc === active.src)) setPrimaryReady(true);
  }, [primaryReady, activeIsVideo, loadedSrc, active.src]);

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

  // Thumbnails are the original photos (up to 14MB; image optimization is off
  // site-wide), so each tile loads only once it is actually visible in the
  // strip, and none before the photo on screen has loaded. Chrome's native
  // lazy loading fetched ~8 off-screen tiles at once and starved the main
  // photo on a slow connection.
  const stripRef = useRef<HTMLDivElement>(null);
  const [seenThumbs, setSeenThumbs] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !primaryReady || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => Number((e.target as HTMLElement).dataset.thumb));
        if (visible.length)
          setSeenThumbs((prev) => {
            const nextSet = new Set(prev);
            visible.forEach((i) => nextSet.add(i));
            return nextSet;
          });
      },
      { root: strip, rootMargin: "0px 68px" }
    );
    strip.querySelectorAll("[data-thumb]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [primaryReady]);
  const thumbLoads = (i: number) => primaryReady && (seenThumbs.has(i) || i === activeThumb);

  // Video tiles fetch a few hundred KB each for their preview frame. Once the
  // gallery is off screen those downloads only compete with what the shopper
  // is looking at (on a phone connection they kept the PDP mode clips from
  // ever starting), so tile video loads stop while the strip is off screen and
  // resume when it comes back. Removing src alone does not cancel a media
  // fetch; load() with no source does.
  const [stripOnScreen, setStripOnScreen] = useState(true);
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setStripOnScreen(entry.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(strip);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (stripOnScreen) return;
    stripRef.current?.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      if (!v.getAttribute("src")) v.load();
    });
  }, [stripOnScreen]);
  const tileVideoLoads = (i: number) => stripOnScreen && thumbLoads(i);

  // Keep the active thumbnail in view when the slide changes by arrow or swipe.
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
  const [detail, setDetail] = useState<Detail | null>(null);
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

  function openZoom(initial: Detail | null = null) {
    openerRef.current = document.activeElement as HTMLElement | null;
    setDetail(initial);
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

  // Panning while zoomed. Mouse: the view follows the cursor. Touch: the
  // photo is dragged 1:1 under the finger. (Following the finger's absolute
  // position, as before, snapped the view to wherever a finger landed and
  // moved the photo against the drag.) Touch moves write transform-origin
  // straight to the zoom layer and commit to state on lift, so a drag does
  // not re-render the gallery on every move.
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; start: ZoomOrigin; now: ZoomOrigin; moved: boolean } | null>(null);
  const dragged = useRef(false);

  function toggleDetail(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    // Lifting a finger after a drag is not a tap: stay zoomed.
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    // Read the point now: React clears e.currentTarget once the handler
    // returns, so it must not be read inside a deferred state updater.
    setDetail(detail ? null : { ...originFrom(e), scale: LIGHTBOX_ZOOM });
  }

  function startPan(e: ReactPointerEvent<HTMLDivElement>) {
    dragged.current = false;
    if (!detail || e.pointerType === "mouse" || lightboxPinch.isPinching()) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: detail, now: detail, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function panDetail(e: ReactPointerEvent<HTMLDivElement>) {
    if (!detail) return;
    if (e.pointerType === "mouse") {
      setDetail({ ...originFrom(e), scale: detail.scale });
      return;
    }
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_SLOP_PX) return;
    d.moved = true;
    const r = e.currentTarget.getBoundingClientRect();
    d.now = dragOrigin(d.start, dx, dy, r.width, r.height, detail.scale);
    if (zoomLayerRef.current) zoomLayerRef.current.style.transformOrigin = `${d.now.x}% ${d.now.y}%`;
  }

  function endPan(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    dragged.current = true;
    setDetail((cur) => (cur ? { ...d.now, scale: cur.scale } : cur));
  }

  // Pinch in the lightbox: continuous zoom about the fingers, on top of the
  // tap toggle. Moves write to the zoom layer directly (no transition, so the
  // photo tracks the fingers) and the result commits to state on lift.
  function paintLayer(el: HTMLElement | null, view: PinchView | null, animate: boolean) {
    if (!el) return;
    el.style.transition = animate ? "" : "none";
    el.style.transform = `scale(${view ? view.scale : 1})`;
    el.style.transformOrigin = view ? `${view.origin.x}% ${view.origin.y}%` : "50% 50%";
  }

  const lightboxPinch = usePinch({
    enabled: zoomed,
    current: () => ({ scale: detail?.scale ?? 1, origin: detail ?? { x: 50, y: 50 } }),
    onStart: () => {
      drag.current = null;
    },
    onPinch: (v) => paintLayer(zoomLayerRef.current, v, false),
    onEnd: (v) => {
      const fit = v.scale < LIGHTBOX_FIT_BELOW;
      // Paint the final view too: if state does not change (fit to fit),
      // React would not undo the direct writes.
      paintLayer(zoomLayerRef.current, fit ? null : v, true);
      setDetail(fit ? null : { ...v.origin, scale: v.scale });
    },
  });

  // Pinch on the gallery photo itself: it zooms in place under the fingers.
  // Let go zoomed in and the lightbox opens at that zoom and spot; let go
  // near 1x and it springs back.
  const viewerZoomRef = useRef<HTMLDivElement>(null);
  const viewerPinch = usePinch({
    enabled: !activeIsVideo && !zoomed,
    current: () => ({ scale: 1, origin: { x: 50, y: 50 } }),
    onPinch: (v) => paintLayer(viewerZoomRef.current, v, false),
    onEnd: (v) => {
      const layer = viewerZoomRef.current;
      if (v.scale < PINCH_COMMIT_ZOOM || !layer) {
        paintLayer(layer, null, true);
        return;
      }
      const img = layer.querySelector("img");
      // The lightbox frame: max 1000px by 85vh inside a 16px padded overlay.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const view = handoffView(
        v,
        { width: layer.clientWidth, height: layer.clientHeight },
        { width: Math.min(1000, vw - 32), height: Math.min(vh * 0.85, vh - 32) },
        { width: img?.naturalWidth ?? 0, height: img?.naturalHeight ?? 0 }
      );
      paintLayer(layer, null, false);
      openZoom({ ...view.origin, scale: view.scale });
    },
  });

  // Only true neighbours: never wrap from the first slide to the last (the
  // last photos are the heaviest files), and nothing until the photo on
  // screen has loaded.
  const neighbours = !primaryReady
    ? []
    : [activeThumb > 0 ? prevIndex : -1, activeThumb < total - 1 ? nextIndex : -1].filter(
        (i) => i >= 0 && i !== activeThumb && GALLERY_IMAGES[i]?.type !== "video"
      );

  return (
    <>
    <div className="flex flex-col gap-3 w-full">
      {/* Main viewer: only the active image (plus hidden neighbour preloads) is
          mounted. Rendering all 28 full-size images at once used to crash
          mobile Safari (OOM). */}
      <div
        className="group relative w-full aspect-[4/3] lg:aspect-square rounded-card overflow-hidden bg-black"
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
              // A failed play also fires "pause"; keep the error state then.
              onPause={(e) => setVideoState(e.currentTarget.error ? "error" : "idle")}
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
            ref={viewerPinch.ref}
            type="button"
            onClick={() => openZoom()}
            aria-label={`Zoom image: ${active.alt}`}
            className="absolute inset-0 w-full h-full cursor-zoom-in"
            {...viewerPinch.handlers}
          >
            <div
              ref={viewerZoomRef}
              className="absolute inset-0 transition-transform duration-200 ease-out motion-reduce:transition-none"
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
            </div>
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
            className={`relative shrink-0 w-[60px] h-[60px] rounded-md overflow-hidden bg-surface-card-deep cursor-pointer transition-all duration-200 touch-manipulation ${
              i === activeThumb
                ? "border-2 border-accent-cyan brightness-100"
                : "brightness-50 hover:brightness-100"
            }`}
          >
            {img.type === "video" ? (
              <>
                <video
                  // Preview frame only after the photo on screen has loaded,
                  // and only while the strip is on screen.
                  src={tileVideoLoads(i) ? `${img.src}#t=0.1` : undefined}
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
              thumbLoads(i) && <Image src={img.src} alt="" fill className="object-cover" sizes="72px" />
            )}
          </button>
        ))}
      </div>
    </div>

      {/* Lightbox: full-screen view of the active still image. Tap the image to
          zoom in at that point (move to pan), tap again to zoom out, or pinch
          to any zoom up to 4x; tap the
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
          // Solid black instead of 97% black + backdrop-blur: it looks the
          // same (the blur hid the page behind), but a full-screen backdrop
          // filter is costly to paint on iOS Safari.
          className="fixed inset-0 z-age-gate flex items-center justify-center bg-black p-4 cursor-zoom-out"
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
            ref={lightboxPinch.ref}
            style={{ touchAction: "none" }}
            onClick={toggleDetail}
            onClickCapture={lightboxPinch.handlers.onClickCapture}
            onPointerDown={(e) => {
              lightboxPinch.handlers.onPointerDown(e);
              startPan(e);
            }}
            onPointerMove={(e) => {
              lightboxPinch.handlers.onPointerMove(e);
              if (!lightboxPinch.isPinching()) panDetail(e);
            }}
            onPointerUp={(e) => {
              lightboxPinch.handlers.onPointerUp(e);
              endPan(e);
            }}
            onPointerCancel={(e) => {
              lightboxPinch.handlers.onPointerCancel(e);
              endPan(e);
            }}
          >
            <div
              ref={zoomLayerRef}
              className="absolute inset-0 transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={
                {
                  transform: `scale(${detail ? detail.scale : 1})`,
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
                sizes={LIGHTBOX_SIZES}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
