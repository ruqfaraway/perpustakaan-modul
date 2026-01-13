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
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createRole } from "@/actions/uam/roles/action";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { MultiCheckBoxField } from "@/components/CustomUI/MultiCheckbox/MultiCheckbox";
import { useRouter } from "next/navigation";
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

const CreateRolePages = ({ permissionsList }) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  async function onSubmit(values) {
    const result = await createRole(values);
    if (result.success) {
      router.push("/uam/roles");
      toast.success("Roles created successfully!");
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
          <h1 className="text-2xl font-semibold">Add Roles</h1>
        </div>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
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
            <ButtonSubmit>Submit</ButtonSubmit>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
};

export default CreateRolePages;
