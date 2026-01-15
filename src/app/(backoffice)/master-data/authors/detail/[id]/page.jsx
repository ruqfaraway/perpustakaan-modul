"use server";
import AuthorsForm from "@/components/pageComponent/master-data/authors/AuthorsFormUpdate";
import prisma from "../../../../../../../lib/prisma";


export default async function Page({ params }) {
  const { id } = await params;

  const authorsData = await prisma.author.findUnique({
    where: { id },
  });

  if (!authorsData) {
    return <div>Author not found</div>;
  }

  return (
    <AuthorsForm
      authorId={authorsData.id}
      defaultValues={{
        name: authorsData.name,
        bio: authorsData.bio || "",
      }}
    />
  );
}
