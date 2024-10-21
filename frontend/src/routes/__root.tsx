import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => <Root />,
});

function Navbar() {
  return (
    <div className="p-2 flex gap-2">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/create-expense">Create</Link>
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
