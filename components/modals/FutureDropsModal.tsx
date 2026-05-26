"use client";

import Modal from "@/components/layout/Modal";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { useActiveModal, useModalActions } from "@/lib/ui/store";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

export default function FutureDropsModal() {
  const activeModal = useActiveModal();
  const { closeModal } = useModalActions();

  return (
    <Modal
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
      />
    </Modal>
  );
}
