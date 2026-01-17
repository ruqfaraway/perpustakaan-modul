"use client";
import { createLoans } from "@/actions/transaction/action";
import ButtonIcon from "@/components/CustomUI/ButtonIcon/ButtonIcon";
import ButtonSubmit from "@/components/CustomUI/ButtonSubmit/ButtonSubmit";
import ContentWrapper from "@/components/CustomUI/ContentWrapper/ContentWrapper";
import { MultiComboBoxComponent } from "@/components/CustomUI/MultiComboBox/MultiComboBox";
import { NewDatePicker } from "@/components/CustomUI/NewDatePicker/NewDatePicker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
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
  memberId: z.string().min(1, { message: "Member is required." }),
  dueDate: z.date({
    required_error: "Due date is required.",
    invalid_type_error: "That's not a date!",
  }),
  items: z
    .array(z.string())
    .min(1, { message: "At least one book is required." }),
});

const CreateLoansPage = ({ membersData = [], bookOptions = [] }) => {
  const router = useRouter();
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 7);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: "",
      dueDate: defaultDueDate,
      items: [],
    },
  });

  async function onSubmit(values) {
    const result = await createLoans(values);
    if (result.success) {
      router.push("/transaction/loans");
      toast.success("Loans created successfully!");
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
            onClick={() => router.push("/transaction/loans")}
            icon={<ArrowLeft className="h-6 w-6" />}
          />
          <h1 className="text-2xl font-semibold">Add Loans</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Controller
              name="memberId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-complex-member">
                    Member
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-complex-member"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    {membersData.length === 0 ? (
                      <SelectContent>
                        <SelectItem value="none">No Data</SelectItem>
                      </SelectContent>
                    ) : null}

                    {membersData.length > 0 && (
                      <SelectContent>
                        {membersData.map((member) => (
                          <SelectItem
                            disabled={member.loans > 0}
                            key={member.value}
                            value={member.value}
                          >
                            {member.label}
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
            <NewDatePicker
              control={form.control}
              name="dueDate"
              label="Due Date"
            />

            <MultiComboBoxComponent
              control={form.control}
              name="items"
              label="items"
              options={bookOptions}
            />
            <ButtonSubmit>Submit</ButtonSubmit>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
};

export default CreateLoansPage;
