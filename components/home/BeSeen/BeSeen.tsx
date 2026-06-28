import ResponsiveMount from "@/components/primitives/ResponsiveMount";
import BeSeenDesktop from "./BeSeenDesktop";
import BeSeenMobile from "./BeSeenMobile";

export default function BeSeen() {
  return (
    <ResponsiveMount mobile={<BeSeenMobile />} desktop={<BeSeenDesktop />} />
  );
}
