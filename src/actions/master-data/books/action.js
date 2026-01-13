"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export async function createBooks(data) {
  try {
    const result = await prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        publishedAt: parseInt(data.publishedAt), // Pastikan diconvert ke Integer jika di skema kamu type-nya Int

        // Relasi Satu ke Satu (Direct ID)
        categoryId: data.category,
        publisherId: data.publisher,
        authors: {
          // kalau nanti datanya array banyakan
          // create: data.author.map((id) => ({
          //   author: {
          //     connect: { id: id },
          //   },
          // })),
          create: [
            {
              author: {
                connect: { id: data.author },
              },
            },
          ],
        },
      },
    });
    revalidatePath("/master-data/books");
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
}

export async function updateBooks(id, data) {
  try {
    if (!id) {
      throw new Error("ID buku tidak ditemukan");
    }
    if (!data?.title) {
      throw new Error("Judul buku wajib diisi");
    }

    const result = await prisma.book.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        isbn: data.isbn,
        publishedAt: parseInt(data.publishedAt),
        categoryId: data.category,
        publisherId: data.publisher,
        authors: {
          deleteMany: {},
          create: [
            {
              author: {
                connect: { id: data.author },
              },
            },
          ],
          // untuk multiple author nanti
          // create: data.author.map((authId) => ({
          //   author: { connect: { id: authId } }
          // }))
        },
      },
    });

    revalidatePath("/master-data/books");

    return {
      success: true,
      data: result,
      message: "Data buku berhasil diperbarui",
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memperbarui buku",
      error: error.message,
    };
  }
}

export async function deleteBooks(id) {
  try {
    if (!id) {
      throw new Error("ID buku tidak ditemukan");
    }

    await prisma.book.delete({
      where: {
        id,
      },
    });

    revalidatePath("/master-data/books");

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
}
