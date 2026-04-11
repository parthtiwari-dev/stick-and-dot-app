"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "Writer" | "Reader" | "Subject Expert" | "Client";

interface UserContextValue {
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
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
  const [userRole, setUserRoleState] = useState<UserRole>("Writer");
  const [userName, setUserNameState] = useState("Shaivya");
  const [userEmail, setUserEmailState] = useState("");

  useEffect(() => {
    try {
      const r = localStorage.getItem("sd_role") as UserRole | null;
      const n = localStorage.getItem("sd_name");
      const e = localStorage.getItem("sd_email");
      if (r) setUserRoleState(r);
      if (n) setUserNameState(n);
      if (e) setUserEmailState(e);
    } catch (_) {}
  }, []);

  const setUserRole = (r: UserRole) => { setUserRoleState(r); try { localStorage.setItem("sd_role", r); } catch (_) {} };
  const setUserName = (n: string) => { setUserNameState(n); try { localStorage.setItem("sd_name", n); } catch (_) {} };
  const setUserEmail = (e: string) => { setUserEmailState(e); try { localStorage.setItem("sd_email", e); } catch (_) {} };

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userName, setUserName, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
}
