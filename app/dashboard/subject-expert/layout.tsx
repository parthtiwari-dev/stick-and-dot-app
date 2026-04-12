import RoleGuard from "@/components/RoleGuard";

export default function SubjectExpertLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole="subject-expert">{children}</RoleGuard>;
}
