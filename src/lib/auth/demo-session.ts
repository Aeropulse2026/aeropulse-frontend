export type DemoRole = "headquarters" | "squadron-leader"

export const DEMO_SESSION_COOKIE = "aeropulse-demo-role"
// This standalone copy is intentionally local-preview-first in every environment.
// Set the public flag to "false" only when integrating a real authentication flow.
export const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_AEROPULSE_DEMO_MODE !== "false"

export function isDemoRole(role: unknown): role is DemoRole {
  return role === "headquarters" || role === "squadron-leader"
}
