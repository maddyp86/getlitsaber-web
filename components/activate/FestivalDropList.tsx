"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";
import { useToastActions } from "@/lib/toast/store";

export default function FestivalDropList() {
  const { addToast } = useToastActions();

  return (
    <section className="border-t border-border-divider py-section-y-mobile lg:py-section-y bg-background-elevated">
      <div className="mx-auto w-full max-w-content px-content">

        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* Heading column */}
          <div className="flex-1 min-w-0 mb-8 lg:mb-0">
            <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan mb-3">
              STAY IN THE LOOP
            </p>
            <h2
              className="font-display font-bold uppercase leading-[1.05] text-white"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              FESTIVAL DROP LIST
            </h2>
            <p className="font-body text-body-sm text-text-secondary leading-relaxed mt-3 max-w-[420px]">
              New editions, colorways, and Litsaber Connect. First look before they go public.
            </p>
          </div>

          {/* Form column */}
          <div className="w-full lg:max-w-[420px] shrink-0">
            <WaitlistForm
              list="general"
              source={WAITLIST_SOURCES.activateDroplist}
              headline="GET NOTIFIED"
              copy="Drop your email. No spam, just the next release."
              buttonLabel="JOIN THE LIST"
              cardless
              onSuccess={() =>
                addToast({ variant: "success", message: "You\u2019re on the list. We\u2019ll reach out before the next drop." })
              }
              onError={(msg) => addToast({ variant: "error", message: msg })}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
