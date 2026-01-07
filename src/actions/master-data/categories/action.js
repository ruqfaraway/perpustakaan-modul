"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";


export async function createCategories(data) {
  try {
    const result = await prisma.category.create({
      data: {
        name: data.categories,
      },
    });
    revalidatePath("/master-data/categories");
    return {
      success: true,
      data: result,
      message: "Kategori berhasil dibuat",
    };
  } catch (error) {
    console.error("Gagal membuat kategori:", error);
    return {
      success: false,
      message: "Gagal membuat kategori",
      error: error.message,
    };
  } 
}

export async function updateCategory(id, data) {
  try {
    if (!id) {
      throw new Error("ID kategori tidak ditemukan");
    }

    if (!data?.name) {
      throw new Error("Nama kategori wajib diisi");
    }

    const result = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/master-data/categories");

    return {
      success: true,
      data: result,
      message: "Kategori berhasil diperbarui",
    };
  } catch (error) {
    console.error("Gagal update kategori:", error);

    return {
      success: false,
      message: "Gagal memperbarui kategori",
      error: error.message,
    };
  }
}

export async function deleteCategory(id) {
  try {
    if (!id) {
      throw new Error("ID kategori tidak ditemukan");
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/master-data/categories");

    return {
      success: true,
      message: "Kategori berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus kategori:", error);

    return {
      success: false,
      message: "Gagal menghapus kategori",
      error: error.message,
    };
  }
}
