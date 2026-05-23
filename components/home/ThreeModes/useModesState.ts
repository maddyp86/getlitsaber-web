"use client";

import { useState, useCallback } from "react";

export interface UseModesStateResult {
  activeMode: 0 | 1 | 2;
  activePullBuild: 0 | 1;
  setMode: (n: 0 | 1 | 2) => void;
  togglePullBuild: () => void;
}

export function useModesState(): UseModesStateResult {
  const [activeMode, setActiveMode] = useState<0 | 1 | 2>(0);
  const [activePullBuild, setActivePullBuild] = useState<0 | 1>(0);

  const setMode = useCallback((n: 0 | 1 | 2) => {
    setActiveMode(n);
    setActivePullBuild(0);
  }, []);

  const togglePullBuild = useCallback(() => {
    setActivePullBuild((prev) => (prev === 0 ? 1 : 0));
  }, []);

  return { activeMode, activePullBuild, setMode, togglePullBuild };
}
