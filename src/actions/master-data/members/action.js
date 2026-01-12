"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";


export async function createMembers(data) {
  try {
    const result = await prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone
      },
    });
    revalidatePath("/master-data/members");
    return {
      success: true,
      data: result,
      message: "Data member berhasil dibuat",
    };
  } catch (error) {
    console.error("Gagal membuat data member:", error);
    return {
      success: false,
      message: "Gagal membuat data member",
      error: error.message,
    };
  } 
}

export async function updateMembers(id, data) {
  try {
    if (!id) {
      throw new Error("ID member tidak ditemukan");
    }

    if (!data?.name) {
      throw new Error("Nama member wajib diisi");
    }

    const result = await prisma.member.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone
      },
    });

    revalidatePath("/master-data/members");

    return {
      success: true,
      data: result,
      message: "Data member berhasil diperbarui",
    };
  } catch (error) {
    console.error("Gagal update data member:", error);

    return {
      success: false,
      message: "Gagal memperbarui data member",
      error: error.message,
    };
  }
}

export async function deleteMember(id) {
  try {
    if (!id) {
      throw new Error("ID member tidak ditemukan");
    }

    await prisma.member.delete({
      where: {
        id,
      },
    });

    revalidatePath("/master-data/members");

    return {
      success: true,
      message: "Data member berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal hapus data member:", error);

    return {
      success: false,
      message: "Gagal menghapus data member",
      error: error.message,
    };
  }
}