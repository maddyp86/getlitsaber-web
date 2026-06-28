import ResponsiveMount from "@/components/primitives/ResponsiveMount";
import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

export default function Hero() {
  return (
    <ResponsiveMount mobile={<HeroMobile />} desktop={<HeroDesktop />} />
  );
}
