"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export const createUser = async (data) => {
  try {
    const { name, username, email, password, roles } = data;
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return {
        success: false,
        message: `${field} sudah digunakan, silakan gunakan yang lain.`,
      };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        // Menghubungkan ke tabel UserRole (Many-to-Many)
        roles: {
          create: roles.map((id) => ({
            role: {
              connect: { id: id },
            },
          })),
        },
      },
    });

    revalidatePath("/uam/users");
    return {
      success: true,
      data: { id: result.id, email: result.email },
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
    if (!id) throw new Error("ID user tidak ditemukan");

    const { name, username, email, password, roles } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
        NOT: { id: id },
      },
    });

    if (existingUser) {
      const conflict = existingUser.email === email ? "Email" : "Username";
      return {
        success: false,
        message: `${conflict} sudah digunakan oleh petugas lain.`,
      };
    }

    const updateData = {
      name,
      username,
      email,
      roles: {
        // Reset roles lama dan pasang yang baru
        deleteMany: {},
        create: roles.map((rId) => ({
          role: { connect: { id: rId } },
        })),
      },
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const result = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/uam/users");

    return {
      success: true,
      data: { id: result.id, email: result.email },
      message: "Data petugas berhasil diperbarui",
    };
  } catch (error) {
    console.error("Gagal update user:", error);
    return {
      success: false,
      message: "Gagal memperbarui data user",
      error: error.message,
    };
  }
};

export const deleteUser = async (id) => {
  try {
    if (!id) {
      throw new Error("ID user tidak ditemukan");
    }

    // 1. Cek apakah user ini adalah 'SUPER_ADMIN' atau diri sendiri (opsional)
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) throw new Error("User tidak ditemukan");

    const isSuperAdmin = user.roles.some((r) => r.role.name === "SUPER_ADMIN");
    if (isSuperAdmin) {
      throw new Error("User dengan role SUPER_ADMIN tidak dapat dihapus!");
    }
    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: { userId: id },
      });

      // const hasTransactions = await tx.loan.findFirst({
      //   where: { processedBy: id },
      // });

      // if (hasTransactions) {
      //   throw new Error(
      //     "User tidak bisa dihapus karena sudah memiliki riwayat transaksi peminjaman. Gunakan fitur 'Nonaktifkan' saja."
      //   );
      // }

      await tx.user.delete({
        where: { id },
      });
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
