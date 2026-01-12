"use server";
import MembersForm from "@/components/pageComponent/master-data/members/MembersFormUpdate";
import prisma from "../../../../../../lib/prisma";



export default async function Page({ params }) {
  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: { id },
  });

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <MembersForm
      memberId={member.id}
      defaultValues={{
        name: member.name,
        email: member.email,
        phone: member.phone,
      }}
    />
  );
}
