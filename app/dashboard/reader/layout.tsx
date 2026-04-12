import RoleGuard from "@/components/RoleGuard";

export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole="reader">{children}</RoleGuard>;
}
