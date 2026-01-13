"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export const createRole = async (data) => {
  try {
    const result = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
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

    const result = await prisma.role.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
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

    await prisma.role.delete({
      where: {
        id,
      },
    });

    revalidatePath("/uam/roles");

    return {
      success: true,
      message: "Data role berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus data role:", error);

    return {
      success: false,
      message: "Gagal menghapus data role",
      error: error.message,
    };
  }
}
