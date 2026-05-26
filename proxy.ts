import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";

type RawRole = "Writer" | "Reader" | "Subject Expert" | "Client";
type DashRole = "writer" | "reader" | "subject-expert" | "business";

function rawToDash(role: RawRole): DashRole {
  if (role === "Reader") return "reader";
  if (role === "Subject Expert") return "subject-expert";
  if (role === "Client") return "business";
  return "writer";
}

function dashRootPath(role: RawRole) {
  return `/dashboard/${rawToDash(role)}`;
}

function requiredRoleForPath(pathname: string): RawRole | null {
  if (pathname.startsWith("/dashboard/writer")) return "Writer";
  if (pathname.startsWith("/dashboard/reader")) return "Reader";
  if (pathname.startsWith("/dashboard/subject-expert")) return "Subject Expert";
  if (pathname.startsWith("/dashboard/business")) return "Client";
  return null;
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(cookie => {
    to.cookies.set(cookie);
  });
  return to;
}

async function withTimeout<T>(promise: PromiseLike<T>, ms = 4000) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<null>(resolve => {
    timeout = setTimeout(() => resolve(null), ms);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeoutPromise]);
  } catch {
    return null;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  if (!hasSupabaseConfig()) {
    return response;
  }

  const { url, key } = getSupabaseConfig();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const userResult = await withTimeout(supabase.auth.getUser());
  const user = userResult?.data.user ?? null;

  if (pathname === "/dashboard" || pathname === "/dashboard/profile" || pathname === "/dashboard/settings") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return copyCookies(response, NextResponse.redirect(url));
    }

    const profileResult = await withTimeout(supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle<{ role: RawRole }>());

    const role = profileResult?.data?.role ?? "Writer";
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/dashboard/profile"
        ? `${dashRootPath(role)}/profile`
        : pathname === "/dashboard/settings"
          ? `${dashRootPath(role)}/settings`
          : dashRootPath(role);
    url.search = "";
    return copyCookies(response, NextResponse.redirect(url));
  }

  const requiredRole = requiredRoleForPath(pathname);
  if (requiredRole) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return copyCookies(response, NextResponse.redirect(url));
    }

    const profileResult = await withTimeout(supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle<{ role: RawRole }>());

    const role = profileResult?.data?.role;
    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = "/signup/details";
      url.searchParams.set("email", user.email ?? "");
      return copyCookies(response, NextResponse.redirect(url));
    }

    if (role !== requiredRole) {
      const url = request.nextUrl.clone();
      url.pathname = dashRootPath(role);
      url.search = "";
      return copyCookies(response, NextResponse.redirect(url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
