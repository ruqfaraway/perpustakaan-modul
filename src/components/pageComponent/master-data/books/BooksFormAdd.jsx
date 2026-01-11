"use client";
import { createBooks } from "@/actions/master-data/books/action";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Book title must be at least 2 characters.",
  }),
  isbn: z.string().optional(),
  publishedAt: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  category: z.string().optional(),
});

const CreateBookPage = ({
  authorsData = [],
  publishersData = [],
  categoriesData,
}) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      isbn: "",
      publishedAt: "",
      author: "",
      publisher: "",
      category: "",
    },
  });

  async function onSubmit(values) {
    const result = await createBooks(values);
    if (result.success) {
      router.push("/master-data/books");
      toast.success("Books created successfully!");
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
          <h1 className="text-2xl font-semibold">Add Book</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input placeholder="isbn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Terbit</FormLabel>
                  <FormControl>
                    <Input placeholder="Tahun Terbit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="author"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-complex-author">
                    Penulis
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-complex-author"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    {authorsData.length === 0 ? (
                      <SelectContent>
                        <SelectItem value="none">No Data</SelectItem>
                      </SelectContent>
                    ) : null}

                    {authorsData.length > 0 && (
                      <SelectContent>
                        {authorsData.map((author) => (
                          <SelectItem key={author.value} value={author.value}>
                            {author.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldSeparator />

            <Controller
              name="publisher"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-complex-publisher">
                    Publisher
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-complex-publisher"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    {publishersData.length === 0 ? (
                      <SelectContent>
                        <SelectItem value="none">No Data</SelectItem>
                      </SelectContent>
                    ) : null}

                    {publishersData.length > 0 && (
                      <SelectContent>
                        {publishersData.map((publisher) => (
                          <SelectItem
                            key={publisher.value}
                            value={publisher.value}
                          >
                            {publisher.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldSeparator />
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-complex-category">
                    Category
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-complex-category"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    {categoriesData.length === 0 ? (
                      <SelectContent>
                        <SelectItem value="none">No Data</SelectItem>
                      </SelectContent>
                    ) : null}
                    {categoriesData.length > 0 && (
                      <SelectContent>
                        {categoriesData.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <ButtonSubmit>Submit</ButtonSubmit>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
};

export default CreateBookPage;
