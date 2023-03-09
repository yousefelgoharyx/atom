import { bootstrap, install, PluginConfig } from "./server.ts";
import { useZod } from "./src/packages/hooks/useZod.ts";
import { useParams } from "./src/packages/hooks/useParams.ts";
import { HttpStatus } from "./src/packages/common/enums.ts";
import { AtomResponse } from "./src/packages/runtime/Response.ts";

const Atom = {
  bootstrap,
  useZod,
  useParams,
  HttpStatus,
  AtomResponse,
  install,
};

export { bootstrap, useZod, useParams, HttpStatus, AtomResponse, Atom, install };

export type { MiddlewareHandler, RequestHandler } from "./src/types/Routes.ts";
export type { PluginConfig };
export default Atom;
