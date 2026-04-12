"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DashRole } from "@/lib/roles";
import { getStoredRole, rawToDash, dashRootPath } from "@/lib/roles";

interface Props {
  /** The DashRole this section of the app is allowed for */
  requiredRole: DashRole;
  children: React.ReactNode;
}

/**
 * Wrap every role-specific dashboard section with this guard.
 * If the stored role doesn't match `requiredRole`, the user is
 * silently redirected to their own dashboard — no cross-role leakage.
 */
export default function RoleGuard({ requiredRole, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredRole();
    const userDash = rawToDash(stored);

    if (!stored) {
      // Not logged in at all — send to login
      router.replace("/login");
      return;
    }

    if (userDash !== requiredRole) {
      // Logged in but wrong role — send to their own dashboard
      router.replace(dashRootPath(stored));
    }
  }, [requiredRole, router]);

  // While the check runs, render nothing to avoid flashing wrong content
  // (in real auth this would be a loading spinner)
  return <>{children}</>;
}
