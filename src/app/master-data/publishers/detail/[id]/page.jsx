"use server";
import PublishersForm from "@/components/pageComponent/master-data/publishers/PublishersFormUpdate";
import prisma from "../../../../../../lib/prisma";

export default async function Page({ params }) {
  const { id } = await params;

  const publisherData = await prisma.publisher.findUnique({
    where: { id },
  });

  if (!publisherData) {
    return <div>Publisher not found</div>;
  }

  return (
    <PublishersForm
      publisherId={publisherData.id}
      defaultValues={{
        name: publisherData.name,
        address: publisherData.address || "",
      }}
    />
  );
}
