"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredRole, dashRootPath } from "@/lib/roles";

export default function SettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    const role = getStoredRole();
    router.replace(`${dashRootPath(role)}/settings`);
  }, [router]);
  return null;
}
