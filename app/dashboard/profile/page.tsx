"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredRole, dashRootPath } from "@/lib/roles";

export default function ProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    const role = getStoredRole();
    router.replace(`${dashRootPath(role)}/profile`);
  }, [router]);
  return null;
}
