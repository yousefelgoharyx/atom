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
    const modulePath = routesResolver(...currentModules);
    let httpPath: string;
    const filteredModules = currentModules.filter((module) => {
      return !module.startsWith("@");
    });
    const lastModule = currentModules.at(-1);

    if (lastModule && lastModule.startsWith("@")) {
      httpPath = getHttpPath(path.posix.join(...currentModules));
    } else {
      httpPath = getHttpPath(path.posix.join(...filteredModules));
    }
    const route = (routesMap[httpPath] = createEmptyRoute());
    const pendingDirReads = [];

    for await (const dirEntry of Deno.readDir(modulePath)) {
      // Skip unsupported file schemes
      if (!isValidDirName(dirEntry.name.split(".")[0])) continue;

      if (dirEntry.isDirectory) {
        pendingDirReads.push([...currentModules, dirEntry.name]);
      }

      if (dirEntry.isFile) {
        const segmants = getFileSegmants(dirEntry.name);
        if (!segmants || !isJsFileExt(segmants[1])) continue;
        const verb = segmants[0].slice(1, -1);
        const filePath = path.join(modulePath, dirEntry.name);

        // Case http verb:
        if (isHTTPVerb(verb)) {
          const module = await fetchModule<RequestHandler>(filePath);
          route[verb].default = module.default;
          route[verb].body = module.body;
          route[verb].middlewares = module.middlewares;
        }

        // Case middleware
        if (verb === "middleware") {
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

  const finalRoutesMap: Routes = {};
  for (const key in routesMap) {
    if (key[1] !== "@") finalRoutesMap[key] = routesMap[key];
  }
  return finalRoutesMap;
}

export async function watchRoutes(routesDir: string, routesRef: { value: Routes }) {
  const watcher = Deno.watchFs(routesDir || "routes");
  for await (const event of watcher) {
    if (event.kind === "create") routesRef.value = await createRoutesMap(routesDir);
  }
}
