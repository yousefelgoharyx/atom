import { serve } from "http";
import { HTTPVerb } from "./src/types/Routes.ts";
import { createRoutesMap } from "./src/utils/routes.ts";
import runValidations from "./src/packages/validations/validate.ts";
import { runMiddlewares } from "./src/packages/middlewares/middlewares.ts";

export const Atom = {
  bootstrap,
};

type AsyncOrSyncFn<P, R> = (param: P) => Promise<R> | R;

interface BootstrapConfig {
  beforeRequest?: AsyncOrSyncFn<Request, void>;
  afterRequest?: AsyncOrSyncFn<Request, void>;
}

async function bootstrap(config: BootstrapConfig = {}) {
  const routesMap = await createRoutesMap();
  async function handler(req: Request): Promise<Response> {
    try {
      if (config?.beforeRequest) await config.beforeRequest(req);
      const pathname = new URL(req.url).pathname;
      const verb = req.method.toLowerCase() as HTTPVerb;
      const route = routesMap[pathname];
      if (route) {
        const middlewares = [route.middlewares, route[verb].middlewares];
        const handler = route[verb].default;
        return (
          (await runValidations(req, route[verb].schema)) ||
          (await runMiddlewares(req, middlewares)) ||
          (await handler(req)) ||
          new Response("Not Founds")
        );
      }
      return new Response("Not Founds");
    } finally {
      if (config?.afterRequest) await config.afterRequest(req);
    }
  }
  await serve(handler, { port: 8080 });
}
