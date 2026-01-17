"use server";

import CreateLoansPage from "@/components/pageComponent/transaction/loans/LoansFormAdd";
import prisma from "../../../../../../lib/prisma";

export default async function Page() {
  const members = await prisma.member.findMany({
    include: {
      _count: {
        select: {
          loans: {
            where: { status: "ACTIVE" },
          },
        },
      },
    },
  });
  const booksCopies = await prisma.bookCopy.findMany({
    where: { status: "AVAILABLE" },
    include: { book: true },
  });

  const bookOptions = booksCopies.map((copy) => ({
    value: copy.id,
    label: `${copy.book.title} - [${copy.code}]`,
  }));

  const membersData = members.map((member) => ({
    value: member.id,
    label: member.name,
    loans : member._count.loans
  }));


  return (
    <CreateLoansPage membersData={membersData} bookOptions={bookOptions}  />
  );
}
