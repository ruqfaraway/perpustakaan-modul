"use client";

import { processFines } from "@/actions/transaction/action";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import MainButton from "@/components/CustomUI/MainButton/MainButton";
import MainTable from "@/components/CustomUI/MainTable/MainTable";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HasPermission } from "@/lib/HasPermisssion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import { toast } from "sonner";

const FinesPage = ({
  dataSource = [],
  query = {
    page: 1,
    per_page: 10,
    total: 0,
  },
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState([]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePayFine = async (id) => {
    setLoading(true);
    try {
      const res = await processFines(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat memproses pembayaran");
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <p className="text-md font-semibold text-red-400">Rp. {amount}</p>
      ),
    },
    {
      title: "Paid Status",
      dataIndex: "paid",
      key: "paid",
      render: (paid) =>
        paid ? (
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">
            Paid
          </Badge>
        ) : (
          <Badge variant="destructive" className="animate-pulse">
            Unpaid
          </Badge>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          {!record.paid && (
            <HasPermission
              code="fine:manage"
              fallback={<MainButton disabled>Mark as Paid</MainButton>}
            >
              <MainButton
                loading={loading}
                onClick={() => handlePayFine(record.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Paid
              </MainButton>
            </HasPermission>
          )}
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
        <div>
          <p className="text-2xl font-bold ">Fines</p>
        </div>
        {isMounted && ( // Bungkus form dengan isMounted
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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
        )}
      </div>
      <MainTable
        columns={columns}
        dataSource={dataSource}
        query={query}
        rowkeys="id"
      />
    </ContentWrapper>
  );
};

export default FinesPage;
