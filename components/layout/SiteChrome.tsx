import AgeGateModal from "@/components/modals/AgeGateModal";
import CartDrawer from "@/components/layout/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EmailSignupBannerGuard from "@/components/global/EmailSignupBanner/EmailSignupBannerGuard";
import GoldWaitlistModal from "@/components/modals/GoldWaitlistModal";
import FutureDropsModal from "@/components/modals/FutureDropsModal";
import FloatingPromoPopup from "@/components/layout/FloatingPromoPopup";
import CartHydrator from "@/components/layout/CartHydrator";
import ToastContainer from "@/components/layout/ToastContainer";

export default function SiteChrome({
  children,
  suppressChrome = false,
}: {
  children: React.ReactNode;
  suppressChrome?: boolean;
}) {
  if (suppressChrome) {
    return <main>{children}</main>;
  }

  return (
    <>
      <AgeGateModal />
      <Navbar />
      <main>{children}</main>
      <EmailSignupBannerGuard />
      <Footer />
      <CartDrawer />
      <GoldWaitlistModal />
      <FutureDropsModal />
      <FloatingPromoPopup />
      <CartHydrator />
      <ToastContainer />
    </>
  );
}
