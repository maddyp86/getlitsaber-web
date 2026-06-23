"use client";

import { usePathname } from "next/navigation";
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

const CHROME_EXCLUDED_PATHS = ["/maintenance"];

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const exclude = CHROME_EXCLUDED_PATHS.includes(pathname);

  if (exclude) {
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
