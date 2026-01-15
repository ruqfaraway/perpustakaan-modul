"use server";
import CategoriesForm from "@/components/pageComponent/master-data/categories/CategoriesFormUpdate";
import prisma from "../../../../../../../lib/prisma";




export default async function Page({ params }) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <CategoriesForm
      categoryId={category.id}
      defaultValues={{
        categories: category.name,
      }}
    />
  );
}
