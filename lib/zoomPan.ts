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
