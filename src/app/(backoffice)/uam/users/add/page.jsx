"use server";

import CreateUsersPage from "@/components/pageComponent/uam/users/UsersFormAdd";
import prisma from "../../../../../../lib/prisma";


export default async function Page() {
  const roles = await prisma.role.findMany();
  return <CreateUsersPage roleList={roles} />;
}
