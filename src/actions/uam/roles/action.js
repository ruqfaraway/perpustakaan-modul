"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export const createRole = async (data) => {
  try {
    const nameUppercase = data.name.toUpperCase().trim();
    const result = await prisma.role.create({
      data: {
        name:nameUppercase,
        description: data.description,
        permissions: {
          create: data.permissions.map((id) => ({
            permission: {
              connect: { id: id },
            },
          })),
        },
      },
    });

    revalidatePath("/uam/roles");
    return {
      success: true,
      data: result,
      message: "Data role berhasil dibuat",
    };
  } catch (error) {
    console.error("Gagal membuat data role:", error);
    return {
      success: false,
      message: "Gagal membuat data role",
      error: error.message,
    };
  }
};

export async function updateRoles(id, data) {
  try {
    if (!id) {
      throw new Error("ID role tidak ditemukan");
    }

    if (!data?.name) {
      throw new Error("Nama role wajib diisi");
    }
    const { name, description, permissions } = data;
    const nameUppercase = name.toUpperCase().trim();
    const result = await prisma.role.update({
      where: {
        id,
      },
      data: {
        name: nameUppercase,
        description: description,
        permissions: {
          deleteMany: {},
          create: permissions.map((pId) => ({
            permission: {
              connect: { id: pId },
            },
          })),
        },
      },
    });

    revalidatePath("/uam/roles");

    return {
      success: true,
      data: result,
      message: "Data role berhasil diperbarui",
    };
  } catch (error) {
    console.error("Gagal update data role:", error);

    return {
      success: false,
      message: "Gagal memperbarui data role",
      error: error.message,
    };
  }
}

export async function deleteRoles(id) {
  try {
    if (!id) {
      throw new Error("ID role tidak ditemukan");
    }

    const roleWithUsers = await prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true } 
        }
      }
    });

    if (!roleWithUsers) throw new Error("Role tidak ditemukan");

    const role = await prisma.role.findUnique({ where: { id } });
    if (role?.name === "SUPER_ADMIN") {
      throw new Error(
        "Role SUPER_ADMIN adalah sistem bawaan dan tidak bisa dihapus!"
      );
    }

    const userCount = roleWithUsers._count.users;
    if (userCount > 0) {
      throw new Error(
        `Gagal hapus! Masih ada ${userCount} petugas yang memakai role ini. Pindahkan dulu role mereka ke role lain!`
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: { roleId: id },
      });

      await tx.userRole.deleteMany({
        where: { roleId: id },
      });

      await tx.role.delete({
        where: { id },
      });
    });

    revalidatePath("/uam/roles");

    return {
      success: true,
      message: "Data role dan semua relasinya berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus data role:", error);

    return {
      success: false,
      message: error.message || "Gagal menghapus data role",
    };
  }
}
