import { bootstrap } from "./server.ts";
import { useBody } from "./src/packages/hooks/useBody.ts";

const Atom = {
  bootstrap: bootstrap,
  useBody: useBody,
};

export { useBody };
export type { MiddlewareHandler, RequestHandler } from "./src/types/Routes.ts";

export default Atom;
