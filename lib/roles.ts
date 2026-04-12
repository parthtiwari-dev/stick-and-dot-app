// ─── Single source of truth for all role logic ───────────────────────────────
// Any file that needs roles imports from here. No more scattered mappings.

export type RawRole = "Writer" | "Reader" | "Subject Expert" | "Client";
export type DashRole = "writer" | "reader" | "subject-expert" | "business";

export const RAW_ROLES: RawRole[] = ["Writer", "Reader", "Subject Expert", "Client"];

/** RawRole (from signup/localStorage) → DashRole (used in URL paths) */
export function rawToDash(r: RawRole): DashRole {
  if (r === "Reader")         return "reader";
  if (r === "Subject Expert") return "subject-expert";
  if (r === "Client")         return "business";
  return "writer";
}

/** DashRole (from URL) → RawRole */
export function dashToRaw(d: DashRole): RawRole {
  if (d === "reader")         return "Reader";
  if (d === "subject-expert") return "Subject Expert";
  if (d === "business")       return "Client";
  return "Writer";
}

/** RawRole → the root path for that role's dashboard */
export function dashRootPath(r: RawRole): string {
  return `/dashboard/${rawToDash(r)}`;
}

/** Extract DashRole from a pathname, or null if not a role-specific path */
export function dashRoleFromPath(p: string): DashRole | null {
  if (p.startsWith("/dashboard/business"))       return "business";
  if (p.startsWith("/dashboard/reader"))         return "reader";
  if (p.startsWith("/dashboard/subject-expert")) return "subject-expert";
  if (p.startsWith("/dashboard/writer"))         return "writer";
  return null;
}

/** Read the stored RawRole from localStorage, defaulting to "Writer" */
export function getStoredRole(): RawRole {
  try {
    const r = localStorage.getItem("sd_role") as RawRole | null;
    if (r && (RAW_ROLES as string[]).includes(r)) return r;
  } catch (_) {}
  return "Writer";
}

/** Returns true if a session is currently stored */
export function hasSession(): boolean {
  try {
    return !!localStorage.getItem("sd_role");
  } catch (_) {
    return false;
  }
}

/** Clear all session data */
export function clearSession(): void {
  try {
    ["sd_role", "sd_name", "sd_email"].forEach(k => localStorage.removeItem(k));
  } catch (_) {}
}
