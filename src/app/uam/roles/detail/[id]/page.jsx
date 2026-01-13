"use server";
import CategoriesForm from "@/components/pageComponent/master-data/categories/CategoriesFormUpdate";
import prisma from "../../../../../../lib/prisma";
import RolesFormUpdate from "@/components/pageComponent/uam/roles/RolesFormUpdate";



export default async function Page({ params }) {
  const { id } = await params;

  const role = await prisma.role.findUnique({
    where: { id },
  });

  if (!role) {
    return <div>Role not found</div>;
  }

  return (
    <RolesFormUpdate
      roleId={role.id}
      defaultValues={{
        name: role.name,
        description: role.description,
      }}
    />
  );
}
