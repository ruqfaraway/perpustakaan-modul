"use client";
import { returnLoan } from "@/actions/transaction/action";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import MainButton from "@/components/CustomUI/MainButton/MainButton";
import MainTable from "@/components/CustomUI/MainTable/MainTable";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateFine } from "@/lib/calculateFine";
import { formatDate } from "@/lib/formatDate";
import { HasPermission } from "@/lib/HasPermisssion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import { toast } from "sonner";

const LoansPage = ({
  dataSource = [],
  query = {
    page: 1,
    per_page: 10,
    total: 0,
  },
}) => {
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleOpenReturnDialog = (record) => {
    setSelectedLoan(record);
    setOpen(true);
  };
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { lateDays, amount } = selectedLoan
    ? calculateFine(selectedLoan.dueDate)
    : { lateDays: 0, amount: 0 };
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await returnLoan(selectedLoan.id, amount, isPaid);
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => {
        const page = Number(query?.page ?? 1);
        const perPage = Number(query?.per_page ?? 10);
        return (page - 1) * perPage + index + 1;
      },
    },
    {
      title: "Member Name",
      dataIndex: "memberName",
      key: "memberName",
    },
    {
      title: "Officer Name",
      dataIndex: "officerName",
      key: "officerName",
    },
    {
      title: "Loans Date",
      dataIndex: "loansDate",
      key: "loansDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <HasPermission
            code="loan:manage"
            fallback={<MainButton disabled>Return Process</MainButton>}
          >
            <MainButton
              disabled={record.status === "RETURNED"}
              onClick={() => handleOpenReturnDialog(record)}
            >
              Return Process
            </MainButton>
          </HasPermission>
        </div>
      ),
    },
  ];

  const form = useForm({
    defaultValues: {
      search: "",
    },
  });
  const onSubmit = (data) => {
    const params = new URLSearchParams();
    params.set("search", data.search);
    if (data.search) {
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push(pathname);
    }
  };
  return (
    <ContentWrapper>
      {error && (
        <div className="bg-red-200 p-2 rounded-md flex justify-between items-center">
          <p className="text-red-500">{error}</p>
          <ButtonIcon onClick={() => setError(null)} />
        </div>
      )}

      <div className="flex justify-between">
        <HasPermission
          code="loan:manage"
          fallback={<MainButton disabled>Add Loans</MainButton>}
        >
          <MainButton onClick={() => router.push("/transaction/loans/add")}>
            Add Loans
          </MainButton>
        </HasPermission>
        {isMounted && (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="search" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <ButtonIcon icon={<IoSearch />} type="submit" text="Search" />
              </form>
            </Form>
          </>
        )}
      </div>
      <MainTable
        columns={columns}
        dataSource={dataSource}
        query={query}
        rowkeys="id"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Proses Pengembalian Buku</DialogTitle>
            <DialogDescription>
              Member:{" "}
              <span className="font-bold text-foreground">
                {selectedLoan?.memberName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Buku yang dipinjam ({selectedLoan?.amount}):
              </Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pr-2">
                {selectedLoan?.bookTitles?.map((title, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/50 border text-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="truncate">{title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg border space-y-2">
              <div className="flex justify-between text-sm">
                <span>Jatuh Tempo:</span>
                <span className="font-medium">
                  {selectedLoan?.dueDate &&
                    format(new Date(selectedLoan.dueDate), "dd MMMM yyyy", {
                      locale: id,
                    })}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  lateDays > 0
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200",
                )}
              >
                <div className="flex justify-between font-bold">
                  <span>Status Keterlambatan:</span>
                  <span
                    className={lateDays > 0 ? "text-red-600" : "text-green-600"}
                  >
                    {lateDays > 0 ? `${lateDays} Hari` : "Tepat Waktu"}
                  </span>
                </div>

                {lateDays > 0 && (
                  <>
                    <div className="flex justify-between mt-2 text-lg font-extrabold text-red-700 border-t border-red-200 pt-2">
                      <span>Total Denda:</span>
                      <span>Rp {amount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-4 p-2 bg-white/50 rounded border border-red-200">
                      <Checkbox
                        id="paid-status"
                        checked={isPaid}
                        onCheckedChange={(val) => setIsPaid(!!val)}
                      />
                      <Label
                        htmlFor="paid-status"
                        className="text-red-800 font-semibold cursor-pointer"
                      >
                        Denda sudah dibayar tunai?
                      </Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <MainButton variant="outline">Batal</MainButton>
            </DialogClose>
            <MainButton
              loading={loading}
              onClick={handleConfirm}
              className={
                lateDays > 0 && !isPaid
                  ? "bg-orange-600 hover:bg-orange-700"
                  : ""
              }
            >
              Konfirmasi Pengembalian
            </MainButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentWrapper>
  );
};

export default LoansPage;
