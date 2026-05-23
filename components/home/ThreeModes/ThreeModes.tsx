import ThreeModesDesktop from "./ThreeModesDesktop";
import ThreeModesMobile from "./ThreeModesMobile";

export default function ThreeModes() {
  return (
    <>
      <ThreeModesDesktop className="hidden lg:block" />
      <ThreeModesMobile className="lg:hidden" />
    </>
  );
}
