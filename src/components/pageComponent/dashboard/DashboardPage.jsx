import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, CircleDollarSign, Clock, Users } from "lucide-react";

const DashboardPage = ({ stats }) => {
  const cardItem = [
    {
      title: "Total Buku",
      value: stats.totalBooks.toLocaleString(),
      icon: <Book className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Peminjaman Aktif",
      value: stats.activeLoans.toLocaleString(),
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Jatuh Tempo Hari ini",
      value: stats.dueToday.toLocaleString(),
      icon: <Clock className="h-4 w-4 text-destructive" />,
    },
    {
      title: "Member Aktif",
      value: stats.activeMembers.toLocaleString(),
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Denda Belum Bayar",
      value: `Rp ${stats.totalUnpaidFines.toLocaleString()}`,
      icon: <CircleDollarSign className="h-4 w-4 text-muted-foreground" />,
    },
  ];
  return (
    <ContentWrapper>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {cardItem.map((item, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4"></div>
      </div>
    </ContentWrapper>
  );
};

export default DashboardPage;
