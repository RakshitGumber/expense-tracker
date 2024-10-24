import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { getUser } from "../kinde";

import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { and, eq } from "drizzle-orm";

const expenseSchema = z.object({
  id: z.number(),
  title: z.string().min(3).max(100),
  amount: z.string(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()
  .get("/total-spent", getUser, async (c) => {
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, c.var.user.id))
      .limit(25);
    const total = expenses.reduce((acc, expense) => acc + +expense.amount, 0);

    return c.json(total);
  })
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id));

    return c.json(expenses);
  })
  .post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    const expense = c.req.valid("json");
    const result = await db
      .insert(expensesTable)
      .values({
        ...expense,
        userId: c.var.user.id,
      })
      .returning();

    return c.json(result);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then((res) => res[0]);
    return c.json(expenses);
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then((res) => res[0]);
    return c.json({ message: "expense Deleted" }, 200);
  });
