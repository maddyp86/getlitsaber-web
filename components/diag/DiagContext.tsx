"use client";

import { createContext, useContext, type ReactNode } from "react";
import { EMPTY_DIAG, type DiagFlags } from "@/lib/diag";

const DiagContext = createContext<DiagFlags>(EMPTY_DIAG);

/** Read the active diagnostic kill-switch flags. Returns all-false in production use. */
export const useDiag = () => useContext(DiagContext);

export default function DiagProvider({
  value,
  children,
}: {
  value: DiagFlags;
  children: ReactNode;
}) {
  return <DiagContext.Provider value={value}>{children}</DiagContext.Provider>;
}
