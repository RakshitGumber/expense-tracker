import { createFileRoute } from "@tanstack/react-router";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

async function getExpenses() {
  const expense = await api.expenses.$get();
  const data = await expense.json();
  return data;
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getExpenses,
  });

  return (
    <div>
      <Table className="w-[550px] mx-auto my-12">
        <TableCaption>A list of your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="w-[100px] h-[20px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-[20px] rounded-full" />
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      <Skeleton className="w-[100px] h-[20px] rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell className="text-right">{expense.amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
