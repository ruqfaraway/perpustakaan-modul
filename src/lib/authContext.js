"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export function AuthProvider({ children, initialUser }) {
  // initialUser diambil dari Server Component saat pertama kali load
  const { data: session, status } = useSession();
  const [user, setUser] = useState(initialUser);
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        username: session.user.username,
        roles: session.user.roles,
        permissions: session.user.permissions,
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status]);
  return (
    <AuthContext.Provider value={{ user, setUser, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
