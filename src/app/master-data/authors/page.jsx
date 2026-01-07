import AuthorPage from "@/components/pageComponent/master-data/authors/AuthorsPage";
import prisma from "../../../../lib/prisma";

export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const authorsData = await prisma.author.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });
  const totalAuthors = await prisma.author.count({
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
    total: totalAuthors,
    total_page: Math.ceil(totalAuthors / take),
  };

  return <AuthorPage dataSource={authorsData} query={query} />;
}
