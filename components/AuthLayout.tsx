"use client";

import React, { createContext, useContext, useState } from "react";
import { type RawRole as Role, RAW_ROLES as ROLES } from "@/lib/roles";
import Logo from "@/components/Logo";

interface AuthContextValue {
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue>({
  selectedRole: "Writer",
  setSelectedRole: () => {},
});

export const useAuthRole = () => useContext(AuthContext);

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<Role>("Writer");

  return (
    <AuthContext.Provider value={{ selectedRole, setSelectedRole }}>
      <div className="flex min-h-screen">
        {/* ── Left Pane ── */}
        <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[40%] bg-black text-white px-10 py-10 z-10">
          <div className="mb-auto">
            <Logo size="lg" theme="dark" />
          </div>

          <div className="flex flex-col justify-center flex-1 mt-8">
            <p className="text-lg mb-6 leading-snug">
              Present <strong className="font-bold">yourself</strong> as...
            </p>
            <div className="flex flex-col gap-3">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full py-3 px-6 rounded-lg border text-sm font-medium transition-all cursor-pointer text-left ${
                    selectedRole === role
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white border-white/50 hover:bg-white/10"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
              For your personalized Dashboard<br />choose from the above.
            </p>
          </div>

          <div className="text-center mt-auto">
            <p className="text-sm text-gray-400 mb-2">Humane than AI, faster than human</p>
            <Logo size="md" theme="dark" />
          </div>
        </aside>

        {/* ── Right Pane ── */}
        <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  );
}
