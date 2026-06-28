import ResponsiveMount from "@/components/primitives/ResponsiveMount";
import UnderTheHoodDesktop from "./UnderTheHoodDesktop";
import UnderTheHoodMobile from "./UnderTheHoodMobile";

export default function UnderTheHood() {
  return (
    <ResponsiveMount
      mobile={<UnderTheHoodMobile />}
      desktop={<UnderTheHoodDesktop />}
    />
  );
}
