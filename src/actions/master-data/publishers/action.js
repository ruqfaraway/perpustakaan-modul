"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export async function createPublishers(data) {
  try {
    const result = await prisma.publisher.create({
      data: {
        name: data.name,
        address: data.address,
      },
    });
    revalidatePath("/master-data/publishers");
    return {
      success: true,
      data: result,
      message: "Penerbit berhasil dibuat",
    };
  } catch (error) {
    console.error("Gagal membuat Penerbit:", error);
    return {
      success: false,
      message: "Gagal membuat Penerbit",
      error: error.message,
    };
  } finally {
    console.log("Proses create Penerbit selesai");
  }
}

export async function UpdatePublishers(id, data) {
  console.log(id, data);
  try {
    if (!id) {
      throw new Error("ID penerbit tidak ditemukan");
    }

    if (!data?.name) {
      throw new Error("Nama penerbit wajib diisi");
    }

    const result = await prisma.publisher.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        address: data.address,
      },
    });

    revalidatePath("/master-data/publishers");

    return {
      success: true,
      data: result,
      message: "Penerbit berhasil diperbarui",
    };
  } catch (error) {
    console.error("Gagal update Penerbit:", error);

    return {
      success: false,
      message: "Gagal memperbarui Penerbit",
      error: error.message,
    };
  }
}

export async function deletePublisher(id) {
  try {
    if (!id) {
      throw new Error("ID penerbit tidak ditemukan");
    }

    await prisma.publisher.delete({
      where: {
        id,
      },
    });

    revalidatePath("/master-data/publishers");

    return {
      success: true,
      message: "Penerbit berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus Penerbit:", error);

    return {
      success: false,
      message: "Gagal menghapus Penerbit",
      error: error.message,
    };
  }
}
