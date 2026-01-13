"use server";
import CategoriesForm from "@/components/pageComponent/master-data/categories/CategoriesFormUpdate";
import prisma from "../../../../../../lib/prisma";
import RolesFormUpdate from "@/components/pageComponent/uam/roles/RolesFormUpdate";

export default async function Page({ params }) {
  const { id } = await params;

  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: true,
    },
  });

  if (!role) {
    return <div>Role not found</div>;
  }
  const permissionsData = await prisma.permission.findMany();

  return (
    <RolesFormUpdate
      roleId={role.id}
      defaultValues={{
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((p) => p.permissionId) || [],
      }}
      permissionsList={permissionsData}
    />
  );
}
