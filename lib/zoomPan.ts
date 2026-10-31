/** A touch that moves more than this many pixels is a drag, not a tap. */
export const DRAG_SLOP_PX = 6;

export interface ZoomOrigin {
  /** transform-origin, as a percentage of the frame (0 to 100). */
  x: number;
  y: number;
}

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Where the zoom origin moves when a finger drags a photo scaled by `zoom`
 * with `transform-origin` at `start`. A point p on the photo sits on screen
 * at O + zoom * (p - O); keeping p under the finger as it moves by dx means
 * the origin moves by -dx / (zoom - 1). So the photo follows the finger 1:1,
 * as photos do on a phone. Clamping to 0..100% keeps the photo filling the
 * frame at the edges.
 */
export function dragOrigin(
  start: ZoomOrigin,
  dx: number,
  dy: number,
  width: number,
  height: number,
  zoom: number
): ZoomOrigin {
  if (zoom <= 1 || width <= 0 || height <= 0) return start;
  return {
    x: clamp(start.x - (dx / width) * 100 / (zoom - 1)),
    y: clamp(start.y - (dy / height) * 100 / (zoom - 1)),
  };
}

/** Pinch limits. Below PINCH_COMMIT_ZOOM a released pinch springs back. */
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;
export const PINCH_COMMIT_ZOOM = 1.15;

/** Scale after the fingers move from `startDist` apart to `nowDist` apart. */
export function pinchScale(startScale: number, startDist: number, nowDist: number): number {
  if (startDist <= 0 || nowDist <= 0) return startScale;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (startScale * nowDist) / startDist));
}

/**
 * Where the zoom origin must sit so the photo point that was under the
 * fingers' midpoint when the pinch began is under their midpoint now, at the
 * new scale. A photo point p is on screen at s*p + (1 - s)*O, so p comes from
 * the starting state and O2 = (mid - s2*p) / (1 - s2). That one formula zooms
 * about the fingers and pans with them, from 1x or from an existing zoom.
 * Midpoints are in px relative to the frame's top-left corner.
 */
export function pinchOrigin(
  startOrigin: ZoomOrigin,
  startScale: number,
  newScale: number,
  midStart: { x: number; y: number },
  midNow: { x: number; y: number },
  width: number,
  height: number
): ZoomOrigin {
  if (newScale - 1 < 0.001 || startScale <= 0 || width <= 0 || height <= 0) return startOrigin;
  const axis = (o: number, size: number, m1: number, m2: number) => {
    const oPx = (o / 100) * size;
    const p = (m1 - (1 - startScale) * oPx) / startScale;
    return clamp((((m2 - newScale * p) / (1 - newScale)) / size) * 100);
  };
  return {
    x: axis(startOrigin.x, width, midStart.x, midNow.x),
    y: axis(startOrigin.y, height, midStart.y, midNow.y),
  };
}

type Size = { width: number; height: number };

/**
 * Carry a pinch from the gallery viewer (photo drawn object-cover) into the
 * lightbox (object-contain, a different frame). The zoom origin is the photo
 * point the pinch is fixed on, so it is mapped as a point on the photo, and
 * the scale is adjusted so the photo appears about as large as it did under
 * the fingers.
 */
export function handoffView(
  view: { scale: number; origin: ZoomOrigin },
  viewer: Size,
  lightbox: Size,
  photo: Size
): { scale: number; origin: ZoomOrigin } {
  if ([viewer, lightbox, photo].some((s) => s.width <= 0 || s.height <= 0)) return view;
  const cover = Math.max(viewer.width / photo.width, viewer.height / photo.height);
  const contain = Math.min(lightbox.width / photo.width, lightbox.height / photo.height);
  const vw = photo.width * cover;
  const vh = photo.height * cover;
  const lw = photo.width * contain;
  const lh = photo.height * contain;
  // Photo fraction under the viewer origin, then where that sits in the lightbox.
  const fx = ((view.origin.x / 100) * viewer.width - (viewer.width - vw) / 2) / vw;
  const fy = ((view.origin.y / 100) * viewer.height - (viewer.height - vh) / 2) / vh;
  return {
    scale: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (view.scale * cover) / contain)),
    origin: {
      x: clamp((((lightbox.width - lw) / 2 + fx * lw) / lightbox.width) * 100),
      y: clamp((((lightbox.height - lh) / 2 + fy * lh) / lightbox.height) * 100),
    },
  };
}
