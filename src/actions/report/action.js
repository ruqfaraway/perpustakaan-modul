"use server";

import prisma from "../../../lib/prisma";

export async function getReportData(startDate, endDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  try {
    const [
      totalTransactions,
      newBooks,
      revenue,
      newMembers,
      rawLoans,
      popularBooksRaw,
      topMembersRaw,
    ] = await Promise.all([
      prisma.loan.count({
        where: { loanDate: { gte: start, lte: end } },
      }),
      prisma.book.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
      prisma.fine.aggregate({
        where: {
          paid: true,
          updatedAt: { gte: start, lte: end },
        },
        _sum: { amount: true },
      }),
      prisma.member.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
      prisma.loan.findMany({
        where: { loanDate: { gte: start, lte: end } },
        include: {
          member: true,
          items: {
            include: {
              bookCopy: {
                include: { book: true },
              },
            },
          },
        },
        orderBy: { loanDate: "desc" },
        take: 100,
      }),
      prisma.loanItem.groupBy({
        by: ["bookCopyId"],
        where: {
          createdAt: { gte: start, lte: end },
        },
        _count: { bookCopyId: true },
        orderBy: { _count: { bookCopyId: "desc" } },
        take: 5,
      }),
      prisma.loan.groupBy({
        by: ["memberId"],
        where: {
          loanDate: { gte: start, lte: end },
        },
        _count: { memberId: true },
        orderBy: { _count: { memberId: "desc" } },
        take: 5,
      }),
    ]);

    const popularBooks = await Promise.all(
      popularBooksRaw.map(async (item) => {
        const copy = await prisma.bookCopy.findUnique({
          where: { id: item.bookCopyId },
          include: { book: { select: { title: true } } },
        });
        return {
          name: copy?.book?.title || "Unknown",
          count: item._count.bookCopyId,
        };
      }),
    );
    const topMembers = await Promise.all(
      topMembersRaw.map(async (item) => {
        const member = await prisma.member.findUnique({
          where: { id: item.memberId },
          select: { name: true },
        });
        return { name: member?.name || "Unknown", count: item._count.memberId };
      }),
    );

    const summaryTable = rawLoans.map((loan) => ({
      id: loan.id,
      date: loan.loanDate.toLocaleDateString("id-ID"),
      member: loan.member.name,
      book: loan.items
        .map((item) => item.bookCopy?.book?.title)
        .filter(Boolean)
        .join(", "),
      status: loan.status,
    }));

    // 2. Untuk Data Excel (Detail per buku)
    const detailedExcel = [];
    rawLoans.forEach((loan) => {
      loan.items.forEach((item) => {
        detailedExcel.push({
          "Tanggal Pinjam": loan.loanDate.toLocaleDateString("id-ID"),
          "Nama Member": loan.member.name,
          "Judul Buku": item.bookCopy?.book?.title || "Tanpa Judul",
          "Kode Buku": item.bookCopy?.code || "-",
          "Status Peminjaman": loan.status,
        });
      });
    });

    return {
      totalTransactions,
      newBooks,
      revenue: revenue._sum.amount || 0,
      newMembers,
      recentTransactions: summaryTable, // Dipakai di tabel web
      excelData: detailedExcel, // Dipakai khusus download excel
      popularBooks,
      topMembers,
    };
  } catch (error) {
    console.error("ERROR GET DATA REPORT: ", error.message);
    throw new Error("Gagal mengambil data laporan");
  }
}
