import { fileServer, http, path } from "./deps.ts";
import { HTTPVerb, Interceptor } from "./src/types/Routes.ts";
import { createRoutesMap, watchRoutes } from "./src/packages/router/router.ts";
import { runMiddlewares } from "./src/packages/middlewares/middlewares.ts";
import { parseBody } from "./src/packages/validations/validate.ts";
import { matchRoute, NotFound } from "./src/utils/common.ts";
import { runInterceptors } from "./src/packages/middlewares/interceptors.ts";
type GlobalContext = {
  request: Request | null;
  requestParams: Record<string, string>;
};

export const globalContext: GlobalContext = {
  request: null,
  requestParams: {},
};

interface BootstrapConfig {
  routesDir?: string;
  publicDir?: string;
  port?: number;
}

export interface PluginConfig {
  interceptRequest?: Interceptor<Request>;
  interceptResponse?: Interceptor<Response>;
}

const reqInterceptors: Interceptor<Request>[] = [];
const resInterceptors: Interceptor<Response>[] = [];

export function install(pluginFn: () => PluginConfig) {
  const config = pluginFn();
  if (config.interceptRequest) reqInterceptors.push(config.interceptRequest);
  if (config.interceptResponse) resInterceptors.push(config.interceptResponse);
}

export async function bootstrap(config: BootstrapConfig) {
  const { port = 8080 } = config;
  const routesRef = {
    value: await createRoutesMap(config.routesDir || "routes"),
  };

  watchRoutes(config.routesDir || "routes", routesRef);
  async function handler(request: Request): Promise<Response> {
    try {
      globalContext.request = request;
      runInterceptors(reqInterceptors, request);

      const pathname = new URL(request.url).pathname;
      const verb = request.method.toLowerCase() as HTTPVerb;
      const routeObject = matchRoute(routesRef, pathname);

      if (pathname === "/debug") {
        return new Response(JSON.stringify(routesRef.value));
      }

      if (!routeObject) {
        return fileServer.serveDir(request, {
          fsRoot: path.join(Deno.cwd(), config.publicDir ?? "public"),
        });
      }

      const { route, params } = routeObject;
      const handler = route[verb].default;
      if (!handler) return NotFound();
      const bodyType = route[verb].body;
      globalContext.requestParams = params;

      let response;
      try {
        response =
          (await parseBody(request, bodyType)) ||
          (await runMiddlewares(request, route)) ||
          (await handler(request)) ||
          NotFound();
      } catch (error) {
        response = new Response("Oops, internal server error", { status: 500 });
        if (error instanceof Response) response = error;
      }

      runInterceptors(resInterceptors, response);
      return response;
    } finally {
      globalContext.request = null;
    }
  }
  await http.serve(handler, { port });
}
