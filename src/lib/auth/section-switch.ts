import type { DemoRole } from "./demo-session";

export function getSectionSwitchTarget(currentRole: DemoRole): { role: DemoRole; path: string } {
  return currentRole === "headquarters"
    ? { role: "squadron-leader", path: "/squadron" }
    : { role: "headquarters", path: "/headquarter" };
}
