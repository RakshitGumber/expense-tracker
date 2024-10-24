import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type User,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createFactory, createMiddleware } from "hono/factory";

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_DOMAIN as string,
    clientId: process.env.KINDE_CLIENT_ID as string,
    clientSecret: process.env.KINDE_CLIENT_SECRET as string,
    redirectURL: process.env.KINDE_REDIRECT_URI as string,
    logoutRedirectURL: process.env.KINDE_LOGOUT_URI,
  }
);

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(
      sessionManager(c)
    );
    if (!isAuthenticated) return c.json({ error: "Not authenticated" }, 401);

    const user = await kindeClient.getUser(manager);
    c.set("user", user);
    await next();
  } catch (error) {
    console.log(error);
  }
});
