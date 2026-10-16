export type DemoRole = "headquarters" | "squadron-leader"

export const DEMO_SESSION_COOKIE = "aeropulse-demo-role"
export const DEMO_MODE_ENABLED =
  process.env.NEXT_PUBLIC_AEROPULSE_DEMO_MODE === "true" ||
  (process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_AEROPULSE_DEMO_MODE !== "false")

export function isDemoRole(role: unknown): role is DemoRole {
  return role === "headquarters" || role === "squadron-leader"
}
