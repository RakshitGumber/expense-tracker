import { hc } from "hono/client";
import { type ApiRoutes } from "../../../src/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");

export default client.api;

async function getCurrentUser() {
  const res = await client.api.me.$get();
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});
