import RoleGuard from "@/components/RoleGuard";

export default function WriterLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole="writer">{children}</RoleGuard>;
}
