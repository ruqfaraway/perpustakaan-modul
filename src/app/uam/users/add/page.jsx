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

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { createUser } from "@/actions/uam/users/action";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const CreateUsersPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    const result = await createUser(values);
    if (result.success) {
      router.push("/uam/users");
      toast.success("User created successfully!");
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
            onClick={() => router.push("/uam/users")}
            icon={<ArrowLeft className="h-6 w-6" />}
          />
          <h1 className="text-2xl font-semibold">Add Users</h1>
        </div>
        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
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

export default CreateUsersPage;
