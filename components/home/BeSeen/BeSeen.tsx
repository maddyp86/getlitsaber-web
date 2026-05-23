import BeSeenDesktop from "./BeSeenDesktop";
import BeSeenMobile from "./BeSeenMobile";

export default function BeSeen() {
  return (
    <>
      <BeSeenDesktop className="hidden lg:block" />
      <BeSeenMobile className="lg:hidden" />
    </>
  );
}
