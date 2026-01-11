import BookListPage from "@/components/pageComponent/master-data/books/BookList/BookListPage";

export default async function Page({ params }) {
  const { id } = await params;
  const authorBooks = await prisma.bookAuthor.findMany({
  where: { 
    authorId: id 
  },
  include: {
    book: {
      select: {
        title: true, // Ambil judul saja
        isbn: true,  // Contoh ambil field lain jika butuh
      }
    }
  }
});

const dataSource = authorBooks.map((ba) => ({
  id: ba.bookId,
  title: ba.book.title,
  isbn: ba.book.isbn,
}));

  return (
    <>
      <BookListPage authorId={id} dataSource={dataSource} />
    </>
  );
}
