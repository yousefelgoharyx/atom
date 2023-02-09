import { serve } from "http";
import { sessionData } from "./src/store/session.ts";
import { HTTPVerb } from "./src/types/Routes.ts";
import { createRoutesMap, runMiddlewares } from "./src/utils/routes.ts";
import validate from "./src/validations/validate.ts";

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
      sessionData.clear();
      const pathname = new URL(req.url).pathname;
      const verb = req.method.toLowerCase() as HTTPVerb;
      const route = routesMap[pathname];
      if (route) {
        const middlewares = [route.middlewares, route[verb].middlewares];
        const handler = route[verb].default;
        return (
          (await validate(req, route[verb].schema)) ||
          (await runMiddlewares(middlewares, req)) ||
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
