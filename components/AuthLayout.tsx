"use client";

import React, { createContext, useContext, useState } from "react";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";
const ROLES: Role[] = ["Writer", "Reader", "Subject Expert", "Client"];

interface AuthContextValue {
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue>({
  selectedRole: "Writer",
  setSelectedRole: () => {},
});

export const useAuthRole = () => useContext(AuthContext);

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [selectedRole, setSelectedRole] = useState<Role>("Writer");

  return (
    <AuthContext.Provider value={{ selectedRole, setSelectedRole }}>
      <div className="flex min-h-screen">
        {/* ── Left Pane (Fixed) ── */}
        <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[40%] bg-black text-white px-10 py-10 z-10">
          {/* Logo */}
          <div className="mb-auto">
            <span className="text-2xl font-bold tracking-tight">Logo</span>
          </div>

          {/* Role Selector */}
          <div className="flex flex-col justify-center flex-1 mt-8">
            <p className="text-lg mb-6 leading-snug">
              Present <strong className="font-bold">yourself</strong> as...
            </p>

            <div className="flex flex-col gap-3">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full py-3 px-6 rounded-lg border border-white/70 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    selectedRole === role
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white hover:bg-white/10"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
              For your personalized Dashboard
              <br />
              choose from the above.
            </p>
          </div>

          {/* Bottom Branding */}
          <div className="text-center mt-auto">
            <p className="text-sm text-gray-300 mb-1">
              Humane than AI, faster than human
            </p>
            <p className="text-xl font-bold underline underline-offset-4 decoration-white">
              Stick&amp;Dot.
            </p>
          </div>
        </aside>

        {/* ── Right Pane (Scrollable) ── */}
        <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  );
}
