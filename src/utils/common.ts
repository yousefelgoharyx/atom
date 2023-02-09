import { HTTPVerb, RouteHandlerModule } from "../types/Routes.ts";
import * as path from "path";

export function getFileSegmants(file: string): string[] {
  const fileSegmants = file.split(".");
  // TODO: Fixme
  const fileSuffix = fileSegmants.pop()!;
  const fileName = fileSegmants.join("");
  return [fileName, fileSuffix];
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

export async function fetchRouteHandlerModule<T>(
  modulePath: string
): Promise<RouteHandlerModule<T>> {
  const filePath = path.toFileUrl(modulePath);
  return await import(filePath.href);
}

export function absolutePath(...str: string[]) {
  return path.posix.join(Deno.cwd(), ...str);
}
