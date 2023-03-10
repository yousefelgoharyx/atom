import { HTTPVerb, RouteHandlerModule, Routes } from "../types/Routes.ts";
import { path, pathToRegexp } from "../../deps.ts";

export function getFileSegmants(file: string): string[] | null {
  const fileSegmants = file.split(".");
  if (fileSegmants.length < 2) return null;
  const fileSuffix = fileSegmants.pop()!;
  const fileName = fileSegmants.join("");

  return [fileName, fileSuffix];
}

export function isJsFileExt(ext: string) {
  return ext === "js" || ext === "ts";
}

export const isHTTPVerb = (str: string): str is HTTPVerb => {
  return (
    str === HTTPVerb.GET ||
    str === HTTPVerb.POST ||
    str === HTTPVerb.PUT ||
    str === HTTPVerb.DELETE ||
    str === HTTPVerb.PATCH
  );
};

export async function fetchModule<T>(modulePath: string): Promise<RouteHandlerModule<T>> {
  const filePath = path.toFileUrl(modulePath);
  return await import(filePath.href);
}

export function absolutePath(...str: string[]) {
  return path.posix.join(Deno.cwd(), ...str);
}

export function createPathResolver(base: string) {
  return function resolvePath(...str: string[]) {
    return path.join(Deno.cwd(), base, ...str);
  };
}

export function isValidDirName(dirEntryName: string) {
  return (
    (dirEntryName.startsWith("(") && dirEntryName.endsWith(")")) ||
    (dirEntryName.startsWith("[") && dirEntryName.endsWith("]")) ||
    dirEntryName.startsWith("@")
  );
}

export function getHttpPath(modulePath: string) {
  return modulePath
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("[", ":")
    .replaceAll("]", "");
}

export function matchRoute(routesRef: { value: Routes }, pathname: string) {
  let pathObject = null;
  if (routesRef.value[pathname])
    return { route: routesRef.value[pathname], params: null };
  for (const routePath in routesRef.value) {
    const matcher = pathToRegexp.match(routePath);
    const result = matcher(pathname);
    if (result) {
      pathObject = {
        route: routesRef.value[routePath],
        params: result.params as any,
      };
      break;
    }
  }
  return pathObject;
}

export function NotFound() {
  return new Response("Not Found", {
    status: 404,
  });
}
