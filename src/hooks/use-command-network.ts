"use client";

import { useCallback, useEffect, useState } from "react";
import { loadFleetOverview } from "@/lib/command-network/api";
import type { ApiState } from "@/lib/command-network/types";

export function useCommandNetwork(enabled: boolean) {
  const [state, setState] = useState<ApiState>({ status: enabled ? "loading" : "unconfigured" });
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => {
    setState({ status: "loading" });
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void loadFleetOverview(controller.signal).then(setState).catch((error: unknown) => {
      if (!controller.signal.aborted) {
        setState({ status: "error", message: error instanceof Error ? error.message : "Request failed." });
      }
    });
    return () => controller.abort();
  }, [enabled, refreshKey]);

  return { state, refresh };
}
