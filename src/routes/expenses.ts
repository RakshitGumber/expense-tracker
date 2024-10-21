import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number(),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()
  .get("/total-spent", (c) => {
    // const total = Array.reduce(
    // (acc, expense) => acc + expense.amount,)
    return c.json({ total: 1212 });
  })
  .get("/", (c) => {
    return c.json({ expenses: [] });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const data = c.req.valid("json");

    return c.json({});
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    return c.json({});
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    return c.json({});
  });
