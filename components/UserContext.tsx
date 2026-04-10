"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "Writer" | "Reader" | "Subject Expert" | "Client";

interface UserContextValue {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextValue>({
  userRole: "Writer",
  setUserRole: () => {},
  userName: "Shaivya",
  setUserName: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>("Writer");
  const [userName, setUserNameState] = useState<string>("Shaivya");

  useEffect(() => {
    const storedRole = localStorage.getItem("sd_user_role") as UserRole | null;
    const storedName = localStorage.getItem("sd_user_name");
    if (storedRole) setUserRoleState(storedRole);
    if (storedName) setUserNameState(storedName);
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem("sd_user_role", role);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem("sd_user_name", name);
  };

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}
