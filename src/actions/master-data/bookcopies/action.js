"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export const addMultipleBooks = async (data) => {
  try {
    const { bookId, baseCode, quantity } = data;
    if (!bookId || !baseCode || quantity < 1) {
      throw new Error("Data tidak valid");
    }
    const copiesToCreate = Array.from({ length: quantity }).map((_, index) => ({
      bookId: bookId,
      code: `${baseCode}-${index + 1}-${Math.floor(
        Math.random() * 1000
      )}`.toUpperCase(),
      status: "AVAILABLE",
    }));
    const result = await prisma.bookCopy.createMany({
      data: copiesToCreate,
      skipDuplicates: true,
    });
    revalidatePath(`/master-data/books/detail/${bookId}`);
    return {
      success: true,
      data: result,
      message: "Data buku berhasil dibuat",
    };
  } catch (error) {
    console.error("Gagal membuat data buku:", error);
    return {
      success: false,
      message: "Gagal membuat data  buku",
      error: error.message,
    };
  }
};

export const deleteBookCopies = async (bookId, id) => {
  try {
    if (!id) {
      throw new Error("ID buku tidak ditemukan");
    }

    await prisma.bookCopy.delete({
      where: {
        id,
      },
    });
    revalidatePath(`/master-data/books/detail/${bookId}/bookCopies`);
    return {
      success: true,
      message: "Data buku berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus buku:", error);

    return {
      success: false,
      message: "Gagal menghapus buku",
      error: error.message,
    };
  }
};
