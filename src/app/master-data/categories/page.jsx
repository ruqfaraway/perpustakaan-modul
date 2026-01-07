"use client";
import React, { useState } from "react";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import MainButton from "@/components/CustomUI/MainButton/MainButton";
import MainTable from "@/components/CustomUI/MainTable/MainTable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const CategoriesPage = ({ dataSource = [] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <MainButton
              loading={loading}
              // onClick={() =>
              //   router.push(`/master-data/education/detail/${record.id}`)
              // }
            >
              Detail
            </MainButton>
            <MainButton type="destructive" onClick={() => {}} loading={loading}>
              Delete
            </MainButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ContentWrapper>
        {error && (
          <div className="bg-red-200 p-2 rounded-md flex justify-between items-center">
            <p className="text-red-500">{error}</p>
            <ButtonIcon onClick={() => setError(null)} />
          </div>
        )}
        <div className="flex justify-between">
          <MainButton
            onClick={() => {
              router.push("/master-data/categories/add");
            }}
          >
            Add Categories
          </MainButton>
          <form className="flex gap-2">
            <Input placeholder="Search" />
            <MainButton type="outline">Search</MainButton>
          </form>
        </div>
        <MainTable columns={columns} dataSource={dataSource} rowkeys="id" />
      </ContentWrapper>
    </>
  );
};

export default CategoriesPage;
