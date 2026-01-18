import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" }, // Pastikan strategi JWT aktif
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Saat pertama kali Login
      if (user) {
        token.sub = user.id;
      }

      // 2. Selalu sinkronkan data terbaru dari DB ke Token
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
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

        if (dbUser) {
          token.username = dbUser.username;
          // Ambil daftar nama role
          token.roles = dbUser.roles.map((ur) => ur.role.name);

          // Ambil daftar kode permission dan hilangkan duplikat
          const perms = dbUser.roles.flatMap((ur) =>
            ur.role.permissions.map((rp) => rp.permission.code),
          );
          token.permissions = Array.from(new Set(perms));
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Masukkan data dari token ke dalam session agar bisa diakses di frontend
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.username = token.username;
        session.user.roles = token.roles || [];
        session.user.permissions = token.permissions || [];
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials;
        if (!username || !password) return null;

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
});
