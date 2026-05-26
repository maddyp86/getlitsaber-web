"use client";

// TEMP: Phase 3c-2 test triggers — remove before Phase 3d commit
import { useModalActions } from "@/lib/ui/store";

export default function ModalTestTriggers() {
  const { openModal } = useModalActions();

  return (
    <div className="flex gap-4 justify-center px-4 py-8">
      <button
        onClick={() => openModal("gold")}
        className="px-4 py-2 font-label text-xs uppercase tracking-widest rounded-sm"
        style={{ background: "#1A0D33", border: "1px solid #9D5FFF", color: "#9D5FFF" }}
      >
        TEST: Open Gold Modal
      </button>
      <button
        onClick={() => openModal("general")}
        className="px-4 py-2 font-label text-xs uppercase tracking-widest rounded-sm"
        style={{ background: "#1A0D33", border: "1px solid #00E5FF", color: "#00E5FF" }}
      >
        TEST: Open General Modal
      </button>
    </div>
  );
}
