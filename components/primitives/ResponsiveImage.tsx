interface ResponsiveImageProps {
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
  breakpoint?: string;
  className?: string;
  priority?: boolean;
}

export default function ResponsiveImage({
  mobileSrc,
  desktopSrc,
  alt,
  breakpoint = "1024px",
  className = "absolute inset-0 object-cover object-center w-full h-full",
  priority = false,
}: ResponsiveImageProps) {
  return (
    <picture className="absolute inset-0 block">
      <source media={`(min-width: ${breakpoint})`} srcSet={desktopSrc} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mobileSrc}
        alt={alt}
        className={className}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
      />
    </picture>
  );
}
