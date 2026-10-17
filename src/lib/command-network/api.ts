import { normalizeFleetOverview } from "./adapter";
import type { ApiState } from "./types";

function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return value ? value.replace(/\/+$/, "") : null;
}

export async function loadFleetOverview(signal: AbortSignal): Promise<ApiState> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return { status: "unconfigured" };

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/fleet/overview`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    return { status: "error", message: "The AeroPulse API could not be reached." };
  }

  if (response.status === 401 || response.status === 403) {
    return { status: "unauthorized", message: "The API did not authorize this request." };
  }
  if (!response.ok) {
    return { status: "error", message: `Fleet overview request failed (${response.status}).` };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { status: "error", message: "Fleet overview returned invalid JSON." };
  }

  try {
    const overview = normalizeFleetOverview(payload);
    const fetchedAt = new Date().toISOString();
    return overview.aircraftTotal === 0
      ? { status: "empty", overview, fetchedAt }
      : { status: "ready", overview, fetchedAt };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Fleet overview could not be read.",
    };
  }
}
