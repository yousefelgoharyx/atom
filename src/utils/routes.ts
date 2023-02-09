import { MiddlewareHandler, RequestHandler, Route, Routes } from "../types/Routes.ts";
import * as path from "path";
import {
  absolutePath,
  fetchRouteHandlerModule,
  getFileSegmants,
  isHTTPVerb,
} from "./common.ts";
export function VoidHandler(_: Request) {
  return;
}
export function createEmptyRoute(): Route {
  return {
    get: {
      default: VoidHandler,
      middlewares: [],
    },
    post: {
      default: VoidHandler,
      middlewares: [],
    },
    put: {
      default: VoidHandler,
      middlewares: [],
    },
    patch: {
      default: VoidHandler,
      middlewares: [],
    },
    delete: {
      default: VoidHandler,
      middlewares: [],
    },
    middlewares: [],
  };
}

export async function createRoutesMap() {
  const routesMap: Routes = {};
  const currentMiddlewares: MiddlewareHandler[] = [];

  async function readRoutes(currentModules: string[]) {
    const modulePath = path.posix.join(...currentModules);
    const moduleAbsolutePath = absolutePath("src", "routes", modulePath);
    const route = (routesMap[modulePath] = createEmptyRoute());

    for await (const dirEntry of Deno.readDir(moduleAbsolutePath)) {
      if (dirEntry.isDirectory) await readRoutes([...currentModules, dirEntry.name]);
      else if (dirEntry.isFile) {
        const [verb] = getFileSegmants(dirEntry.name);
        const filePath = absolutePath("src", "routes", modulePath, dirEntry.name);

        if (verb === "middleware") {
          const module = await fetchRouteHandlerModule<MiddlewareHandler>(filePath);
          const middlewareFn = module.default;
          currentMiddlewares.push(middlewareFn);
        } else if (isHTTPVerb(verb)) {
          const module = await fetchRouteHandlerModule<RequestHandler>(filePath);
          route[verb].default = module.default;
          route[verb].middlewares = module.middlewares ?? [];
          route[verb].schema = module.schema;
        }
      }
    }
    route.middlewares.push(...currentMiddlewares);
  }

  await readRoutes(["/"]);
  return routesMap;
}
