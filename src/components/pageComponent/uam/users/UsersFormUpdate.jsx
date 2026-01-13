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

import { updateUser } from "@/actions/uam/users/action";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { MultiSelect } from "@/components/CustomUI/MultiSelect/MultiSelect";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .regex(
      /^[a-z0-9_]+$/,
      "Nama role hanya boleh huruf kecil, angka, dan underscore (_) tanpa spasi"
    ),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .regex(
      /^[a-z0-9_]+$/,
      "Username hanya boleh huruf kecil, angka, dan underscore tanpa spasi"
    ),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  roles: z.array(z.string()).optional(),
});

export default function UserUpdateForm({
  userId = null,
  defaultValues = { name: "", email: "", username: "", roles: [] },
  roleList = [],
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values) {
    const res = await updateUser(userId, {
      name: values.name,
      username: values.username,
      email: values.email,
      roles: values.roles || [],
    });

    if (res.success) {
      toast.success("User updated successfully");
      router.push("/uam/users");
    } else {
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
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
          <MultiSelect
            control={form.control}
            name="roles"
            label="Roles"
            options={roleList}
          />
          <ButtonSubmit type="submit">Update</ButtonSubmit>
        </form>
      </Form>
    </ContentWrapper>
  );
}
