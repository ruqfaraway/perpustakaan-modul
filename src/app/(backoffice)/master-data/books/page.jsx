"use server";
import BooksPage from "@/components/pageComponent/master-data/books/BooksPage";
import prisma from "../../../../../lib/prisma";


export default async function Page({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;
  const currentPage = Number(page);
  const take = 10;
  const skip = (currentPage - 1) * take;
  const booksData = await prisma.book.findMany({
    where: {
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
    include: {
      authors: {
        include: {
          author: true,
        },
      },
      publisher: true,
      category: true,
      _count: {
        select: {
          copies: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });
  const totalBooks = await prisma.book.count({
    where: {
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
  const query = {
    page: currentPage,
    per_page: Number(take),
    total: totalBooks,
    total_page: Math.ceil(totalBooks / take),
  };

  const dataSource = booksData.map((book) => ({
    ...book,
    author: book.authors.map((a) => a.author.name).join(", "),
    publisher: book.publisher?.name || "Unknown",
    category: book.category?.name || "Unknown",
    stock: book._count.copies,
  }));

  return <BooksPage dataSource={dataSource} query={query} />;
}
