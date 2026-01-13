"use server";
import UserUpdateForm from "@/components/pageComponent/uam/users/UsersFormUpdate";
import prisma from "../../../../../../lib/prisma";
import { includes } from "zod";

export default async function Page({ params }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: true
    },
  });

  const rolesData = await prisma.role.findMany();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <UserUpdateForm
      userId={user.id}
      defaultValues={{
        name: user.name,
        username: user.username,
        email: user.email,
        roles: user.roles.map((r) => r.roleId) || [],
      }}
      roleList={rolesData}
    />
  );
}
