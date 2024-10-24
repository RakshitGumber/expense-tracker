import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <a href="/api/login">Login</a>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }
  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = queryClient.fetchQuery(userQueryOptions);

      return data;
    } catch (error) {
      return { user: null };
    }
  },
  component: Component,
});
