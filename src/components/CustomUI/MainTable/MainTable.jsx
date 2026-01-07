import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const MainTable = ({
  dataSource = [],
  columns = [],
  rowkeys = "id",
  onRowClick,
  query = {
    page: 1,
    per_page: 10,
    total: 1,
  },
}) => {
  const router = useRouter();
  const onPaginate = (page) => {
    router.push({
      query: {
        ...router.query,
        page,
      }, // query: { page: 1 }
    });
  };
  const totalPages = Math.ceil(query.total / query.per_page);
  return (
    <>
      <Table>
        {dataSource.length === 0 && columns.length === 0 && (
          <TableCaption>No data available</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.title}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSource.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
          {dataSource.map((item) => (
            <TableRow
              key={item[rowkeys]}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render
                    ? column.render(item[column.dataIndex], item)
                    : item[column.dataIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="w-full justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPaginate(query.page - 1)}
              aria-disabled={query.page <= 1}
              tabIndex={query.page <= 1 ? -1 : undefined}
              className={
                query.page <= 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                href="#"
                onClick={() => onPaginate(index + 1)}
                isActive={index + 1 === query.page}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPaginate(query.page + 1)}
              aria-disabled={query.page >= totalPages}
              tabIndex={query.page >= totalPages ? -1 : undefined}
              className={
                query.page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default MainTable;
