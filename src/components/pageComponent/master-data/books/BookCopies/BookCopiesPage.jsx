"use client";
import { deleteBookCopies } from "@/actions/master-data/bookcopies/action";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import MainButton from "@/components/CustomUI/MainButton/MainButton";
import MainTable from "@/components/CustomUI/MainTable/MainTable";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import { toast } from "sonner";

const BookCopiesPage = ({
  bookId,
  dataSource = [],
  query = {
    page: 1,
    per_page: 10,
    total: 0,
  },
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (bookId, id) => {
    setLoading(true);
    const res = await deleteBookCopies(bookId, id);
    if (res.success) {
      toast.success("Data Buku berhasil dihapus");
      setLoading(false);
    } else {
      setError(res.message || "Gagal menghapus data buku");
      setLoading(false);
    }
  };
  const columns = [
    // {
    //   title: "No",
    //   dataIndex: "no",
    //   key: "no",
    //   render: (_, __, index) => {
    //     const page = Number(query?.page ?? 1);
    //     const perPage = Number(query?.per_page ?? 10);
    //     return (page - 1) * perPage + index + 1;
    //   },
    // },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
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
          <MainButton
            variant="destructive"
            loading={loading}
            onClick={() => handleDelete(bookId, record.id)}
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

  const link = {
    update: `/master-data/books/detail/${bookId}`,
    bookCopies: `/master-data/books/detail/${bookId}/bookCopies`,
  };

  return (
    <>
      <ContentWrapper>
        <Tabs defaultValue={link.bookCopies} className="w-100">
          <TabsList>
            <TabsTrigger
              value={link.update}
              onClick={() => router.push(link.update)}
            >
              Update Books
            </TabsTrigger>
            <TabsTrigger value={link.bookCopies}>Book Copies</TabsTrigger>
          </TabsList>
        </Tabs>
        {error && (
          <div className="bg-red-200 p-2 rounded-md flex justify-between items-center">
            <p className="text-red-500">{error}</p>
            <ButtonIcon onClick={() => setError(null)} />
          </div>
        )}
        <div className="flex gap-4 items-center">
          <ButtonIcon
            variant="standart"
            onClick={() => router.push("/master-data/books")}
            icon={<ArrowLeft className="h-6 w-6" />}
          />
          <h1 className="text-2xl font-semibold">Book Copies</h1>
        </div>

        <MainTable
          columns={columns}
          dataSource={dataSource}
          // query={query}
          rowkeys="id"
        />
      </ContentWrapper>
    </>
  );
};

export default BookCopiesPage;
