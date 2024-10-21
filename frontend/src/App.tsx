import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function getExpenses() {
      const req = await fetch("/api/expenses/total-spent");
      const data = await req.json();
      setTotalSpent(data.total);
    }

    getExpenses();
  }, []);

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{totalSpent}</p>
      </CardContent>
    </Card>
  );
}

export default App;
