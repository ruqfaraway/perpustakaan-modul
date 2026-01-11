-- DropForeignKey
ALTER TABLE "book_authors" DROP CONSTRAINT "book_authors_bookId_fkey";

-- AddForeignKey
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
