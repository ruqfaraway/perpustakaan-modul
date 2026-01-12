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

import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { toast } from "sonner";
import { updateCategory } from "@/actions/master-data/categories/action";
import { updateUser } from "@/actions/uam/users/action";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export default function UserUpdateForm({
  userId = null,
  defaultValues = { name: "", email: "" },
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values) {
    const res = await updateUser(userId, {
      name: values.name,
      email: values.email,
    });

    if (res.success) {
      toast.success("User updated successfully");
      router.push("/uam/users");
    } else {
      // alert(res.message);
      toast.error(res.message || "Failed to update user");
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
        <h1 className="text-2xl font-semibold">Detail User</h1>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
