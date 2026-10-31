import { getImageProps } from "next/image";

interface ResponsiveImageProps {
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
  breakpoint?: string;
  className?: string;
  priority?: boolean;
  /** Rendered width, used to pick a file from each srcset. */
  sizes?: string;
}

/**
 * A paired mobile/desktop photo (different files per breakpoint) in a
 * <picture>. Both sources go through the Next image optimizer via
 * getImageProps, so they are served as AVIF/WebP at the width the screen
 * needs. This used to point the <picture> straight at the original Blob
 * JPGs, which PageSpeed measured at 358KB (phone) and 767KB (desktop) for
 * the homepage hero alone.
 */
export default function ResponsiveImage({
  mobileSrc,
  desktopSrc,
  alt,
  breakpoint = "1024px",
  className = "absolute inset-0 object-cover object-center w-full h-full",
  priority = false,
  sizes = "100vw",
}: ResponsiveImageProps) {
  const common = { alt, fill: true, sizes, priority };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktopSrc });
  const {
    props: { srcSet: mobileSrcSet, ...img },
  } = getImageProps({ ...common, src: mobileSrc });

  return (
    <picture className="absolute inset-0 block">
      <source media={`(min-width: ${breakpoint})`} srcSet={desktopSrcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...img} srcSet={mobileSrcSet} className={className} />
    </picture>
  );
}
