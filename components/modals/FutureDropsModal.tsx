"use client";

import ModalBase from "@/components/modals/ModalBase";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { useActiveModal, useModalActions } from "@/lib/ui/store";
import { useToastActions } from "@/lib/toast/store";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

export default function FutureDropsModal() {
  const activeModal = useActiveModal();
  const { closeModal } = useModalActions();
  const { addToast } = useToastActions();

  return (
    <ModalBase
      isOpen={activeModal === "general"}
      onClose={closeModal}
      ariaLabel="Future drops signup"
    >
      <WaitlistForm
        list="general"
        source={WAITLIST_SOURCES.editionsFuture}
        eyebrow="/ WHAT'S NEXT"
        headline="FIRST LOOK AT FUTURE DROPS"
        copy="New editions, colorways, and Litsaber Connect. Get on the list and see them before they go public."
        buttonLabel="GET NOTIFIED"
        onSuccess={() => {
          closeModal();
          addToast({ variant: "success", message: "You\u2019re in. We\u2019ll let you know about the next drop." });
        }}
        onError={(msg) => {
          addToast({ variant: "error", message: msg });
        }}
      />
    </ModalBase>
  );
}
