"use client";

import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft } from "lucide-react";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import { useRouter } from "next/navigation";
import { updateCategory } from "@/actions/actions";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { toast } from "sonner";

const formSchema = z.object({
  categories: z.string().min(2, {
    message: "Categories must be at least 2 characters.",
  }),
});

export default function CategoriesForm({
  categoryId = null,
  defaultValues = { categories: "" },
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values) {
    const res = await updateCategory(categoryId, {
      name: values.categories,
    });

    if (res.success) {
      toast.success("Category updated successfully");
      router.push("/master-data/categories");
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
        <h1 className="text-2xl font-semibold">Update Categories</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Input placeholder="categories" {...field} />
                </FormControl>
                <FormDescription>Enter the categories name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonSubmit type="submit">Update</ButtonSubmit>
        </form>
      </Form>
    </ContentWrapper>
  );
}
