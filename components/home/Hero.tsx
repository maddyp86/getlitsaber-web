import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

/**
 * Both variants are server-rendered and CSS picks one, unlike the other
 * homepage sections (ResponsiveMount). ResponsiveMount renders the mobile tree
 * first and swaps in desktop after hydration, so on desktop the hero photo,
 * the page's LCP element, was a new <img> that could only paint once React had
 * run: PageSpeed measured a 1.1s render delay. The hidden copy costs no
 * downloads: its photo is the same <picture> URL as the visible one, its lazy
 * poster is never fetched under display:none, and its video never mounts
 * because a hidden element never intersects (useNearViewportAfterLoad).
 */
export default function Hero() {
  return (
    <>
      <HeroMobile className="lg:hidden" />
      <HeroDesktop className="hidden lg:block" />
    </>
  );
}
