import WaitlistForm from "@/components/forms/WaitlistForm";

export default function WaitlistCard() {
  return (
    <WaitlistForm
      list="gold"
      source="pdp-gold-waitlist"
      headline="Gold Edition Drops Soon"
      copy="Be the first to know. Get 24hr early access and first pick before it opens to the public."
      buttonLabel="GET NOTIFIED"
    />
  );
}
