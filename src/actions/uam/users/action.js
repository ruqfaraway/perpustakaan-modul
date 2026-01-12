"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export const createUser = async (data) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return {
        success: false,
        message: "Email sudah digunakan, silakan gunakan email lain.",
      };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    revalidatePath("/uam/users");
    return {
      success: true,
      data: result,
      message: "Data User berhasil dibuat",
    };
  } catch (error) {
    console.error("Gagal membuat data user:", error);
    return {
      success: false,
      message: "Gagal membuat data user",
      error: error.message,
    };
  }
};

export const updateUser = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID user tidak ditemukan");
    }

    if (!data?.name) {
      throw new Error("Nama user wajib diisi");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
        NOT: {
          id: id,
        },
      },
    });
    if (existingUser) {
      return {
        success: false,
        message: "Email sudah digunakan, silakan gunakan email lain.",
      };
    }

    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    revalidatePath("/uam/users");

    return {
      success: true,
      data: result,
      message: "User berhasil diperbarui",
    };
  } catch (error) {
    console.error("Gagal update user:", error);

    return {
      success: false,
      message: "Gagal memperbarui user",
      error: error.message,
    };
  }
};

export const deleteUser = async (id) => {
  try {
    if (!id) {
      throw new Error("ID user tidak ditemukan");
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    revalidatePath("/uam/users");

    return {
      success: true,
      message: "Data user berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus user:", error);
    return {
      success: false,
      message: "Gagal menghapus data user",
      error: error.message,
    };
  }
};
