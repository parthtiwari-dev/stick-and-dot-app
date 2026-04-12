"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { type RawRole, getStoredRole } from "@/lib/roles";

export type { RawRole as UserRole };

interface UserContextValue {
  userRole: RawRole;
  setUserRole: (r: RawRole) => void;
  userName: string;
  setUserName: (n: string) => void;
  userEmail: string;
  setUserEmail: (e: string) => void;
}

const UserContext = createContext<UserContextValue>({
  userRole: "Writer", setUserRole: () => {},
  userName: "Shaivya", setUserName: () => {},
  userEmail: "", setUserEmail: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<RawRole>("Writer");
  const [userName, setUserNameState] = useState("Shaivya");
  const [userEmail, setUserEmailState] = useState("");

  useEffect(() => {
    try {
      setUserRoleState(getStoredRole());
      const n = localStorage.getItem("sd_name");
      const e = localStorage.getItem("sd_email");
      if (n) setUserNameState(n);
      if (e) setUserEmailState(e);
    } catch (_) {}
  }, []);

  const setUserRole  = (r: RawRole) => { setUserRoleState(r);  try { localStorage.setItem("sd_role",  r); } catch (_) {} };
  const setUserName  = (n: string)  => { setUserNameState(n);  try { localStorage.setItem("sd_name",  n); } catch (_) {} };
  const setUserEmail = (e: string)  => { setUserEmailState(e); try { localStorage.setItem("sd_email", e); } catch (_) {} };

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userName, setUserName, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
}
