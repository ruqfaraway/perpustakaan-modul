import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      // Masukkan data dari token ke dalam session agar bisa diakses di frontend
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.username = token.username;
        session.user.permissions = token.permissions;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      // Ambil data user + role + permission dari database
      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });
      if (!existingUser) return token;
      // Flatting permissions agar jadi array string sederhana: ["BOOK_CREATE", "USER_DELETE"]
      const permissions = existingUser.roles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.code)
      );
      token.username = existingUser.username;
      token.permissions = Array.from(new Set(permissions)); // Hilangkan duplikat
      return token;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { username: username },
        });
        if (!user || !user.password) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;
        return null;
      },
    }),
  ],
});
