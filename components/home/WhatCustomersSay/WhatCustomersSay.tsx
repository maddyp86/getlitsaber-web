import TikTokRail, { TikTokVideo } from "./TikTokRail";
import { mediaUrl } from "@/lib/media";


const VIDEOS: TikTokVideo[] = [
  { url: "https://www.tiktok.com/@getlitsaber/video/7599752282464455967", thumbnail: mediaUrl("reviews/review1.jpg"), caption: "", views: "" },
  { url: "https://www.tiktok.com/@getlitsaber/video/7581564990033890590", thumbnail: mediaUrl("reviews/review2.jpg"), caption: "", views: "" },
  { url: "https://www.tiktok.com/@getlitsaber/video/7630952753501703455", thumbnail: mediaUrl("reviews/review3.jpg"), caption: "", views: "" },
  { url: "https://www.tiktok.com/@getlitsaber/video/7613414053091839262", thumbnail: mediaUrl("reviews/review4.jpg"), caption: "", views: "" },
  { url: "https://www.tiktok.com/@getlitsaber/video/7578956594189274399", thumbnail: mediaUrl("reviews/review5.jpg"), caption: "", views: "" },
  { url: "https://www.tiktok.com/@getlitsaber/video/7561515341424135454", thumbnail: mediaUrl("reviews/review6.jpg"), caption: "", views: "" },
];

export default function WhatCustomersSay() {
  return (
    <section
      className="relative overflow-hidden py-section-y-mobile lg:py-section-y"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, rgba(0,229,255,0.10), transparent 55%), #04070d",
      }}
    >
      <div className="flex flex-col items-center gap-3 text-center px-content mb-14">
        <span
          className="font-label text-eyebrow uppercase tracking-widest text-accent-cyan"
          style={{ textShadow: "0 0 14px rgba(0,229,255,0.55)" }}
        >
          REVIEWS
        </span>
        <h2
          className="font-display uppercase text-text-primary leading-tight"
          style={{
            fontSize: "clamp(45px, 5vw, 75px)",
            fontWeight: "700",
            textShadow: "0 0 28px rgba(0,229,255,0.40), 0 0 60px rgba(0,229,255,0.18)",
            lineHeight: "normal",
          }}
        >
          AS SEEN ON TIKTOK
        </h2>
       <p className="font-body text-[16px] text-body text-text-muted">{`See what we've been up to lately!`}</p>
      </div>

      <TikTokRail videos={VIDEOS} />
    </section>
  );
}
