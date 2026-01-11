"use server";
import BooksForm from "@/components/pageComponent/master-data/books/BooksFormUpdate";
import prisma from "../../../../../../lib/prisma";

export default async function Page({ params }) {
  const { id } = await params;

  const bookData = await prisma.book.findUnique({
    where: { id },
    include: {
      authors: {
        include: {
          author: true,
        }
      }
    },
  });

  if (!bookData) {
    return <div>Book not found</div>;
  }
  const authorsData = await prisma.author.findMany();
  const publishersData = await prisma.publisher.findMany();
  const categoriesData = await prisma.category.findMany();

  const publisherSelect = publishersData.map((publisher) => ({
    value: publisher.id,
    label: publisher.name,
  }));
  const categorySelect = categoriesData.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const authorSelect = authorsData.map((author) => ({
    value: author.id,
    label: author.name,
  }));

const dataSource = {
  ...bookData,
  author: bookData.authors.map((ba) => ba.author.id).join(", "),
}

const bookCopiesData = await prisma.bookCopy.count({
  where: { bookId: id },
});

  return (
    <BooksForm
      bookId={bookData.id}
      authorsData={authorSelect}
      publishersData={publisherSelect}
      categoriesData={categorySelect}
      defaultValues={{
        title: dataSource.title,
        isbn: dataSource.isbn,
        publishedAt: dataSource.publishedAt.toString(),
        author: dataSource.author,
        publisher: dataSource.publisherId,
        category: dataSource.categoryId,
      }}
      bookCopiesData={bookCopiesData}
    />
  );
}
