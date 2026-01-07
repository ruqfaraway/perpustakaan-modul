"use client";
import { createPublishers } from "@/actions/master-data/publishers/action";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Publisher must be at least 2 characters.",
  }),
  address: z.string().optional(),
});

const CreatePublisherPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  async function onSubmit(values) {
    const result = await createPublishers(values);
    if (result.success) {
      router.push("/master-data/publishers");
      toast.success("Publishers created successfully!");
    } else {
      toast.error(`Error: ${result.error}`);
    }
  }

  return (
    <>
      <ContentWrapper>
        <div className="flex gap-4 items-center">
          <ButtonIcon
            variant="standart"
            onClick={() => window.history.back()}
            icon={<ArrowLeft className="h-6 w-6" />}
          />
          <h1 className="text-2xl font-semibold">Add Publisher</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ButtonSubmit>Submit</ButtonSubmit>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
};

export default CreatePublisherPage;
