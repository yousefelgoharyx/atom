import { bootstrap } from "./server.ts";
import { useZod } from "./src/packages/hooks/useZod.ts";
import { useParams } from "./src/packages/hooks/useParams.ts";

const Atom = {
  bootstrap,
  useZod,
  useParams,
};

export { useZod, useParams };
export type { MiddlewareHandler, RequestHandler } from "./src/types/Routes.ts";

export default Atom;
