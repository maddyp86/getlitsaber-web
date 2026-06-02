import WaitlistForm from "@/components/forms/WaitlistForm";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

export default function WaitlistCard() {
  return (
    <div className=" max-w-[600px]">
      <WaitlistForm
        list="gold"
        source={WAITLIST_SOURCES.pdpGold}
        headline="Gold Edition Drops Soon"
        copy="Be the first to know. Get 24hr early access and first pick before it opens to the public."
        buttonLabel="GET NOTIFIED"
      />
    </div>
  );
}
