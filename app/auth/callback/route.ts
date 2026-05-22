import { NextResponse } from "next/server";
import { dashRootPath, normalizeRawRole } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const role = normalizeRawRole(requestUrl.searchParams.get("role"));
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback`);
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.redirect(`${origin}/login?error=no_session`);
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle<{ role: string | null }>();

  const finalRole = normalizeRawRole(existingProfile?.role ?? role);

  if (!existingProfile) {
    await supabase.from("profiles").upsert({
      id: userData.user.id,
      role: finalRole,
      email: userData.user.email ?? null,
      name:
        typeof userData.user.user_metadata?.full_name === "string"
          ? userData.user.user_metadata.full_name
          : null,
      updated_at: new Date().toISOString(),
    });
  }

  const safeNext = next?.startsWith("/") ? next : dashRootPath(finalRole);
  return NextResponse.redirect(`${origin}${safeNext}`);
}

