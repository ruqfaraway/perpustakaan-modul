"use server";
import UserUpdateForm from "@/components/pageComponent/uam/users/UsersFormUpdate";
import prisma from "../../../../../../lib/prisma";

export default async function Page({ params }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <UserUpdateForm
      userId={user.id}
      defaultValues={{
        name: user.name,
        email: user.email,
      }}
    />
  );
}
