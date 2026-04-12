import RoleGuard from "@/components/RoleGuard";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole="business">{children}</RoleGuard>;
}
