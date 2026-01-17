-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "processedBy" TEXT NOT NULL,
    "loanDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_items" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "bookCopyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fines" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loan_items_bookCopyId_key" ON "loan_items"("bookCopyId");

-- CreateIndex
CREATE UNIQUE INDEX "fines_loanId_key" ON "fines"("loanId");

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_items" ADD CONSTRAINT "loan_items_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_items" ADD CONSTRAINT "loan_items_bookCopyId_fkey" FOREIGN KEY ("bookCopyId") REFERENCES "book_copies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fines" ADD CONSTRAINT "fines_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
