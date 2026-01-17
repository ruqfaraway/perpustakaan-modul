import CreateBookPage from "@/components/pageComponent/master-data/books/BooksFormAdd";
import prisma from "../../../../../lib/prisma";

export default async function Page() {
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

  return (
    <CreateBookPage
      authorsData={authorSelect}
      publishersData={publisherSelect}
      categoriesData={categorySelect}
      dataSource={authorsData}
    />
  );
}
