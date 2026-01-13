import CategoriesPage from "@/components/pageComponent/master-data/categories/CategoriesPage";
import prisma from "../../../../lib/prisma";
import RolesPages from "@/components/pageComponent/uam/roles/RolesPage";

export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const roles = await prisma.role.findMany({
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
  const totalRoles = await prisma.role.count({
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
    total: totalRoles,
    total_page: Math.ceil(totalRoles / take),
  };

  return <RolesPages dataSource={roles} query={query} />;
}
