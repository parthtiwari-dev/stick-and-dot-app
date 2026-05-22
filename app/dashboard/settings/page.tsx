"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { dashRootPath } from "@/lib/roles";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default function SettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    getCurrentProfile()
      .then(({ profile }) => router.replace(`${dashRootPath(profile?.role ?? "Writer")}/settings`))
      .catch(() => router.replace("/login"));
  }, [router]);
  return null;
}
