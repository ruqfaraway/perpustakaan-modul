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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updateBooks } from "@/actions/master-data/books/action";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { addMultipleBooks } from "@/actions/master-data/bookcopies/action";

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

const formSchemaAddStock = z.object({
  code: z.string().min(2, {
    message: "Code must be at least 2 characters.",
  }),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number." })
    .min(1, {
      message: "Stock must be at least 1.",
    }),
});

export default function BooksForm({
  authorsData = [],
  publishersData = [],
  categoriesData = [],
  bookId = null,
  defaultValues = {
    title: "",
    isbn: "",
    publishedAt: "",
    author: "",
    publisher: "",
    category: "",
  },
  bookCopiesData = 0
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const formAddStock = useForm({
    resolver: zodResolver(formSchemaAddStock),
    defaultValues: {
      code: "",
      stock: "",
    },
  });

  async function onSubmit(values) {
    const res = await updateBooks(bookId, {
      title: values.title,
      isbn: values.isbn,
      publishedAt: values.publishedAt,
      author: values.author,
      publisher: values.publisher,
      category: values.category,
    });

    if (res.success) {
      toast.success("Book updated successfully");
      router.push("/master-data/books");
    } else {
      toast.error(res.message || "Failed to update book");
    }
  }

  const submitAddStock = async (values) => {
    const res = await addMultipleBooks({
      bookId: bookId,
      baseCode: values.code,
      quantity: values.stock,
    });
    if (res.success) {
      toast.success("Berhasil menambahkan jumlah buku");
      router.refresh();
    } else {
      toast.error(res.message || "Gagal menambahkan jumlah buku");
    }
    setIsOpen(false);
    formAddStock.reset();
  };

  const link = {
    update: `/master-data/books/detail/${bookId}`,
    bookCopies: `/master-data/books/detail/${bookId}/bookCopies`,
  }
  return (
    <ContentWrapper>
      <Tabs defaultValue={link.update} className="w-100">
        <TabsList>
          <TabsTrigger value={link.update}>Update Books</TabsTrigger>
          <TabsTrigger value={link.bookCopies} onClick={() => router.push(link.bookCopies)}>Book Copies</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex gap-4 items-center">
        <ButtonIcon
          variant="standart"
          onClick={() => router.push("/master-data/books")}
          icon={<ArrowLeft className="h-6 w-6" />}
        />
        <h1 className="text-2xl font-semibold">Update Book</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="form-tambah-buku"
        >
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
                  <Input placeholder="TahunTerbit" {...field} />
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
                        <SelectItem key={category.value} value={category.value}>
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
          <FormItem>
            <FormLabel>Jumlah Buku</FormLabel>
            <FormLabel className="font-normal">
              {bookCopiesData || 0} Buku
            </FormLabel>
          </FormItem>
          <div className="flex gap-4">
            <ButtonSubmit type="submit">Update</ButtonSubmit>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Tambah Jumlah Buku</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Tambahkan jumlah buku
                  </DialogTitle>
                  <Form {...formAddStock}>
                    <form
                      id="form-tambah-stok"
                      onSubmit={formAddStock.handleSubmit(submitAddStock)}
                      className="flex flex-col gap-5 mt-4"
                    >
                      <FormField
                        control={formAddStock.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Kode</FormLabel>
                            <FormControl>
                              <Input placeholder="code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formAddStock.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Jumlah Buku</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="jumlah buku"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        formAddStock.handleSubmit(submitAddStock)()
                      }
                    >
                      Continue
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </ContentWrapper>
  );
}
