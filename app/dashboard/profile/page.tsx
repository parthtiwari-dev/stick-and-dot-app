"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function ProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    try {
      const r = localStorage.getItem("sd_role");
      if (r === "Reader")         return void router.replace("/dashboard/reader/settings");
      if (r === "Client")         return void router.replace("/dashboard/business/settings");
      if (r === "Subject Expert") return void router.replace("/dashboard/subject-expert/settings");
    } catch (_) {}
    router.replace("/dashboard/writer/settings");
  }, [router]);
  return null;
}
