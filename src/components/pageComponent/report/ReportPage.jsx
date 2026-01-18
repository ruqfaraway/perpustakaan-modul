"use client";

import { getReportData } from "@/actions/report/action";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, Download, FileText, Search, Users } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
const ReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0], // Default hari ini
    end: new Date().toISOString().split("T")[0],
  });
  const [data, setData] = useState(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await getReportData(dateRange.start, dateRange.end);
      setData(res);
      console.log(res.status, "ini res");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!data || !data.excelData) return;
    const wb = XLSX.utils.book_new();
    // Langsung masukkan excelData yang sudah diproses rapi dari server
    const wsDetail = XLSX.utils.json_to_sheet(data.excelData);
    XLSX.utils.book_append_sheet(wb, wsDetail, "Detail Laporan");
    XLSX.writeFile(wb, `Laporan_Perpus_Detail.xlsx`);
  };

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Laporan Historis
          </h1>
          <Button
            size="sm"
            variant="outline"
            disabled={!data}
            onClick={exportToExcel}
            className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>

        {/* Filter Section */}
        <Card className="bg-slate-50/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal Awal</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal Akhir</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleGenerateReport} disabled={loading}>
                {loading ? (
                  "Memproses..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-500">
              <ReportCard
                title="Total Transaksi"
                value={data.totalTransactions}
                icon={<FileText />}
              />
              <ReportCard
                title="Buku Baru"
                value={data.newBooks}
                icon={<FileText />}
              />
              <ReportCard
                title="Total Denda"
                value={`Rp ${data.revenue.toLocaleString()}`}
                icon={<FileText />}
              />
              <ReportCard
                title="Member Baru"
                value={data.newMembers}
                icon={<FileText />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              {/* Widget Buku Terpopuler */}
              <Card className="border-none shadow-sm bg-slate-50/50">
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <Book className="h-4 w-4 text-blue-500" />5 Buku Paling
                    Sering Dipinjam
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.popularBooks.map((book, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium leading-none">
                          {book.name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground font-semibold">
                        {book.count}x
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Widget Member Teraktif */}
              <Card className="border-none shadow-sm bg-slate-50/50">
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />5 Member
                    Teraktif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.topMembers.map((member, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium leading-none">
                          {member.name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground font-semibold">
                        {member.count} Pinjam
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  Detail Transaksi Periode Ini
                </CardTitle>
                <CardDescription>
                  Menampilkan hingga 50 transaksi terbaru
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-[120px]">Tanggal</TableHead>
                        <TableHead>Nama Member</TableHead>
                        <TableHead>Judul Buku</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentTransactions.length > 0 ? (
                        data.recentTransactions.map((trx) => (
                          <TableRow key={trx.id}>
                            <TableCell className="font-medium">
                              {trx.date}
                            </TableCell>
                            <TableCell>{trx.member}</TableCell>
                            <TableCell>{trx.book}</TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  trx.status === "RETURNED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {trx.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            Tidak ada transaksi pada periode ini.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ContentWrapper>
  );
};

// Helper Mini Card
const ReportCard = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default ReportPage;
