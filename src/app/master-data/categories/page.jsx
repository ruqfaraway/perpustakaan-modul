import CategoriesPage from "@/components/pageComponent/master-data/categories/CategoriesPage";
import prisma from "../../../../lib/prisma";

export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const categories = await prisma.category.findMany({
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
  const totalCategories = await prisma.category.count({
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
    total: totalCategories,
    total_page: Math.ceil(totalCategories / take),
  };

  return <CategoriesPage dataSource={categories} query={query} />;
}
