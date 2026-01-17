"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children, initialUser }) {
  // initialUser diambil dari Server Component saat pertama kali load
  const [user, setUser] = useState(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
