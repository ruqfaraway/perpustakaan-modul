"use client";

import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import MainButton from "@/components/CustomUI/MainButton/MainButton";
import MainTable from "@/components/CustomUI/MainTable/MainTable";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IoSearch } from "react-icons/io5";
import { deleteCategory } from "@/actions/master-data/categories/action";
import { deleteMember } from "@/actions/master-data/members/action";

const MembersPage = ({
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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    const res = await deleteMember(id);
    if (res.success) {
      toast.success("Data Member berhasil dihapus");
      setLoading(false);
    } else {
      setError(res.message || "Gagal menghapus data member");
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <MainButton
            loading={loading}
            onClick={() =>
              router.push(`/master-data/members/detail/${record.id}`)
            }
          >
            Detail
          </MainButton>
          <MainButton
            type="destructive"
            loading={loading}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </MainButton>
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

    // Pushes the new URL, e.g., /shop?category=shoes&sort=price-asc
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
        <MainButton onClick={() => router.push("/master-data/members/add")}>
          Add Member
        </MainButton>
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

export default MembersPage;
