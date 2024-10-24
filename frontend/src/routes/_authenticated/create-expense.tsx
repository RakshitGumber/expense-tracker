import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import api from "@/lib/api";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function CreateExpense() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      navigate({ to: "/expenses" });
    },
  });

  return (
    <div className="p-2">
      <h1>Create Expense</h1>
      <form
        className="max-w-[350px] mx-auto flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "A title name is required"
                  : value.length < 3
                    ? "title name must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Title:</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>

        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                typeof value !== "string"
                  ? "An amount is required"
                  : Number(value) < 0
                    ? "amount must be at least a positive number"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Amount:</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              variant="default"
              size="lg"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
