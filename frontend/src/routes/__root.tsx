import { type QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Root />,
});

function Navbar() {
  return (
    <div className="p-2 flex gap-2 max-w-2xl mx-auto">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/create-expense">Create</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
}

function Root() {
  return (
    <>
      <Navbar />
      <hr />
      <Outlet />
    </>
  );
}
