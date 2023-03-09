import { MiddlewareHandler, RequestHandler, Route, Routes } from "../../types/Routes.ts";
import { path } from "../../../deps.ts";
import {
  createPathResolver,
  fetchModule,
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
    get: {},
    post: {},
    put: {},
    patch: {},
    delete: {},
    middlewares: [],
  };
}

export async function createRoutesMap(basePath: string) {
  const routesMap: Routes = {};
  const currentMiddlewares: MiddlewareHandler[] = [];
  const routesResolver = createPathResolver(basePath);

  async function readRoutes(currentModules: string[]) {
    const modulePath = path.posix.join(...currentModules);
    const moduleAbsolutePath = routesResolver(modulePath);
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
        const filePath = routesResolver(modulePath, dirEntry.name);
        if (isHTTPVerb(verb)) {
          const module = await fetchModule<RequestHandler>(filePath);
          route[verb].default = module.default;
          route[verb].body = module.body;
          route[verb].middlewares = module.middlewares;
        } else if (verb === "middleware") {
          const module = await fetchModule<MiddlewareHandler>(filePath);
          if (module.default) currentMiddlewares.push(module.default);
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

export async function watchRoutes(routesDir: string, routesRef: { value: Routes }) {
  const watcher = Deno.watchFs(routesDir || "routes");
  for await (const event of watcher) {
    if (event.kind === "create") routesRef.value = await createRoutesMap(routesDir);
  }
}
