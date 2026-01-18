import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Perpustakaan",
  description: "Sebuah aplikasi perpustakaan buatan aku",
};

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/authContext";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({ children }) {
  const session = await auth();

  const userData = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        username: session.user.username,
        roles: session.user.roles,
        permissions: session.user.permissions,
      }
    : null;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <SessionProvider session={session}>
          <AuthProvider initialUser={userData}>{children}</AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
