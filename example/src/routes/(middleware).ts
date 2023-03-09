import { MiddlewareHandler } from "../../../src/types/Routes.ts";

const homeMiddleware: MiddlewareHandler = () => {
  console.log("Every request must pass here first");
};

export default homeMiddleware;
