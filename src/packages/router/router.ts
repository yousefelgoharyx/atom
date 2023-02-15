import { MiddlewareHandler, RequestHandler, Route, Routes } from "../../types/Routes.ts";
import { path } from "../../../deps.ts";
import {
  createPathResolver,
  fetchRouteHandlerModule,
  getFileSegmants,
  isHTTPVerb,
  isJsFileExt,
  isValidDirName,
} from "../../utils/common.ts";
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

export async function createRoutesMap(basePath: string) {
  const routesMap: Routes = {};
  const currentMiddlewares: MiddlewareHandler[] = [];

  const routesPathResolver = createPathResolver(basePath);
  async function readRoutes(currentModules: string[]) {
    const modulePath = path.posix.join(...currentModules);
    const moduleAbsolutePath = routesPathResolver(modulePath);
    const httpPath = modulePath.replaceAll("(", "").replaceAll(")", "");
    const route = (routesMap[httpPath] = createEmptyRoute());

    for await (const dirEntry of Deno.readDir(moduleAbsolutePath)) {
      if (!isValidDirName(dirEntry.name.split(".")[0])) continue;

      if (dirEntry.isDirectory) await readRoutes([...currentModules, dirEntry.name]);
      else if (dirEntry.isFile) {
        const fileSegs = getFileSegmants(dirEntry.name);
        if (!fileSegs || !isJsFileExt(fileSegs[1])) continue;
        const [fileName] = fileSegs;
        const verb = fileName.slice(1, -1);
        const filePath = routesPathResolver(modulePath, dirEntry.name);
        if (verb === "middleware") {
          const module = await fetchRouteHandlerModule<MiddlewareHandler>(filePath);
          const middlewareFn = module.default;
          currentMiddlewares.push(middlewareFn);
        } else if (isHTTPVerb(verb)) {
          const module = await fetchRouteHandlerModule<RequestHandler>(filePath);

          route[verb].default = module.default;
          route[verb].middlewares = module.middlewares ?? [];
        }
      }
    }
    route.middlewares.push(...currentMiddlewares);
  }

  await readRoutes(["/"]);
  return routesMap;
}
