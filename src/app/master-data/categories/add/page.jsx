"use client";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import React from "react";
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
import { createCategories } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";

const formSchema = z.object({
  categories: z.string().min(2, {
    message: "Categories must be at least 2 characters.",
  }),
});

const CreateCategoriesPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: "",
    },
  });

  async function onSubmit(values) {
    const result = await createCategories(values);
    if (result.success) {
      router.push("/master-data/categories");
      toast.success("Categories created successfully!");
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
          <h1 className="text-2xl font-semibold">Add Categories</h1>
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
            <ButtonSubmit>Submit</ButtonSubmit>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
};

export default CreateCategoriesPage;
