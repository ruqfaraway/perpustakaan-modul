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
import { AlignLeft, ArrowLeft } from "lucide-react";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";

const formSchema = z.object({
  categories: z.string().min(2, {
    message: "Categories must be at least 2 characters.",
  }),
});

const CategoriesPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: "",
    },
  });

  function onSubmit(values) {
    console.log(values);
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
};

export default CategoriesPage;
