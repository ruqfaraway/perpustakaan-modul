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

import { updateRoles } from "@/actions/uam/roles/action";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { MultiCheckBoxField } from "@/components/CustomUI/MultiCheckbox/MultiCheckbox";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, "Nama role maksimal 30 karakter")
    .regex(/^[A-Z0-9_]+$/, "Gunakan huruf kapital dan underscore")
    .transform((val) => val.toUpperCase()),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  permissions: z.array(z.string()).optional(),
});

export default function RolesFormUpdate({
  roleId = null,
  permissionsList = [],
  defaultValues = { name: "", description: "", permissions: [] },
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values) {
    const res = await updateRoles(roleId, {
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    });

    if (res.success) {
      toast.success("Role updated successfully");
      router.push("/uam/roles");
    } else {
      // alert(res.message);
      toast.error(res.message || "Failed to update role");
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
        <h1 className="text-2xl font-semibold">Detail Roles</h1>
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
                  <Input
                    placeholder="name"
                    {...field}
                    className="uppercase"
                    onChange={(e) => {
                      // Ubah spasi jadi underscore dan paksa uppercase
                      const val = e.target.value
                        .toUpperCase()
                        .replace(/\s+/g, "_")
                        .replace(/[^A-Z0-9_]/g, "");
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MultiCheckBoxField
            control={form.control}
            name="permissions"
            label="Permissions"
            options={permissionsList}
          />
          <ButtonSubmit type="submit">Update</ButtonSubmit>
        </form>
      </Form>
    </ContentWrapper>
  );
}
