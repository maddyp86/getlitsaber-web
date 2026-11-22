import HydrationErrorTracker from "@/components/analytics/HydrationErrorTracker";
import CartDrawer from "@/components/layout/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EmailSignupBannerGuard from "@/components/global/EmailSignupBanner/EmailSignupBannerGuard";
import GoldWaitlistModal from "@/components/modals/GoldWaitlistModal";
import FutureDropsModal from "@/components/modals/FutureDropsModal";
import CartHydrator from "@/components/layout/CartHydrator";
import ToastContainer from "@/components/layout/ToastContainer";
import InteractionTimings from "@/components/debug/InteractionTimings";
import AnnouncementBar from "@/components/global/AnnouncementBar/AnnouncementBar";
import type { BarPhase } from "@/lib/campaign/types";

export default function SiteChrome({
  children,
  suppressChrome = false,
  barPhase = null,
  barHref = "/",
}: {
  children: React.ReactNode;
  suppressChrome?: boolean;
  /** The campaign bar phase to show, or null for no bar (the regular site). */
  barPhase?: BarPhase | null;
  barHref?: string;
}) {
  if (suppressChrome) {
    return <main>{children}</main>;
  }

  return (
    <>
      <HydrationErrorTracker />
      {barPhase && (
        <AnnouncementBar phaseId={barPhase.id} messages={barPhase.messages} href={barHref} />
      )}
      <Navbar />
      {/* --announce-h is 0 unless the bar is showing (app/globals.css). */}
      <main className="pt-[var(--announce-h)]">{children}</main>
      <EmailSignupBannerGuard />
      <Footer />
      <CartDrawer />
      <GoldWaitlistModal />
      <FutureDropsModal />
      <CartHydrator />
      <ToastContainer />
      <InteractionTimings />
    </>
  );
}
