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

export default async function RootLayout({ children }) {
  const session = await auth(); // Ambil session di server

  // Data user yang dikirim: { name: "Admin", role: "OFFICER" }
  const userData = session?.user
    ? {
        name: session.user.name,
        role: session.user.roles,
      }
    : null;

    
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider initialUser={userData}>{children}</AuthProvider>
      </body>
    </html>
  );
}
