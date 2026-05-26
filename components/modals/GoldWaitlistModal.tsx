"use client";

import Modal from "@/components/layout/Modal";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { useActiveModal, useModalActions } from "@/lib/ui/store";

export default function GoldWaitlistModal() {
  const activeModal = useActiveModal();
  const { closeModal } = useModalActions();

  return (
    <Modal
      isOpen={activeModal === "gold"}
      onClose={closeModal}
      ariaLabel="Gold Edition waitlist"
    >
      <WaitlistForm
        list="gold"
        source="editions-gold-modal"
        eyebrow="/ GOLD EDITION — DROPS IN JUNE"
        headline="BE FIRST TO THE GOLD DROP"
        copy="1,000 units. Festival-season colorway. Waitlist members get 24-hour early access and first pick before it opens to everyone."
        buttonLabel="JOIN THE WAITLIST"
      />
    </Modal>
  );
}
