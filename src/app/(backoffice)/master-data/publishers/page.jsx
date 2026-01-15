import PublishersPage from "@/components/pageComponent/master-data/publishers/PublishersPage";
import prisma from "../../../../../lib/prisma";


export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const publishersData = await prisma.publisher.findMany({
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
  const totalPublishers = await prisma.publisher.count({
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
    total: totalPublishers,
    total_page: Math.ceil(totalPublishers / take),
  };

  return <PublishersPage dataSource={publishersData} query={query} />;
}
