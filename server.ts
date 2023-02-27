import { fileServer, http, path } from "./deps.ts";
import { HTTPVerb } from "./src/types/Routes.ts";
import { createRoutesMap } from "./src/packages/router/router.ts";
import { runMiddlewares } from "./src/packages/middlewares/middlewares.ts";
import { parseBody } from "./src/packages/validations/validate.ts";
import { matchRoute } from "./src/utils/common.ts";
type GlobalContext = {
  request: Request | null;
  requestParams: Record<string, string>;
};

export const globalContext: GlobalContext = {
  request: null,
  requestParams: {},
};

type AsyncOrSyncFn<P, R> = (param: P) => Promise<R> | R;

interface BootstrapConfig {
  beforeRequest?: AsyncOrSyncFn<Request, void>;
  afterRequest?: AsyncOrSyncFn<Request, void>;
  routesDir?: string;
  publicDir?: string;
}

export async function bootstrap(config: BootstrapConfig) {
  const routes = await createRoutesMap(config.routesDir);
  async function handler(req: Request): Promise<Response> {
    try {
      globalContext.request = req;

      if (config?.beforeRequest) await config.beforeRequest(req);
      const pathname = new URL(req.url).pathname;
      const verb = req.method.toLowerCase() as HTTPVerb;

      const routeObject = matchRoute(routes, pathname);
      if (!routeObject) {
        return fileServer.serveDir(req, {
          fsRoot: path.join(Deno.cwd(), config.publicDir ?? "public"),
        });
      }

      const { route, params } = routeObject;
      const handler = route[verb].default;
      const bodyType = route[verb].body;
      globalContext.requestParams = params;

      let response;
      try {
        response =
          (await parseBody(req, bodyType)) ||
          (await runMiddlewares(req, route)) ||
          (await handler(req)) ||
          new Response("Not Found");
      } catch (error) {
        response = new Response("Oops, internal server error", { status: 500 });
        if (error instanceof Error) {
          response = new Response(error.message, { status: 500 });
        } else if (error instanceof Response) response = error;
      }

      return response;
    } finally {
      if (config?.afterRequest) await config.afterRequest(req);
      globalContext.request = null;
    }
  }
  await http.serve(handler, { port: 8080 });
}
