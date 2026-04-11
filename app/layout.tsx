import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/components/UserContext";

export const metadata: Metadata = {
  title: "Stick&Dot.",
  description: "Humane than AI, faster than human",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
