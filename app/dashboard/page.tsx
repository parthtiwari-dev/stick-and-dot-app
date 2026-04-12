"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredRole, dashRootPath } from "@/lib/roles";

export default function DashboardRoot() {
  const router = useRouter();
  useEffect(() => {
    const role = getStoredRole();
    router.replace(dashRootPath(role));
  }, [router]);
  return null;
}
