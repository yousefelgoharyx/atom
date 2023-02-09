import useRequestSession from "../hooks/useRequestSession.ts";
import { MiddlewareHandler } from "../types/Routes.ts";

const homeMiddleware: MiddlewareHandler = () => {
  const session = useRequestSession();
  session.set("X-Request-Time", new Date().toUTCString());
};

export default homeMiddleware;
