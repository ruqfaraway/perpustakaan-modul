"use client";

import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import {
  Form,
  FormControl,
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
import { z } from "zod";

import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { toast } from "sonner";
import { updateAuthors } from "@/actions/master-data/authors/action";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Authors must be at least 2 characters.",
  }),
  bio: z.string().optional(),
});

export default function AuthorsForm({
  authorId = null,
  defaultValues = { name: "", bio: "" },
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values) {
    const res = await updateAuthors(authorId, {
      name: values.name,
      bio: values.bio,
    });

    if (res.success) {
      toast.success("Authors Data updated successfully");
      router.push("/master-data/authors");
    } else {
      // alert(res.message);
      toast.error(res.message || "Failed to update author data");
    }
  }

  const link = {
    update: `/master-data/authors/detail/${authorId}`,
    bookList: `/master-data/authors/detail/${authorId}/book-list`,
  };

  return (
    <ContentWrapper>
      <Tabs defaultValue={link.update} className="w-100">
        <TabsList>
          <TabsTrigger value={link.update}>Update Books</TabsTrigger>
          <TabsTrigger
            value={link.bookList}
            onClick={() => router.push(link.bookList)}
          >
            Book List
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex gap-4 items-center">
        <ButtonIcon
          variant="standart"
          onClick={() => router.push("/master-data/authors")}
          icon={<ArrowLeft className="h-6 w-6" />}
        />
        <h1 className="text-2xl font-semibold">Detail Author</h1>
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
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="bio" {...field} />
                </FormControl>
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
