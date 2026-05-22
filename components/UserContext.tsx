"use client";
import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { cacheSession, clearSession, type RawRole } from "@/lib/roles";
import { createClient } from "@/lib/supabase/client";
import { getCurrentProfile, updateCurrentProfile } from "@/lib/supabase/profile";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export type { RawRole as UserRole };

interface UserContextValue {
  userRole: RawRole;
  setUserRole: (r: RawRole) => void;
  userName: string;
  setUserName: (n: string) => void;
  userEmail: string;
  setUserEmail: (e: string) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  userRole: "Writer",
  setUserRole: () => {},
  userName: "Shaivya",
  setUserName: () => {},
  userEmail: "",
  setUserEmail: () => {},
  loading: true,
  refreshUser: async () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<RawRole>("Writer");
  const [userName, setUserNameState] = useState("Shaivya");
  const [userEmail, setUserEmailState] = useState("");
  const [loading, setLoading] = useState(true);

  const applySignedOut = useCallback(() => {
    clearSession();
    setUserRoleState("Writer");
    setUserNameState("Shaivya");
    setUserEmailState("");
  }, []);

  const refreshUser = useCallback(async () => {
    if (!hasSupabaseConfig()) {
      applySignedOut();
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { user, profile } = await getCurrentProfile();

      if (!user) {
        applySignedOut();
        return;
      }

      const role = profile?.role ?? "Writer";
      const name = profile?.name || user.user_metadata?.full_name || user.email || "Shaivya";
      const email = profile?.email || user.email || "";

      cacheSession({ role, name, email });
      setUserRoleState(role);
      setUserNameState(name);
      setUserEmailState(email);
    } catch {
      applySignedOut();
    } finally {
      setLoading(false);
    }
  }, [applySignedOut]);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshUser();
    });

    if (!hasSupabaseConfig()) {
      return;
    }

    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void refreshUser();
      } else {
        applySignedOut();
      }
    });

    return () => data.subscription.unsubscribe();
  }, [applySignedOut, refreshUser]);

  const setUserRole = (r: RawRole) => {
    setUserRoleState(r);
    cacheSession({ role: r, name: userName, email: userEmail });
    void updateCurrentProfile({ role: r }).catch(() => {});
  };

  const setUserName = (n: string) => {
    setUserNameState(n);
    cacheSession({ role: userRole, name: n, email: userEmail });
    void updateCurrentProfile({ name: n }).catch(() => {});
  };

  const setUserEmail = (e: string) => {
    setUserEmailState(e);
    cacheSession({ role: userRole, name: userName, email: e });
    void updateCurrentProfile({ email: e }).catch(() => {});
  };

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userName, setUserName, userEmail, setUserEmail, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
