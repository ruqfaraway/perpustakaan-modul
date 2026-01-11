"use client";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import MainButton from "@/components/CustomUI/MainButton/MainButton";
import MainTable from "@/components/CustomUI/MainTable/MainTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const BookListPage = ({ authorId, dataSource, query }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
  ];

  const link = {
    update: `/master-data/authors/detail/${authorId}`,
    bookList: `/master-data/authors/detail/${authorId}/book-list`,
  };

  return (
    <>
      <ContentWrapper>
        <Tabs defaultValue={link.bookList} className="w-100">
          <TabsList>
            <TabsTrigger
              value={link.update}
              onClick={() => router.push(link.update)}
            >
              Update authors
            </TabsTrigger>
            <TabsTrigger value={link.bookList}>Book List</TabsTrigger>
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
            onClick={() => router.push("/master-data/authors/detail/" + authorId)}
            icon={<ArrowLeft className="h-6 w-6" />}
          />
          <h1 className="text-2xl font-semibold">Book List</h1>
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

export default BookListPage;
