"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export const LoginAction = async (data) => {
  try {
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    revalidatePath("/login");
    return {
      success: true,
      message: "Login berhasil, mengalihkan...",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Username atau Password salah!" };
        default:
          return { success: false, message: "Terjadi kesalahan pada sistem." };
      }
    }
    throw error;
  }
};

export const LogoutAction = async () => {
  try {
    await signOut({
      redirectTo: "/login",
      redirect: true,
    });
  } catch (error) {
    throw error;
  }
};
