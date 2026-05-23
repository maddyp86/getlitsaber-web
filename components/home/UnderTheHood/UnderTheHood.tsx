import UnderTheHoodDesktop from "./UnderTheHoodDesktop";
import UnderTheHoodMobile from "./UnderTheHoodMobile";

export default function UnderTheHood() {
  return (
    <>
      <UnderTheHoodDesktop className="hidden lg:block" />
      <UnderTheHoodMobile className="lg:hidden" />
    </>
  );
}
