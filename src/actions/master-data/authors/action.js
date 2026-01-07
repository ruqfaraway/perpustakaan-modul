"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export async function createAuthors(data) {
  try {
    const result = await prisma.author.create({
      data: {
        name: data.name,
        bio: data.bio,
      },
    });
    revalidatePath("/master-data/authors");
    return {
      success: true,
      data: result,
      message: "Penulis berhasil dibuat",
    };
  } catch (error) {
    console.error("Gagal membuat penulis:", error);
    return {
      success: false,
      message: "Gagal membuat penulis",
      error: error.message,
    };
  } finally {
  }
}

export async function updateAuthors(id, data) {
  try {
    if (!id) {
      throw new Error("ID penulis tidak ditemukan");
    }

    if (!data?.name) {
      throw new Error("Nama penulis wajib diisi");
    }

    const result = await prisma.author.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        bio: data.bio,
      },
    });

    revalidatePath("/master-data/authors");

    return {
      success: true,
      data: result,
      message: "Data penulis berhasil diperbarui",
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memperbarui penulis",
      error: error.message,
    };
  }
}

export async function deleteAuthors(id) {
  try {
    if (!id) {
      throw new Error("ID penulis tidak ditemukan");
    }

    await prisma.author.delete({
      where: {
        id,
      },
    });

    revalidatePath("/master-data/authors");

    return {
      success: true,
      message: "Data penulis berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus penulis:", error);

    return {
      success: false,
      message: "Gagal menghapus penulis",
      error: error.message,
    };
  }
}
