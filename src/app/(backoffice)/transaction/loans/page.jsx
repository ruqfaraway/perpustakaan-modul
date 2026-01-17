"use server";
import LoansPage from "@/components/pageComponent/transaction/loans/LoansPage";
import prisma from "../../../../../lib/prisma";

export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const whereCondition = {
    OR: [
      {
        member: {
          name: { contains: search, mode: "insensitive" },
        },
      },
      {
        id: { contains: search, mode: "insensitive" },
      },
    ],
  };
  const [loans, totalLoan] = await prisma.$transaction([
    prisma.loan.findMany({
      where: whereCondition,
      include: {
        member: { select: { name: true } },
        officer: { select: { name: true } },
        _count: { select: { items: true } },
        fine: true,
        items: {
          include: {
            bookCopy: {
              include: {
                book: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    prisma.loan.count({ where: whereCondition }),
  ]);

  const dataSource = loans.map((loan) => ({
    id: loan.id,
    memberName: loan.member.name,
    officerName: loan.officer.name,
    loanDate: loan.loanDate,
    dueDate: loan.dueDate,
    returnDate: loan.returnDate,
    amount: loan._count.items,
    status: loan.status,
    bookTitles: loan.items.map(item => item.bookCopy.book.title),
  }));

  const query = {
    page: currentPage,
    per_page: Number(take),
    total: totalLoan,
    total_page: Math.ceil(totalLoan / take),
  };

  return <LoansPage dataSource={dataSource} query={query} />;
}
