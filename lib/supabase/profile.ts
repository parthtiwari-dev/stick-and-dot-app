import type { User } from "@supabase/supabase-js";
import { cacheSession, normalizeRawRole, type RawRole } from "@/lib/roles";
import { createClient } from "./client";
import { normalizeDomain } from "./domains";

export const PROFILE_FILES_BUCKET = "profile-files";

export interface ProfileRecord {
  id: string;
  role: RawRole;
  name: string | null;
  email: string | null;
  mobile: string | null;
  domain: string | null;
  gender: string | null;
  dob: string | null;
  expertise_domains: string[] | null;
  credential_file_path: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface ProfileInput {
  role?: RawRole;
  name?: string | null;
  email?: string | null;
  mobile?: string | null;
  domain?: string | null;
  gender?: string | null;
  dob?: string | null;
  expertise_domains?: string[];
  credential_file_path?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
}

function clean(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function applyProfileCache(profile: ProfileRecord | null, user?: User | null) {
  if (!profile && !user) {
    cacheSession(null);
    return;
  }

  cacheSession({
    role: profile?.role,
    name: profile?.name ?? user?.user_metadata?.name ?? user?.email ?? "",
    email: profile?.email ?? user?.email ?? "",
  });
}

function uniqueDomains(input: Array<string | null | undefined>) {
  return [...new Set(input.map(normalizeDomain).filter(Boolean))];
}

async function syncProfileDomains(profileId: string, domains: string[] | undefined) {
  if (!domains) return;

  const supabase = createClient();
  const normalized = uniqueDomains(domains);

  const { error: deleteError } = await supabase
    .from("profile_domains")
    .delete()
    .eq("profile_id", profileId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (normalized.length === 0) return;

  const { error } = await supabase.from("profile_domains").insert(
    normalized.map(domain => ({
      profile_id: profileId,
      domain_name: domain,
    }))
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentProfile() {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    applyProfileCache(null, null);
    return { user: null, profile: null, error: userError?.message ?? null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle<ProfileRecord>();

  if (error) {
    return { user: userData.user, profile: null, error: error.message };
  }

  applyProfileCache(data, userData.user);
  return { user: userData.user, profile: data, error: null };
}

export async function upsertCurrentProfile(input: ProfileInput) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error(userError?.message ?? "You must be signed in to update your profile.");
  }

  const payload = {
    id: userData.user.id,
    role: normalizeRawRole(input.role ?? userData.user.user_metadata?.role),
    name: clean(input.name),
    email: clean(input.email ?? userData.user.email),
    mobile: clean(input.mobile),
    domain: clean(input.domain),
    gender: clean(input.gender),
    dob: clean(input.dob),
    expertise_domains: input.expertise_domains ? uniqueDomains(input.expertise_domains) : undefined,
    credential_file_path: clean(input.credential_file_path),
    avatar_url: clean(input.avatar_url),
    bio: clean(input.bio),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single<ProfileRecord>();

  if (error) {
    throw new Error(error.message);
  }

  await syncProfileDomains(data.id, payload.expertise_domains);
  applyProfileCache(data, userData.user);
  return data;
}

export async function updateCurrentProfile(input: ProfileInput) {
  const { profile } = await getCurrentProfile();
  const pick = <K extends keyof ProfileInput>(key: K) =>
    Object.prototype.hasOwnProperty.call(input, key) ? input[key] : profile?.[key];

  return upsertCurrentProfile({
    role: pick("role") ?? "Writer",
    name: pick("name") ?? null,
    email: pick("email") ?? null,
    mobile: pick("mobile") ?? null,
    domain: pick("domain") ?? null,
    gender: pick("gender") ?? null,
    dob: pick("dob") ?? null,
    expertise_domains: pick("expertise_domains") ?? undefined,
    credential_file_path: pick("credential_file_path") ?? null,
    avatar_url: pick("avatar_url") ?? null,
    bio: pick("bio") ?? null,
  });
}

export async function uploadProfileFile(file: File) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error(userError?.message ?? "You must be signed in to upload files.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${userData.user.id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from(PROFILE_FILES_BUCKET)
    .upload(path, file, { upsert: false });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}
