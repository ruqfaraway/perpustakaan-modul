import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";

const TableCategories = ({ columns = [], data = [] }) => {
  return (
    <Table>
      <TableCaption>A list of your categories</TableCaption>
      <TableHeader>
        <TableRow>
          {columns &&
            columns.map((columns) => (
              <TableHead key={columns.accessorKey}>{columns.title}</TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableCategories;
