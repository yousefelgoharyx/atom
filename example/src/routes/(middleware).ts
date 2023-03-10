import { MiddlewareHandler } from "../../../src/types/Routes.ts";

const homeMiddleware: MiddlewareHandler = (req) => {
  const pathname = new URL(req.url).search;
  const age = new URLSearchParams(pathname).get("age");
  if (!age || +age < 18) {
    return new Response("You are under 18");
  }
};

export default homeMiddleware;
