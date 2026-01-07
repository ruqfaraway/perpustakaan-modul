import TableCategories from "@/components/table-component/categories/TableCategories";
import { Button } from "@/components/ui/button";
import React from "react";

const CategoriesPage = () => {
  const columns = [
    {
      accessorKey: "id",
      title: "No",
    },
    {
      accessorKey: "name",
      title: "Name",
    },
  ];

  const tableData = [
    { id: 1, name: "Fiction" },
    { id: 2, name: "Non-Fiction" },
    { id: 3, name: "Science" },
    { id: 4, name: "History" },
  ];
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <p>This is the Categories page.</p>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between">
          <Button variant="outline">Add Category</Button>
        </div>
        <TableCategories columns={columns} data={tableData} />
      </div>
    </div>
  );
};

export default CategoriesPage;
