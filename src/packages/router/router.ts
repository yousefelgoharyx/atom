import { MiddlewareHandler, RequestHandler, Route, Routes } from "../../types/Routes.ts";
import { path } from "../../../deps.ts";
import {
  createPathResolver,
  fetchRouteHandlerModule,
  getFileSegmants,
  getHttpPath,
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
    },
    post: {
      default: VoidHandler,
    },
    put: {
      default: VoidHandler,
    },
    patch: {
      default: VoidHandler,
    },
    delete: {
      default: VoidHandler,
    },
    middlewares: [],
  };
}

export async function createRoutesMap(basePath: string | undefined = "routes") {
  const routesMap: Routes = {};
  const currentMiddlewares: MiddlewareHandler[] = [];

  const routesPathResolver = createPathResolver(basePath);
  async function readRoutes(currentModules: string[]) {
    const modulePath = path.posix.join(...currentModules);
    const moduleAbsolutePath = routesPathResolver(modulePath);
    const httpPath = getHttpPath(modulePath);
    const route = (routesMap[httpPath] = createEmptyRoute());
    const pendingDirReads = [];
    for await (const dirEntry of Deno.readDir(moduleAbsolutePath)) {
      if (!isValidDirName(dirEntry.name.split(".")[0])) continue;
      if (dirEntry.isDirectory) {
        pendingDirReads.push([...currentModules, dirEntry.name]);
      } else if (dirEntry.isFile) {
        const segmants = getFileSegmants(dirEntry.name);
        if (!segmants || !isJsFileExt(segmants[1])) continue;
        const [fileName] = segmants;

        const verb = fileName.slice(1, -1);
        const filePath = routesPathResolver(modulePath, dirEntry.name);
        if (verb === "middleware") {
          const module = await fetchRouteHandlerModule<MiddlewareHandler>(filePath);
          currentMiddlewares.push(module.default);
        } else if (isHTTPVerb(verb)) {
          const module = await fetchRouteHandlerModule<RequestHandler>(filePath);
          route[verb].default = module.default;
          route[verb].body = module.body;
          route[verb].middlewares = module.middlewares;
        }
      }
    }

    route.middlewares.push(...currentMiddlewares);
    for (const pendingDirRead of pendingDirReads) {
      await readRoutes(pendingDirRead);
      if (currentMiddlewares.length) currentMiddlewares.pop();
    }
  }

  await readRoutes(["/"]);

  return routesMap;
}
