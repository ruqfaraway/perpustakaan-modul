"use server";

import CreateRolePages from "@/components/pageComponent/uam/roles/RolesFormAdd";
import prisma from "../../../../../../lib/prisma";


export default async function Page() {
  const permissionsData = await prisma.permission.findMany();
  return <CreateRolePages permissionsList={permissionsData} />;
}
