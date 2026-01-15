import UsersPage from "@/components/pageComponent/uam/users/UsersPage";
import prisma from "../../../../../lib/prisma";

export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const user = await prisma.user.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
    take,
    skip,
  });
  const totalUser = await prisma.user.count({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
  const query = {
    page: currentPage,
    per_page: Number(take),
    total: totalUser,
    total_page: Math.ceil(totalUser / take),
  };

  return <UsersPage dataSource={user} query={query} />;
}
