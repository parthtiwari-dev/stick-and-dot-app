// Single source of truth for all role logic.
// Any file that needs roles imports from here. No more scattered mappings.

export type RawRole = "Writer" | "Reader" | "Subject Expert" | "Client";
export type DashRole = "writer" | "reader" | "subject-expert" | "business";

export const RAW_ROLES: RawRole[] = ["Writer", "Reader", "Subject Expert", "Client"];

let cachedRole: RawRole | null = null;
let cachedName = "";
let cachedEmail = "";

export function isRawRole(role: unknown): role is RawRole {
  return typeof role === "string" && (RAW_ROLES as string[]).includes(role);
}

export function normalizeRawRole(role: unknown): RawRole {
  return isRawRole(role) ? role : "Writer";
}

/** RawRole -> DashRole (used in URL paths) */
export function rawToDash(r: RawRole): DashRole {
  if (r === "Reader") return "reader";
  if (r === "Subject Expert") return "subject-expert";
  if (r === "Client") return "business";
  return "writer";
}

/** DashRole (from URL) -> RawRole */
export function dashToRaw(d: DashRole): RawRole {
  if (d === "reader") return "Reader";
  if (d === "subject-expert") return "Subject Expert";
  if (d === "business") return "Client";
  return "Writer";
}

/** RawRole -> the root path for that role's dashboard */
export function dashRootPath(r: RawRole): string {
  return `/dashboard/${rawToDash(r)}`;
}

/** Extract DashRole from a pathname, or null if not a role-specific path */
export function dashRoleFromPath(p: string): DashRole | null {
  if (p.startsWith("/dashboard/business")) return "business";
  if (p.startsWith("/dashboard/reader")) return "reader";
  if (p.startsWith("/dashboard/subject-expert")) return "subject-expert";
  if (p.startsWith("/dashboard/writer")) return "writer";
  return null;
}

/** Cache the current Supabase-backed profile for legacy synchronous consumers. */
export function cacheSession(input: { role?: unknown; name?: string | null; email?: string | null } | null): void {
  if (!input) {
    cachedRole = null;
    cachedName = "";
    cachedEmail = "";
    return;
  }

  cachedRole = normalizeRawRole(input.role);
  cachedName = input.name ?? "";
  cachedEmail = input.email ?? "";
}

/** Read the cached RawRole, defaulting to "Writer" while Supabase loads. */
export function getStoredRole(): RawRole {
  return cachedRole ?? "Writer";
}

export function getCachedProfile() {
  return {
    role: cachedRole,
    name: cachedName,
    email: cachedEmail,
  };
}

/** Returns true if a Supabase-backed session/profile is currently cached. */
export function hasSession(): boolean {
  return cachedRole !== null;
}

/** Clear all session data */
export function clearSession(): void {
  cacheSession(null);
}

