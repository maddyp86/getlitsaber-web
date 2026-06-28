import ResponsiveMount from "@/components/primitives/ResponsiveMount";
import ThreeModesDesktop from "./ThreeModesDesktop";
import ThreeModesMobile from "./ThreeModesMobile";

export default function ThreeModes() {
  return (
    <ResponsiveMount
      mobile={<ThreeModesMobile />}
      desktop={<ThreeModesDesktop />}
    />
  );
}
