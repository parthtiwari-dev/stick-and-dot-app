import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getDevAccount, isDevAuthEnabled } from "@/lib/dev-accounts";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  if (!isDevAuthEnabled()) {
    return NextResponse.json({ error: "Dev auth is disabled." }, { status: 404 });
  }

  const { key } = await request.json().catch(() => ({ key: "" }));
  const account = getDevAccount(String(key));

  if (!account || !account.password) {
    return NextResponse.json({ error: "Dev account is not configured." }, { status: 400 });
  }

  const { url, key: supabaseKey } = getSupabaseConfig();
  const response = NextResponse.json({ ok: true, next: account.next, role: account.role });

  const supabase = createServerClient(url, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  });

  if (error) {
    return NextResponse.json(
      { error: `Unable to sign in ${account.label}. Run npm run seed:dev and check dev env vars.` },
      { status: 401 }
    );
  }

  return response;
}
