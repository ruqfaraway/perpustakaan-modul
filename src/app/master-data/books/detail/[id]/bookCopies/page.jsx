
import BookCopiesPage from "@/components/pageComponent/master-data/books/BookCopies/BookCopiesPage";

export default async function Page({ params }) {
  const { id } = await params;
  const bookCopiesData = await prisma.bookCopy.findMany({
    where: { bookId: id },
  });

  return (
    <>
     <BookCopiesPage bookId={id} dataSource={bookCopiesData} />
    </>
  );
}
