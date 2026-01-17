"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "../../../lib/prisma";

export const createLoans = async (data) => {
  const { memberId, dueDate, items } = data;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized: Petugas tidak teridentifikasi.",
      };
    }
    const officerId = session.user.id;
    const result = await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.create({
        data: {
          memberId: memberId,
          processedBy: officerId,
          dueDate: new Date(dueDate),
          status: "ACTIVE",
          items: {
            create: items.map((copyId) => ({
              bookCopyId: copyId,
            })),
          },
        },
      });
      await tx.bookCopy.updateMany({
        where: {
          id: { in: items },
        },
        data: {
          status: "BORROWED",
        },
      });

      return loan;
    });

    revalidatePath("/transactions/loans");

    return {
      success: true,
      message: `Peminjaman berhasil dicatat dengan ID: ${result.id}`,
      data: result,
    };
  } catch (error) {
    console.error("CREATE_LOAN_ERROR:", error);
    return {
      success: false,
      message: "Gagal memproses peminjaman. Pastikan semua buku tersedia.",
    };
  }
};

export const returnLoan = async (
  loanId,
  fineAmount = 0,
  isFinePaid = false,
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({
        where: { id: loanId },
        include: { items: true },
      });
      if (!loan) throw new Error("Data peminjaman tidak ditemukan.");
      if (loan.status === "RETURNED")
        throw new Error("Buku sudah dikembalikan sebelumnya.");
      await tx.loan.update({
        where: { id: loanId },
        data: {
          status: "RETURNED",
          returnDate: new Date(),
        },
      });
      if (fineAmount > 0) {
        await tx.fine.create({
          data: {
            loanId: loanId,
            amount: fineAmount,
            paid: isFinePaid,
          },
        });
      }
      const bookCopyIds = loan.items.map((item) => item.bookCopyId);
      if (bookCopyIds.length > 0) {
        await tx.bookCopy.updateMany({
          where: { id: { in: bookCopyIds } },
          data: { status: "AVAILABLE" },
        });
      }
      return { success: true, message: "Pengembalian berhasil diproses." };
    });
    revalidatePath("/transaction/loans");

    return result;
  } catch (error) {
    console.error("RETURN_LOAN_ERROR:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
    };
  }
};

export const processFines = async (id) => {
  try {
    // 1. Cek apakah data denda ada
    const fine = await prisma.fine.findUnique({
      where: { id },
    });

    if (!fine) {
      return { success: false, message: "Data denda tidak ditemukan." };
    }

    // 2. Cek apakah sudah lunas sebelumnya
    if (fine.paid) {
      return { success: false, message: "Denda ini sudah lunas." };
    }

    // 3. Update status pembayaran
    const updatedFine = await prisma.fine.update({
      where: { id },
      data: {
        paid: true,
      },
    });

    // 4. Refresh halaman agar tabel di client mendapatkan data terbaru
    revalidatePath("/transaction/fines");

    return {
      success: true,
      message: "Pembayaran denda berhasil dicatat.",
      data: updatedFine,
    };
  } catch (error) {
    console.error("PROCESS_FINE_ERROR:", error);
    return {
      success: false,
      message: "Gagal memproses pembayaran denda.",
    };
  }
};
