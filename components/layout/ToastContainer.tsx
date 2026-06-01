"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useToasts, useToastActions, type Toast } from "@/lib/toast/store";

export default function ToastContainer() {
  const toasts = useToasts();
  const { dismissToast } = useToastActions();
  const prefersReducedMotion = useReducedMotion();

  const slideVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        exit:    { opacity: 0, y: -8 },
      };

  return (
    /*
     * Outer wrapper: fixed position, z-toast (350), pointer-events none so it
     * never blocks page interaction. Each card re-enables pointer-events.
     *
     * The TWO inner aria-live regions are always mounted (stable wrappers) so
     * screen readers register them before any toasts appear. Toasts are inserted
     * into the matching region based on variant — "polite" for success,
     * "assertive" for error — giving reliable announcements without needing
     * role/aria-live on the motion elements themselves.
     */
    <div
      className="fixed top-6 inset-x-0 z-toast pointer-events-none flex flex-col items-center gap-2"
      aria-label="Notifications"
    >
      {/* Success live region — polite */}
      <div aria-live="polite" aria-atomic="false" className="sr-only">
        {toasts
          .filter((t) => t.variant === "success")
          .map((t) => (
            <span key={t.id}>{t.message}</span>
          ))}
      </div>

      {/* Error live region — assertive */}
      <div aria-live="assertive" aria-atomic="false" className="sr-only">
        {toasts
          .filter((t) => t.variant === "error")
          .map((t) => (
            <span key={t.id}>{t.message}</span>
          ))}
      </div>

      {/* Visual toasts */}
      <ul
        className="flex flex-col items-center gap-2 px-4 w-full"
        aria-hidden="true"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.li
              key={toast.id}
              layout
              initial={slideVariants.initial}
              animate={slideVariants.animate}
              exit={slideVariants.exit}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm"
            >
              <ToastCard toast={toast} onDismiss={dismissToast} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const isSuccess = toast.variant === "success";
  const accentColor = isSuccess ? "#00E5FF" : "#F56565";

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 rounded-card p-4 shadow-modal"
      style={{
        backgroundColor: "#110826",
        border: "1px solid rgba(240, 240, 245, 0.08)",
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-[1px]">
        {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
      </div>

      {/* Message */}
      <p
        className="flex-1 font-label text-text-primary leading-snug"
        style={{ fontSize: "13px" }}
      >
        {toast.message}
      </p>

      {/* Close */}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-sm"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function SuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#00E5FF" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#F56565" strokeWidth="1.5" />
      <path d="M8 4.5v4" stroke="#F56565" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="#F56565" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
