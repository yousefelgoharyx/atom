import { bootstrap } from "./server.ts";
import { useZod } from "./src/packages/hooks/useZod.ts";

const Atom = {
  bootstrap: bootstrap,
  useZod: useZod,
};

export { useZod };
export type { MiddlewareHandler, RequestHandler } from "./src/types/Routes.ts";

export default Atom;
