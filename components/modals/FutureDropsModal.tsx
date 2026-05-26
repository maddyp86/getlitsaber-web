"use client";

import Modal from "@/components/layout/Modal";
import WaitlistForm from "@/components/forms/WaitlistForm";
import { useActiveModal, useModalActions } from "@/lib/ui/store";

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
        source="editions-futuredrops-modal"
        headline="Get $10 Off Your First Litsaber"
        copy="Plus early access to the Gold Edition drop and festival giveaways. No spam. Just the good stuff."
        buttonLabel="GET NOTIFIED"
      />
    </Modal>
  );
}
