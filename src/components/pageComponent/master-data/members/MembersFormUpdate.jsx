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

import { updateMembers } from "@/actions/master-data/members/action";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .trim() // Menghapus spasi di awal/akhir
    .min(2, {
      message: "Nama minimal harus 2 karakter.",
    })
    .max(50, { message: "Nama maksimal 50 karakter." }),

  email: z
    .string()
    .trim()
    .lowercase() // Otomatis jadi huruf kecil
    .email({ message: "Format email tidak valid." }),

  phone: z
    .string()
    .trim()
    .min(10, { message: "Nomor telepon minimal 10 digit." })
    .max(15, { message: "Nomor telepon maksimal 15 digit." })
    // Regex untuk memastikan hanya angka yang diinput
    .regex(/^[0-9]+$/, { message: "Nomor telepon hanya boleh berisi angka." }),
});

export default function MembersForm({
  memberId = null,
  defaultValues = { name: "", email: "", phone: "" },
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values) {
    const res = await updateMembers(memberId, {
      name: values.name,
      email: values.email,
      phone: values.phone,
    });

    if (res.success) {
      toast.success("Member updated successfully");
      router.push("/master-data/members");
    } else {
      // alert(res.message);
      toast.error(res.message || "Failed to update member");
    }
  }

  return (
    <ContentWrapper>
      <div className="flex gap-4 items-center">
        <ButtonIcon
          variant="standart"
          onClick={() => router.push("/master-data/members")}
          icon={<ArrowLeft className="h-6 w-6" />}
        />
        <h1 className="text-2xl font-semibold">Detail Members</h1>
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
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="phone" {...field} />
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
