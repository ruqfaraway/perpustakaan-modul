import MembersPage from "@/components/pageComponent/master-data/members/MembersPage";
import prisma from "../../../../../lib/prisma";


export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const members = await prisma.member.findMany({
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
  const totalMembers = await prisma.member.count({
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
    total: totalMembers,
    total_page: Math.ceil(totalMembers / take),
  };

  return <MembersPage dataSource={members} query={query} />;
}
