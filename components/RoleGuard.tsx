"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashRole } from "@/lib/roles";
import { cacheSession, dashRootPath, rawToDash } from "@/lib/roles";
import { getCurrentProfile } from "@/lib/supabase/profile";

interface Props {
  /** The DashRole this section of the app is allowed for */
  requiredRole: DashRole;
  children: React.ReactNode;
}

/**
 * Wrap every role-specific dashboard section with this guard.
 * Supabase profile role is the source of truth for dashboard access.
 */
export default function RoleGuard({ requiredRole, children }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let alive = true;

    async function checkRole() {
      const { user, profile } = await getCurrentProfile().catch(() => ({
        user: null,
        profile: null,
      }));

      if (!alive) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      const role = profile?.role ?? "Writer";
      cacheSession({ role, name: profile?.name, email: profile?.email ?? user.email });

      if (rawToDash(role) !== requiredRole) {
        router.replace(dashRootPath(role));
        return;
      }

      setAllowed(true);
    }

    void checkRole();

    return () => {
      alive = false;
    };
  }, [requiredRole, router]);

  return allowed ? <>{children}</> : null;
}

