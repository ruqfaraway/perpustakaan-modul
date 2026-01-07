"use client";

import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UpdatePublishers } from "@/actions/master-data/publishers/action";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Categories must be at least 2 characters.",
  }),
  address: z.string().optional(),
});

export default function PublishersForm({
  publisherId = null,
  defaultValues = { name: "", address: "" },
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values) {
    console.log('values', values);
    const res = await UpdatePublishers(publisherId, {
      name: values.name,
      address: values.address,
    });

    if (res.success) {
      toast.success("Category updated successfully");
      router.push("/master-data/publishers");
    } else {
      // alert(res.message);
      toast.error(res.message || "Failed to update category");
    }
  }

  return (
    <ContentWrapper>
      <div className="flex gap-4 items-center">
        <ButtonIcon
          variant="standart"
          onClick={() => router.back()}
          icon={<ArrowLeft className="h-6 w-6" />}
        />
        <h1 className="text-2xl font-semibold">Update Publishers</h1>
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
          <ButtonSubmit type="submit">Update dong</ButtonSubmit>
        </form>
      </Form>
    </ContentWrapper>
  );
}
