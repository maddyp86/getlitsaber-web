import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

export default function Hero() {
  return (
    <>
      <HeroDesktop className="hidden lg:block" />
      <HeroMobile className="lg:hidden" />
    </>
  );
}
