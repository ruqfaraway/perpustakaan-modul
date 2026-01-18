import DashboardPage from "@/components/pageComponent/dashboard/DashboardPage";

export default async function Page() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const [totalBooks, activeLoans, dueToday, activeMembers, unpaidFines] =
    await Promise.all([
      prisma.book.count(),
      prisma.loan.count({ where: { status: "ACTIVE" } }),
      prisma.loan.count({
        where: {
          dueDate: { gte: todayStart, lte: todayEnd },
          status: "ACTIVE",
        },
      }),
      prisma.member.count(),
      prisma.fine.aggregate({
        where: { paid:false },
        _sum: { amount: true },
      }),
    ]);

  // Susun data dalam objek agar rapi saat dikirim sebagai props
  const statsData = {
    totalBooks,
    activeLoans,
    dueToday,
    activeMembers,
    totalUnpaidFines: unpaidFines._sum.amount || 0,
  };

  return <DashboardPage stats={statsData} />;
}
