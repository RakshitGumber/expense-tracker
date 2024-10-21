import { hc } from "hono/client";
import { type ApiRoutes } from "../../../src/app";

const client = hc<ApiRoutes>("/");

export default client.api;
