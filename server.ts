import { http } from "./deps.ts";
import { HTTPVerb } from "./src/types/Routes.ts";
import { createRoutesMap } from "./src/packages/router/router.ts";
import { runMiddlewares } from "./src/packages/middlewares/middlewares.ts";
import { parseBody } from "./src/packages/validations/validate.ts";
import { pathToRegexp, path } from "./deps.ts";
type GlobalContext = {
  request: Request | null;
};

export const globalContext: GlobalContext = {
  request: null,
};

type AsyncOrSyncFn<P, R> = (param: P) => Promise<R> | R;

interface BootstrapConfig {
  beforeRequest?: AsyncOrSyncFn<Request, void>;
  afterRequest?: AsyncOrSyncFn<Request, void>;
  routesPath: string;
}

export async function bootstrap(config: BootstrapConfig) {
  const routesMap = await createRoutesMap(config.routesPath);
  console.log(routesMap);

  async function handler(req: Request): Promise<Response> {
    try {
      globalContext.request = req;
      if (config?.beforeRequest) await config.beforeRequest(req);
      const pathname = new URL(req.url).pathname;
      const verb = req.method.toLowerCase() as HTTPVerb;
      const route = routesMap[pathname];

      if (!route) return new Response("Not Found");

      const middlewares = [route.middlewares];
      const routeVerbMiddlewares = route[verb].middlewares;
      if (routeVerbMiddlewares) middlewares.push(routeVerbMiddlewares);

      const handler = route[verb].default;
      const bodyType = route[verb].body;

      let response;
      try {
        response =
          (await parseBody(req, bodyType)) ||
          (await runMiddlewares(req, middlewares)) ||
          (await handler(req)) ||
          new Response("Not Founds");
      } catch (error) {
        response = new Response("Oops, internal server error", { status: 500 });
        if (error instanceof Error) {
          response = new Response(error.message, { status: 500 });
        } else if (error instanceof Response) response = error;
      }

      return response;
    } finally {
      if (config?.afterRequest) await config.afterRequest(req);
    }
  }
  await http.serve(handler, { port: 8080 });
}
