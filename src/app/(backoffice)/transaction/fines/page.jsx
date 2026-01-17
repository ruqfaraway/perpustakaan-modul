import CategoriesPage from "@/components/pageComponent/master-data/categories/CategoriesPage";
import prisma from "../../../../../lib/prisma";
import FinesPage from "@/components/pageComponent/transaction/fines/FinesPage";

export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const whereCondition = {
    loan: {
      member: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
  };
  const [fines, totalFines] = await prisma.$transaction([
    prisma.fine.findMany({
      where: whereCondition,
      include: {
        loan: {
          include: {
            member: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.fine.count({ where: whereCondition }),
  ]);

  const dataSource = fines.map((item) => ({
    id: item.id,
    amount: item.amount,
    paid: item.paid,
    memberName: item.loan.member.name,
  }));

  const query = {
    page: currentPage,
    per_page: Number(take),
    total: totalFines,
    total_page: Math.ceil(totalFines / take),
  };

  return <FinesPage dataSource={dataSource} query={query} />;
}
